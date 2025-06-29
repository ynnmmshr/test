// Netlify Function: get-stats
// This function retrieves question statistics from MongoDB

const { getAllStats } = require('./mongodb');

exports.handler = async (event, context) => {
    console.log('get-stats function called');
    console.log('HTTP Method:', event.httpMethod);
    console.log('Environment variables check:', {
        MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set',
        MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || 'chemistry-quiz (default)',
        NODE_ENV: process.env.NODE_ENV || 'Not set'
    });
    
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

    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // 環境変数の確認
        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI environment variable is not set');
            return {
                statusCode: 503,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: JSON.stringify({ 
                    error: 'Database configuration error',
                    message: 'MONGODB_URI environment variable is not set. Please configure MongoDB connection.',
                    details: 'Check Netlify environment variables configuration'
                })
            };
        }

        // MongoDBから全統計データを取得
        console.log('Attempting to get stats from MongoDB...');
        const statsArray = await getAllStats();
        console.log('Stats loaded from MongoDB:', statsArray.length, 'questions');
        
        // 統計データをquestionKeyをキーとしたオブジェクトに変換
        const stats = {};
        let totalAttempts = 0;
        let totalCorrectAnswers = 0;
        
        statsArray.forEach(stat => {
            stats[stat.questionKey] = {
                questionId: stat.questionId,
                level: stat.level,
                totalAttempts: stat.totalAttempts,
                correctAnswers: stat.correctAnswers,
                accuracy: stat.totalAttempts > 0 ? 
                    (stat.correctAnswers / stat.totalAttempts * 100).toFixed(2) + '%' : '0%',
                lastUpdated: stat.lastUpdated
            };
            
            totalAttempts += stat.totalAttempts;
            totalCorrectAnswers += stat.correctAnswers;
        });
        
        // 全体統計を計算
        const overallStats = {
            totalQuestions: statsArray.length,
            totalAttempts: totalAttempts,
            totalCorrectAnswers: totalCorrectAnswers,
            overallAccuracy: totalAttempts > 0 ? 
                (totalCorrectAnswers / totalAttempts * 100).toFixed(2) + '%' : '0%'
        };
        
        console.log('Processed stats data:', {
            questionCount: Object.keys(stats).length,
            overallStats: overallStats
        });
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({ 
                success: true,
                stats: stats,
                overallStats: overallStats,
                message: 'Statistics retrieved successfully from MongoDB'
            })
        };

    } catch (error) {
        console.error('Error getting stats:', error);
        console.error('Error stack:', error.stack);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            code: error.code,
            errno: error.errno
        });
        
        // MongoDB接続エラーの場合の特別な処理
        if (error.message.includes('MONGODB_URI') || 
            error.message.includes('MongoDB') || 
            error.message.includes('ECONNREFUSED') ||
            error.message.includes('ENOTFOUND') ||
            error.message.includes('ETIMEDOUT')) {
            return {
                statusCode: 503,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: JSON.stringify({ 
                    error: 'Database connection error',
                    message: 'Unable to connect to MongoDB. Please check your database configuration.',
                    details: {
                        error: error.message,
                        code: error.code,
                        suggestion: 'Verify MONGODB_URI environment variable and MongoDB Atlas network access settings'
                    }
                })
            };
        }
        
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: error.message,
                details: {
                    name: error.name,
                    code: error.code,
                    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
                }
            })
        };
    }
}; 