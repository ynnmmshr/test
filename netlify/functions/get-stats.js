// Netlify Function: get-stats
// This function retrieves question statistics from MongoDB

const { getAllStats } = require('./mongodb');

exports.handler = async (event, context) => {
    console.log('get-stats function called');
    console.log('HTTP Method:', event.httpMethod);
    
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
        console.log('Retrieving all stats from database...');
        const stats = await getAllStats();
        
        console.log('Stats retrieved successfully:', {
            totalQuestions: Object.keys(stats).length,
            sampleKeys: Object.keys(stats).slice(0, 3)
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
                totalQuestions: Object.keys(stats).length,
                message: 'Stats retrieved successfully'
            })
        };

    } catch (error) {
        console.error('Error retrieving stats:', error);
        console.error('Error stack:', error.stack);
        
        // MongoDB接続エラーの場合の特別な処理
        if (error.message.includes('MONGODB_URI') || error.message.includes('MongoDB')) {
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
                    details: process.env.NODE_ENV === 'development' ? error.message : undefined
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
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            })
        };
    }
}; 