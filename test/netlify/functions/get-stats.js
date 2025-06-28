// Netlify Function: get-stats
// This function retrieves question statistics

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
        // 統計ファイルのパス
        const statsFilePath = path.join(__dirname, '../../data/question-stats.json');
        
        // 統計データを読み込み
        let stats = {};
        try {
            const statsData = await fs.readFile(statsFilePath, 'utf8');
            stats = JSON.parse(statsData);
            console.log('Stats loaded from file:', Object.keys(stats).length, 'questions');
        } catch (error) {
            // ファイルが存在しない場合は空のオブジェクトを返す
            console.log('Stats file not found, returning empty stats');
            stats = {};
        }
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({ 
                success: true,
                stats: stats
            })
        };

    } catch (error) {
        console.error('Error getting stats:', error);
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