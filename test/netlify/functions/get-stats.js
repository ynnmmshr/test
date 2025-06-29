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
        // MongoDBから全統計データを取得
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