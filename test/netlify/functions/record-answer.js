// Netlify Function: record-answer
// This function records user answers

const fs = require('fs').promises;
const path = require('path');

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
        const { questionId, level, isCorrect, userAnswer } = JSON.parse(event.body);
        console.log('Parsed data:', { questionId, level, isCorrect, userAnswer });
        
        // 統計ファイルのパス
        const statsFilePath = path.join(__dirname, '../../data/question-stats.json');
        console.log('Stats file path:', statsFilePath);
        
        // 既存の統計データを読み込み
        let stats = {};
        try {
            const statsData = await fs.readFile(statsFilePath, 'utf8');
            stats = JSON.parse(statsData);
            console.log('Existing stats loaded:', Object.keys(stats).length, 'questions');
        } catch (error) {
            // ファイルが存在しない場合は空のオブジェクトから開始
            console.log('Stats file not found, creating new one');
        }
        
        // 問題のキー
        const questionKey = `${level}-${questionId}`;
        console.log('Question key:', questionKey);
        
        // 統計データを更新
        if (!stats[questionKey]) {
            stats[questionKey] = {
                questionId: parseInt(questionId),
                level: parseInt(level),
                totalAttempts: 0,
                correctAnswers: 0
            };
            console.log('Created new stats entry for question:', questionKey);
        }
        
        const oldTotalAttempts = stats[questionKey].totalAttempts;
        const oldCorrectAnswers = stats[questionKey].correctAnswers;
        
        stats[questionKey].totalAttempts++;
        if (isCorrect) {
            stats[questionKey].correctAnswers++;
        }
        
        console.log('Stats updated:', {
            questionKey,
            oldTotalAttempts,
            oldCorrectAnswers,
            newTotalAttempts: stats[questionKey].totalAttempts,
            newCorrectAnswers: stats[questionKey].correctAnswers
        });
        
        // 統計データをファイルに保存
        await fs.writeFile(statsFilePath, JSON.stringify(stats, null, 2), 'utf8');
        console.log('Stats file saved successfully');
        
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