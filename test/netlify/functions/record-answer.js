// Netlify Function: record-answer
// This function records user answers

exports.handler = async (event, context) => {
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
        const { questionId, level, isCorrect, userAnswer } = JSON.parse(event.body);
        
        // 本番環境では統計を記録せず、成功レスポンスのみ返す
        // 実際の統計はローカルストレージフォールバックで管理
        
        const questionKey = `${level}-${questionId}`;
        const mockStats = {
            questionId: parseInt(questionId),
            level: parseInt(level),
            totalAttempts: 1,
            correctAnswers: isCorrect ? 1 : 0
        };

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({ 
                success: true,
                data: mockStats,
                saved: false
            })
        };

    } catch (error) {
        console.error('Error recording answer:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
}; 