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
            
            // 既存の統計データを読み込み
            try {
                const statsData = await fs.readFile(statsFilePath, 'utf8');
                stats = JSON.parse(statsData);
                console.log('Existing stats loaded:', Object.keys(stats).length, 'questions');
            } catch (readError) {
                console.log('Stats file not found or invalid, creating new one:', readError.message);
                // ファイルが存在しない場合は空のオブジェクトから開始
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
                    
                    // 既存の統計データを読み込み
                    try {
                        const statsData = await fs.readFile(statsFilePath, 'utf8');
                        stats = JSON.parse(statsData);
                        console.log('Existing stats loaded:', Object.keys(stats).length, 'questions');
                    } catch (readError) {
                        console.log('Stats file not found or invalid, creating new one:', readError.message);
                    }
                    break;
                } catch (err) {
                    console.log('Path not accessible:', altPath);
                }
            }
            
            if (!statsFilePath) {
                console.log('Could not find stats file in any location - proceeding with empty stats');
                // ファイルが見つからない場合は空のオブジェクトから開始
            }
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
        
        // Netlify環境ではファイル書き込みができないため、読み取り専用として扱う
        // 実際の統計更新はクライアント側のローカルストレージで行う
        console.log('Note: File write skipped in Netlify environment - stats updated in memory only');
        
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
                saved: false, // Netlify環境ではファイルに保存できない
                message: 'Answer recorded (local storage fallback recommended)'
            })
        };

    } catch (error) {
        console.error('Error recording answer:', error);
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