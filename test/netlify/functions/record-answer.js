// Netlify Function: record-answer
// This function records user answers

const fs = require('fs').promises;
const path = require('path');

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
        
        // 統計ファイルのパス
        const statsFilePath = path.join(__dirname, '../../data/question-stats.json');
        
        // 既存の統計データを読み込み
        let stats = {};
        try {
            const statsData = await fs.readFile(statsFilePath, 'utf8');
            stats = JSON.parse(statsData);
        } catch (error) {
            // ファイルが存在しない場合は空のオブジェクトから開始
            console.log('Stats file not found, creating new one');
        }
        
        // 問題のキー
        const questionKey = `${level}-${questionId}`;
        
        // 統計データを更新
        if (!stats[questionKey]) {
            stats[questionKey] = {
                questionId: parseInt(questionId),
                level: parseInt(level),
                totalAttempts: 0,
                correctAnswers: 0
            };
        }
        
        stats[questionKey].totalAttempts++;
        if (isCorrect) {
            stats[questionKey].correctAnswers++;
        }
        
        // 統計データをファイルに保存
        await fs.writeFile(statsFilePath, JSON.stringify(stats, null, 2), 'utf8');
        
        console.log(`Answer recorded for question ${questionKey}:`, stats[questionKey]);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({ 
                success: true,
                data: stats[questionKey],
                saved: true
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