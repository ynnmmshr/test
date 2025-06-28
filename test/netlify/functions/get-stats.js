// Netlify Function: get-stats
// This function retrieves question statistics

const fs = require('fs').promises;
const path = require('path');

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
        // 統計ファイルのパス（Netlify環境に適応）
        let statsFilePath;
        let stats = {};
        
        try {
            // まず相対パスで試行
            statsFilePath = path.join(process.cwd(), 'data', 'question-stats.json');
            console.log('Trying stats file path:', statsFilePath);
            
            // ファイルの存在確認
            await fs.access(statsFilePath);
            console.log('Stats file found at:', statsFilePath);
            
            // 統計データを読み込み
            try {
                const statsData = await fs.readFile(statsFilePath, 'utf8');
                stats = JSON.parse(statsData);
                console.log('Stats loaded from file:', Object.keys(stats).length, 'questions');
            } catch (readError) {
                console.log('Stats file not found or invalid, returning empty stats:', readError.message);
                stats = {};
            }
            
        } catch (accessError) {
            console.log('Primary path not accessible, trying alternative paths');
            
            // 代替パスを試行
            const alternativePaths = [
                path.join(__dirname, '..', '..', 'data', 'question-stats.json'),
                path.join(__dirname, '..', 'data', 'question-stats.json'),
                path.join(process.cwd(), '..', 'data', 'question-stats.json')
            ];
            
            for (const altPath of alternativePaths) {
                try {
                    console.log('Trying alternative path:', altPath);
                    await fs.access(altPath);
                    statsFilePath = altPath;
                    console.log('Stats file found at alternative path:', statsFilePath);
                    
                    // 統計データを読み込み
                    try {
                        const statsData = await fs.readFile(statsFilePath, 'utf8');
                        stats = JSON.parse(statsData);
                        console.log('Stats loaded from file:', Object.keys(stats).length, 'questions');
                    } catch (readError) {
                        console.log('Stats file not found or invalid, returning empty stats:', readError.message);
                        stats = {};
                    }
                    break;
                } catch (err) {
                    console.log('Path not accessible:', altPath);
                }
            }
            
            if (!statsFilePath) {
                console.log('Could not find stats file in any location - returning empty stats');
                stats = {};
            }
        }
        
        console.log('Final stats data:', stats);
        
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
        console.error('Error stack:', error.stack);
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