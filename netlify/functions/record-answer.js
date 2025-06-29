// Netlify Function: record-answer
// This function records user answers using MongoDB

const { getStats, updateStats } = require('./mongodb');

exports.handler = async (event, context) => {
    console.log('record-answer function called');
    console.log('HTTP Method:', event.httpMethod);
    console.log('Event body:', event.body);
    
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

    if (event.httpMethod !== 'POST') {
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
        // リクエストボディの解析
        let requestBody;
        try {
            requestBody = JSON.parse(event.body);
        } catch (parseError) {
            console.error('Failed to parse request body:', parseError);
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: JSON.stringify({ error: 'Invalid JSON in request body' })
            };
        }

        const { questionId, level, isCorrect, userAnswer } = requestBody;
        console.log('Parsed data:', { questionId, level, isCorrect, userAnswer });
        
        // 必須パラメータの検証
        if (questionId === undefined || level === undefined || isCorrect === undefined || userAnswer === undefined) {
            console.error('Missing required parameters:', { questionId, level, isCorrect, userAnswer });
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: JSON.stringify({ error: 'Missing required parameters' })
            };
        }
        
        // 問題のキー
        const questionKey = `${level}-${questionId}`;
        console.log('Question key:', questionKey);
        
        // MongoDBから既存の統計データを取得
        let existingStats = await getStats(questionKey);
        console.log('Existing stats from MongoDB:', existingStats);
        
        // 統計データを更新
        let statsData;
        if (!existingStats) {
            // 新しい問題の統計データを作成
            statsData = {
                questionKey,
                questionId: parseInt(questionId),
                level: parseInt(level),
                totalAttempts: 1,
                correctAnswers: isCorrect ? 1 : 0,
                lastUpdated: new Date(),
                userAnswers: [{
                    answer: userAnswer,
                    isCorrect: isCorrect,
                    timestamp: new Date()
                }]
            };
            console.log('Created new stats entry for question:', questionKey);
        } else {
            // 既存の統計データを更新
            const oldTotalAttempts = existingStats.totalAttempts;
            const oldCorrectAnswers = existingStats.correctAnswers;
            
            statsData = {
                ...existingStats,
                totalAttempts: oldTotalAttempts + 1,
                correctAnswers: oldCorrectAnswers + (isCorrect ? 1 : 0),
                lastUpdated: new Date(),
                userAnswers: [
                    ...(existingStats.userAnswers || []),
                    {
                        answer: userAnswer,
                        isCorrect: isCorrect,
                        timestamp: new Date()
                    }
                ]
            };
            
            console.log('Stats updated:', {
                questionKey,
                oldTotalAttempts,
                oldCorrectAnswers,
                newTotalAttempts: statsData.totalAttempts,
                newCorrectAnswers: statsData.correctAnswers
            });
        }
        
        // MongoDBに統計データを保存
        const updateResult = await updateStats(questionKey, statsData);
        console.log('MongoDB update result:', updateResult);
        
        console.log(`Answer recorded for question ${questionKey}:`, statsData);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({ 
                success: true,
                data: {
                    questionKey: statsData.questionKey,
                    questionId: statsData.questionId,
                    level: statsData.level,
                    totalAttempts: statsData.totalAttempts,
                    correctAnswers: statsData.correctAnswers,
                    accuracy: statsData.totalAttempts > 0 ? 
                        (statsData.correctAnswers / statsData.totalAttempts * 100).toFixed(2) + '%' : '0%'
                },
                saved: true,
                message: 'Answer recorded successfully in MongoDB',
                mongodbResult: {
                    matchedCount: updateResult.matchedCount,
                    modifiedCount: updateResult.modifiedCount,
                    upsertedCount: updateResult.upsertedCount
                }
            })
        };

    } catch (error) {
        console.error('Error recording answer:', error);
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