// Netlify Function: test-mongodb
// This function tests MongoDB connection

const { getConnection } = require('./mongodb');

exports.handler = async (event, context) => {
    console.log('test-mongodb function called');
    
    // CORS対応
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
            },
            body: ''
        };
    }

    try {
        // 環境変数の確認
        const envInfo = {
            MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set',
            MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || 'chemistry-quiz (default)',
            NODE_ENV: process.env.NODE_ENV || 'Not set'
        };
        
        console.log('Environment variables:', envInfo);
        
        // MongoDB接続テスト
        if (!process.env.MONGODB_URI) {
            return {
                statusCode: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: JSON.stringify({
                    error: 'MongoDB URI not configured',
                    message: 'MONGODB_URI environment variable is not set',
                    envInfo: envInfo
                })
            };
        }
        
        // 接続テスト
        const { client, db } = await getConnection();
        
        // データベース情報を取得
        const dbInfo = await db.admin().listDatabases();
        const collections = await db.listCollections().toArray();
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                success: true,
                message: 'MongoDB connection successful',
                envInfo: envInfo,
                dbInfo: {
                    databaseName: db.databaseName,
                    collections: collections.map(c => c.name),
                    totalDatabases: dbInfo.databases.length
                },
                connection: {
                    isConnected: client.topology && client.topology.isConnected(),
                    topology: client.topology ? 'Connected' : 'Not connected'
                }
            })
        };

    } catch (error) {
        console.error('MongoDB test error:', error);
        console.error('Error stack:', error.stack);
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                error: 'MongoDB connection failed',
                message: error.message,
                stack: error.stack,
                details: {
                    name: error.name,
                    code: error.code,
                    errno: error.errno
                }
            })
        };
    }
}; 