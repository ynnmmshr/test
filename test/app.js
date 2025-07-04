import { level1Questions } from './questions_level1.js';
import { level2Questions } from './questions_level2.js';
import { level3Questions } from './questions_level3.js';

class ChemistryQuizApp {
    constructor() {
        // ローカルストレージの統計データをクリア（サーバーデータのみ使用）
        localStorage.removeItem('chemistry-quiz-stats');
        console.log('Cleared localStorage stats data - using server data only');
        
        this.currentLevel = 1;
        this.currentBlock = 0;
        this.questions = [];
        this.currentIndex = 0;
        this.correctCount = 0;
        this.selectedOption = null;
        this.questionStats = {};
        this.serverStatsLoaded = false;
        this.connectionErrorNotified = false;
        this.networkErrorNotified = false;
        this.bindEvents();
        this.loadLocalProgress();
        this.loadQuestionStats();
        this.showLevelSelection();
    }

    // ローカルストレージから進捗を読み込み
    loadLocalProgress() {
        this.localProgress = JSON.parse(localStorage.getItem('chemistryQuizProgress')) || {
            level1: {},
            level2: {},
            level3: {}
        };
    }

    // ローカルストレージに進捗を保存
    saveLocalProgress() {
        localStorage.setItem('chemistryQuizProgress', JSON.stringify(this.localProgress));
    }

    // 問題の統計情報を読み込み
    async loadQuestionStats() {
        // サーバーから統計データを読み込み（強制的にサーバーデータのみ使用）
        try {
            const response = await fetch('/.netlify/functions/get-stats');
            
            if (response.ok) {
                const responseText = await response.text();
                if (responseText) {
                    const result = JSON.parse(responseText);
                    if (result.success && result.stats) {
                        console.log('Server stats loaded (primary):', result.stats);
                        // サーバーの統計データを強制的に使用
                        this.questionStats = result.stats;
                        this.serverStatsLoaded = true;
                        console.log('Using server stats only, ignoring local storage');
                        return;
                    }
                }
            } else {
                // サーバーエラーの詳細を取得
                const errorText = await response.text();
                let errorData = {};
                try {
                    errorData = JSON.parse(errorText);
                } catch (e) {
                    errorData = { message: errorText };
                }
                
                console.error('Server error response:', {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorData
                });
                
                // 503エラー（データベース接続エラー）の場合
                if (response.status === 503) {
                    console.error('Database connection error:', errorData);
                    console.log('Falling back to local storage due to database connection error');
                    
                    // データベース接続エラーの場合はローカルストレージを使用
                    this.loadLocalStats();
                    this.serverStatsLoaded = false;
                    
                    // ユーザーに通知（一度だけ）
                    if (!this.connectionErrorNotified) {
                        alert('データベース接続エラーが発生しました。\n\n' + 
                              'ローカルストレージの統計データを使用します。\n\n' +
                              '詳細: ' + (errorData.details?.suggestion || '環境変数の設定を確認してください。'));
                        this.connectionErrorNotified = true;
                    }
                    return;
                }
            }
        } catch (error) {
            console.error('Failed to load server stats:', error);
            console.error('Network error details:', {
                name: error.name,
                message: error.message,
                type: error.type
            });
            
            // ネットワークエラーの場合もローカルストレージを使用
            console.log('Falling back to local storage due to network error');
            this.loadLocalStats();
            this.serverStatsLoaded = false;
            
            // ネットワークエラーの場合
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                if (!this.networkErrorNotified) {
                    alert('ネットワークエラーが発生しました。\n\n' +
                          'ローカルストレージの統計データを使用します。\n\n' +
                          'インターネット接続を確認し、ページを再読み込みしてください。');
                    this.networkErrorNotified = true;
                }
            }
            return;
        }
        
        // サーバーから取得できない場合のみ空のオブジェクトを使用
        this.questionStats = {};
        this.serverStatsLoaded = false;
        console.log('No server stats available, using empty stats object');
    }

    // ローカルストレージから統計を読み込み
    loadLocalStats() {
        try {
            const localStats = localStorage.getItem('chemistry-quiz-stats');
            if (localStats) {
                this.questionStats = JSON.parse(localStats);
                console.log('Local stats loaded:', this.questionStats);
            } else {
                this.questionStats = {};
            }
        } catch (error) {
            console.log('Error loading local stats:', error);
            this.questionStats = {};
        }
    }

    // ローカルストレージに統計を保存
    saveLocalStats() {
        try {
            localStorage.setItem('chemistry-quiz-stats', JSON.stringify(this.questionStats));
        } catch (error) {
            console.log('Error saving local stats:', error);
        }
    }

    // 解答をサーバーに記録
    async recordAnswer(questionId, level, isCorrect, userAnswer) {
        const key = `${level}-${questionId}`;
        
        // サーバーに送信（サーバーデータのみ使用）
        try {
            const response = await fetch('/.netlify/functions/record-answer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    questionId,
                    level,
                    isCorrect,
                    userAnswer
                })
            });
            
            // レスポンスのステータスコードをチェック
            if (!response.ok) {
                console.log(`Server responded with status: ${response.status}`);
                console.log('Server error - falling back to local storage');
                // サーバーエラーの場合はローカルストレージにフォールバック
                this.updateLocalStats(key, questionId, level, isCorrect);
                return;
            }
            
            // レスポンスが空でないかチェック
            const responseText = await response.text();
            if (!responseText) {
                console.log('Empty response from server');
                console.log('Server error - falling back to local storage');
                // サーバーエラーの場合はローカルストレージにフォールバック
                this.updateLocalStats(key, questionId, level, isCorrect);
                return;
            }
            
            const result = JSON.parse(responseText);
            if (result.success) {
                console.log('Answer recorded to server:', result.data);
                // サーバーから返された最新の統計データでローカルを更新（表示用のみ）
                this.questionStats[key] = result.data;
                // ローカルストレージには保存しない（サーバーデータのみ使用）
                console.log('Updated local display with server data, not saving to localStorage');
            } else {
                console.log('Server returned error');
                console.log('Server error - falling back to local storage');
                // サーバーエラーの場合はローカルストレージにフォールバック
                this.updateLocalStats(key, questionId, level, isCorrect);
            }
        } catch (error) {
            console.log('Failed to record answer to server:', error);
            console.log('Server error - falling back to local storage');
            // サーバーエラーの場合はローカルストレージにフォールバック
            this.updateLocalStats(key, questionId, level, isCorrect);
        }
    }

    // ローカル統計を更新（フォールバック用）
    updateLocalStats(key, questionId, level, isCorrect) {
        if (!this.questionStats[key]) {
            this.questionStats[key] = {
                questionId: parseInt(questionId),
                level: parseInt(level),
                totalAttempts: 0,
                correctAnswers: 0
            };
        }
        
        // 統計を更新
        this.questionStats[key].totalAttempts++;
        if (isCorrect) {
            this.questionStats[key].correctAnswers++;
        }
        
        // ローカルストレージに保存
        this.saveLocalStats();
        console.log('Answer recorded locally (fallback):', this.questionStats[key]);
    }

    // 問題の正答率を取得
    getQuestionAccuracy(questionId, level) {
        const key = `${level}-${questionId}`;
        const stat = this.questionStats[key];
        
        console.log('getQuestionAccuracy debug:', {
            questionId,
            level,
            key,
            stat,
            questionStats: this.questionStats
        });
        
        if (stat && stat.totalAttempts > 0) {
            const accuracy = Math.round((stat.correctAnswers / stat.totalAttempts) * 100);
            console.log(`Accuracy for ${key}: ${accuracy}% (${stat.correctAnswers}/${stat.totalAttempts})`);
            return accuracy;
        }
        console.log(`No stats found for ${key}`);
        return null;
    }

    // ブロック完了を記録
    recordBlockCompletion(level, blockIndex) {
        if (!this.localProgress[`level${level}`]) {
            this.localProgress[`level${level}`] = {};
        }
        this.localProgress[`level${level}`][`block${blockIndex}`] = {
            completed: this.correctCount === 10, // 全問正解の場合のみ完了
            completedAt: new Date().toISOString(),
            correctCount: this.correctCount,
            totalQuestions: 10
        };
        this.saveLocalProgress();
        console.log('Block completion recorded:', this.localProgress[`level${level}`][`block${blockIndex}`]);
    }

    // ブロックが完了しているかチェック
    isBlockCompleted(level, blockIndex) {
        return this.localProgress[`level${level}`]?.[`block${blockIndex}`]?.completed || false;
    }

    // ブロックの前回正答率を取得
    getBlockLastAccuracy(level, blockIndex) {
        const blockProgress = this.localProgress[`level${level}`]?.[`block${blockIndex}`];
        if (blockProgress && typeof blockProgress.correctCount === 'number' && typeof blockProgress.totalQuestions === 'number') {
            return Math.round(blockProgress.correctCount / blockProgress.totalQuestions * 100);
        }
        return null;
    }

    bindEvents() {
        // レベル選択ボタン
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const level = Number(btn.closest('.level-card').dataset.level);
                this.showBlockSelection(level);
            });
        });

        // 戻るボタン
        const backToLevelsFromBlocks = document.getElementById('back-to-levels-from-blocks');
        if (backToLevelsFromBlocks) {
            backToLevelsFromBlocks.addEventListener('click', () => {
                this.showLevelSelection();
            });
        }

        const backToBlocks = document.getElementById('back-to-blocks');
        if (backToBlocks) {
            backToBlocks.addEventListener('click', () => {
                this.showBlockSelection(this.currentLevel);
            });
        }

        // 統計画面関連のボタン
        const showStatsBtn = document.getElementById('show-stats-btn');
        if (showStatsBtn) {
            showStatsBtn.addEventListener('click', () => {
                this.showStats();
            });
        }

        const backToLevelsFromStats = document.getElementById('back-to-levels-from-stats');
        if (backToLevelsFromStats) {
            backToLevelsFromStats.addEventListener('click', () => {
                this.showLevelSelection();
            });
        }

        const resetStatsBtn = document.getElementById('reset-stats-btn');
        if (resetStatsBtn) {
            resetStatsBtn.addEventListener('click', () => {
                this.resetStats();
            });
        }

        // レベル選択ボタン（統計画面内）
        document.querySelectorAll('.level-select-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const level = Number(btn.dataset.level);
                this.showQuestionStats(level);
            });
        });

        // 問題画面のボタン
        const submitBtn = document.getElementById('submit-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.submitAnswer();
            });
        }

        const nextBtn = document.getElementById('next-btn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.nextQuestion();
            });
        }

        const retryBtn = document.getElementById('retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                this.retryQuestion();
            });
        }
    }

    showBlockSelection(level) {
        this.currentLevel = level;
        if (level === 1) this.questions = level1Questions;
        if (level === 2) this.questions = level2Questions;
        if (level === 3) this.questions = level3Questions;
        
        document.getElementById('level-selection').style.display = 'none';
        document.getElementById('block-selection').style.display = '';
        document.getElementById('quiz-screen').style.display = 'none';
        
        const blockContainer = document.getElementById('blocks-container');
        blockContainer.innerHTML = '';
        
        const totalBlocks = Math.ceil(this.questions.length / 10);
        const levelNames = ['基礎', '応用', '発展'];
        
        document.getElementById('block-selection-title').textContent = `Level ${level}: ${levelNames[level-1]} - ブロック選択`;
        
        for (let i = 0; i < totalBlocks; i++) {
            const startQuestion = i * 10 + 1;
            const endQuestion = Math.min((i + 1) * 10, this.questions.length);
            const isCompleted = this.isBlockCompleted(level, i);
            // 前回正答率の取得
            const lastAccuracy = this.getBlockLastAccuracy(level, i);
            const lastAccuracyText = lastAccuracy !== null ? `${lastAccuracy}%` : '未挑戦';
            
            console.log(`Block ${i} debug:`, {
                isCompleted: isCompleted,
                lastAccuracy: lastAccuracy,
                lastAccuracyText: lastAccuracyText,
                blockProgress: this.localProgress[`level${level}`]?.[`block${i}`]
            });
            
            const blockCard = document.createElement('div');
            blockCard.className = 'block-card';
            blockCard.dataset.block = i;
            
            if (isCompleted) {
                blockCard.classList.add('completed');
            }
            
            blockCard.innerHTML = `
                <div class="block-header">
                    <h3>ブロック ${i + 1}</h3>
                    <div class="block-badge ${isCompleted ? 'completed' : ''}">
                        ${isCompleted ? '✓ 完了' : `${endQuestion - startQuestion + 1}問`}
                    </div>
                </div>
                <div class="block-content">
                    <p>問題 ${startQuestion} - ${endQuestion}</p>
                    <div class="block-topics">
                        <span>基礎概念</span>
                        <span>計算問題</span>
                    </div>
                    <div class="block-last-accuracy">前回正答率: <span>${lastAccuracyText}</span></div>
                    ${isCompleted ? '<div class="completion-info">全問正解済み</div>' : ''}
                </div>
                <button class="block-btn ${isCompleted ? 'completed' : ''}">
                    ${isCompleted ? '再挑戦' : '開始'}
                </button>
            `;
            
            blockCard.querySelector('.block-btn').addEventListener('click', () => {
                this.startBlock(i);
            });
            
            blockContainer.appendChild(blockCard);
        }
    }

    async startBlock(blockIndex) {
        this.currentBlock = blockIndex;
        this.currentIndex = blockIndex * 10;
        this.correctCount = 0;
        this.selectedOption = null;
        
        document.getElementById('block-selection').style.display = 'none';
        document.getElementById('quiz-screen').style.display = '';
        
        const levelNames = ['基礎', '応用', '発展'];
        document.getElementById('current-level-text').textContent = `Level ${this.currentLevel}: ${levelNames[this.currentLevel-1]} - ブロック ${blockIndex + 1}`;
        
        const endIndex = Math.min((blockIndex + 1) * 10, this.questions.length);
        document.getElementById('total-questions').textContent = endIndex - this.currentIndex;
        
        await this.showQuestion();
    }

    showLevelSelection() {
        document.getElementById('quiz-screen').style.display = 'none';
        document.getElementById('block-selection').style.display = 'none';
        document.getElementById('level-selection').style.display = '';
    }

    async showQuestion() {
        const q = this.questions[this.currentIndex];
        const blockQuestionNumber = (this.currentIndex % 10) + 1;
        document.getElementById('question-number').textContent = blockQuestionNumber;
        document.getElementById('current-question').textContent = blockQuestionNumber;
        document.getElementById('question-text').textContent = q.question;
        
        // 選択肢をランダム化
        const shuffledOptions = this.shuffleOptions(q.options, q.correct);
        this.currentShuffledOptions = shuffledOptions;
        
        // サーバーから最新の統計データを取得（問題表示時の統計）
        try {
            const response = await fetch('/.netlify/functions/get-stats');
            if (response.ok) {
                const responseText = await response.text();
                if (responseText) {
                    const result = JSON.parse(responseText);
                    if (result.success && result.stats) {
                        // 問題表示時の統計を保存（解答前の統計）
                        this.questionStatsBeforeAnswer = { ...result.stats };
                        this.questionStats = result.stats;
                        console.log('Updated stats from server for question display (before answer):', result.stats);
                    }
                }
            }
        } catch (error) {
            console.log('Failed to get latest stats for question display:', error);
        }
        
        // 正答率を表示（解答前の全参加者統計）
        const key = `${this.currentLevel}-${q.id}`;
        const stats = this.questionStats[key];
        
        console.log('Question accuracy debug (before answer):', {
            questionId: q.id,
            level: this.currentLevel,
            key: key,
            stats: stats,
            questionStats: this.questionStats
        });
        
        const accuracyElement = document.getElementById('question-accuracy');
        
        if (stats) {
            const totalAttempts = stats.totalAttempts || 0;
            const correctAnswers = stats.correctAnswers || 0;
            
            if (totalAttempts > 0) {
                const accuracy = Math.round((correctAnswers / totalAttempts) * 100);
                accuracyElement.style.display = 'block';
                accuracyElement.innerHTML = `全参加者統計（解答前）: <span id="accuracy-percentage">${accuracy}</span>% (正解: ${correctAnswers}回 / 挑戦: ${totalAttempts}回)`;
                console.log(`Accuracy for ${key}: ${accuracy}% (${correctAnswers}/${totalAttempts})`);
            } else {
                // 統計データは存在するが、まだ挑戦回数が0の場合
                accuracyElement.style.display = 'block';
                accuracyElement.innerHTML = `全参加者統計（解答前）: 未挑戦 (正解: 0回 / 挑戦: 0回)`;
                console.log(`No attempts yet for ${key}`);
            }
        } else {
            // 統計データが存在しない場合
            accuracyElement.style.display = 'block';
            accuracyElement.innerHTML = `全参加者統計（解答前）: 未挑戦 (正解: 0回 / 挑戦: 0回)`;
            console.log(`No stats found for ${key}`);
        }
        
        // 進捗バーを更新
        const endIndex = Math.min((this.currentBlock + 1) * 10, this.questions.length);
        const totalQuestions = endIndex - (this.currentBlock * 10);
        const progress = (blockQuestionNumber / totalQuestions) * 100;
        document.getElementById('progress-fill').style.width = progress + '%';
        
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';
        shuffledOptions.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = `${idx + 1}. ${opt.text}`;
            btn.onclick = () => this.selectOption(idx);
            optionsContainer.appendChild(btn);
        });
        
        document.getElementById('answer-section').style.display = 'none';
        document.getElementById('submit-btn').style.display = '';
        document.getElementById('next-btn').style.display = 'none';
        document.getElementById('retry-btn').style.display = 'none';
        this.selectedOption = null;
    }

    selectOption(idx) {
        this.selectedOption = idx;
        document.querySelectorAll('.option-btn').forEach((btn, i) => {
            btn.classList.toggle('selected', i === idx);
        });
    }

    async submitAnswer() {
        if (this.selectedOption == null) {
            alert('選択肢を選んでください');
            return;
        }
        
        const q = this.questions[this.currentIndex];
        // ランダム化後の正解インデックスを取得
        const shuffledOptions = this.currentShuffledOptions;
        const correctIndex = shuffledOptions.findIndex(opt => opt.isCorrect);
        const isCorrect = this.selectedOption === correctIndex;
        if (isCorrect) this.correctCount++;
        
        // 解答を記録（ローカルストレージとサーバー）
        await this.recordAnswer(q.id, this.currentLevel, isCorrect, this.selectedOption);
        
        // 現在の問題の正答率表示を更新
        const accuracy = this.getQuestionAccuracy(q.id, this.currentLevel);
        const accuracyElement = document.getElementById('question-accuracy');
        
        if (accuracy !== null) {
            const key = `${this.currentLevel}-${q.id}`;
            const stats = this.questionStats[key];
            const totalAttempts = stats ? stats.totalAttempts : 0;
            const correctAnswers = stats ? stats.correctAnswers : 0;
            
            accuracyElement.style.display = 'block';
            accuracyElement.innerHTML = `全参加者統計: <span id="accuracy-percentage">${accuracy}</span>% (正解: ${correctAnswers}回 / 挑戦: ${totalAttempts}回)`;
            
            console.log('Updated accuracy display:', {
                questionId: q.id,
                level: this.currentLevel,
                accuracy: accuracy,
                totalAttempts: totalAttempts,
                correctAnswers: correctAnswers,
                questionStats: this.questionStats[key]
            });
        }
        
        // 選択肢の表示を更新（正解・不正解を表示）
        document.querySelectorAll('.option-btn').forEach((btn, i) => {
            if (i === correctIndex) {
                btn.classList.add('correct');
            } else if (i === this.selectedOption && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });
        
        const correctAnswerText = `${correctIndex + 1}. ${shuffledOptions[correctIndex].text}`;
        const userAnswerText = `${this.selectedOption + 1}. ${shuffledOptions[this.selectedOption].text}`;
        
        let resultText = '';
        if (isCorrect) {
            resultText = '正解！';
        } else {
            resultText = `不正解。正解は ${correctAnswerText} でした。`;
        }
        
        document.getElementById('result').textContent = resultText;
        document.getElementById('explanation').textContent = q.explanation;
        document.getElementById('answer-section').style.display = '';
        document.getElementById('submit-btn').style.display = 'none';
        
        // ブロック内での現在の問題番号（1-10）
        const blockQuestionNumber = (this.currentIndex % 10) + 1;
        const isLastQuestion = blockQuestionNumber >= 10;
        
        console.log('submitAnswer debug:', {
            currentIndex: this.currentIndex,
            blockQuestionNumber: blockQuestionNumber,
            isLastQuestion: isLastQuestion,
            correctCount: this.correctCount,
            currentBlock: this.currentBlock
        });
        
        // 最後の問題で全問正解の場合、ブロック完了を記録
        if (isLastQuestion) {
            console.log('Recording block completion for completing all questions');
            this.recordBlockCompletion(this.currentLevel, this.currentBlock);
        }
        
        // 最後の問題の場合は「戻る」ボタンを表示、そうでなければ「次の問題」ボタンを表示
        if (isLastQuestion) {
            document.getElementById('next-btn').style.display = 'none';
            document.getElementById('retry-btn').style.display = '';
            document.getElementById('retry-btn').textContent = 'ブロック選択に戻る';
        } else {
            document.getElementById('next-btn').style.display = '';
            document.getElementById('retry-btn').style.display = 'none';
        }
        
        document.getElementById('correct-count').textContent = this.correctCount;
        document.getElementById('accuracy').textContent = Math.round(this.correctCount / blockQuestionNumber * 100) + '%';
    }

    async nextQuestion() {
        this.currentIndex++;
        const blockQuestionNumber = (this.currentIndex % 10) + 1;
        
        console.log('nextQuestion called:', {
            currentIndex: this.currentIndex,
            blockQuestionNumber: blockQuestionNumber,
            currentBlock: this.currentBlock
        });
        
        // ブロック内の10問目を超えた場合はブロック選択画面に戻る
        if (blockQuestionNumber > 10) {
            console.log('Block complete, returning to block selection');
            this.showBlockSelection(this.currentLevel);
        } else {
            console.log('Showing next question');
            await this.showQuestion();
        }
    }

    async retryQuestion() {
        // 10問目の場合はブロック選択画面に戻る
        const blockQuestionNumber = (this.currentIndex % 10) + 1;
        if (blockQuestionNumber >= 10) {
            this.showBlockSelection(this.currentLevel);
        } else {
            // 通常の再挑戦
            this.currentIndex = this.currentBlock * 10;
            this.correctCount = 0;
            this.selectedOption = null;
            await this.showQuestion();
        }
    }

    // 統計画面を表示
    async showStats() {
        // サーバーから最新の統計データを取得（強制的に再取得）
        try {
            const response = await fetch('/.netlify/functions/get-stats');
            
            if (response.ok) {
                const responseText = await response.text();
                if (responseText) {
                    const result = JSON.parse(responseText);
                    if (result.success && result.stats) {
                        console.log('Server stats loaded for stats screen:', result.stats);
                        // サーバーの統計データを優先して使用
                        this.questionStats = result.stats;
                        this.serverStatsLoaded = true;
                    }
                }
            }
        } catch (error) {
            console.log('Failed to load server stats for stats screen, using cached data:', error);
        }
        
        // 全体統計を計算
        let totalAttempts = 0;
        let totalCorrectAnswers = 0;
        const levelStats = { 1: { attempts: 0, correct: 0 }, 2: { attempts: 0, correct: 0 }, 3: { attempts: 0, correct: 0 } };
        
        Object.values(this.questionStats).forEach(stat => {
            totalAttempts += stat.totalAttempts;
            totalCorrectAnswers += stat.correctAnswers;
            
            if (levelStats[stat.level]) {
                levelStats[stat.level].attempts += stat.totalAttempts;
                levelStats[stat.level].correct += stat.correctAnswers;
            }
        });
        
        // 全体統計を表示
        document.getElementById('total-attempts').textContent = `${totalAttempts}回`;
        document.getElementById('total-correct').textContent = `${totalCorrectAnswers}回`;
        document.getElementById('overall-accuracy').textContent = totalAttempts > 0 ? 
            `${Math.round((totalCorrectAnswers / totalAttempts) * 100)}%` : '0%';
        
        // レベル別統計を表示
        for (let level = 1; level <= 3; level++) {
            const stats = levelStats[level];
            const accuracy = stats.attempts > 0 ? Math.round((stats.correct / stats.attempts) * 100) : 0;
            
            document.getElementById(`level${level}-attempts`).textContent = `${stats.attempts}回`;
            document.getElementById(`level${level}-correct`).textContent = `${stats.correct}回`;
            document.getElementById(`level${level}-accuracy`).textContent = `${accuracy}%`;
        }
        
        // 問題別統計を表示（デフォルトはLevel 1）
        this.showQuestionStats(1);
        
        // 画面を切り替え
        document.getElementById('level-selection').style.display = 'none';
        document.getElementById('block-selection').style.display = 'none';
        document.getElementById('quiz-screen').style.display = 'none';
        document.getElementById('stats-screen').style.display = '';
        
        console.log('Stats screen displayed with server data:', {
            totalAttempts,
            totalCorrectAnswers,
            levelStats,
            questionStatsCount: Object.keys(this.questionStats).length
        });
    }

    // 問題別統計を表示
    showQuestionStats(level) {
        // レベル選択ボタンのアクティブ状態を更新
        document.querySelectorAll('.level-select-btn').forEach(btn => {
            btn.classList.toggle('active', Number(btn.dataset.level) === level);
        });
        
        const questionStatsList = document.getElementById('question-stats-list');
        questionStatsList.innerHTML = '';
        
        // 指定されたレベルの問題統計をフィルタリング
        const levelStats = Object.entries(this.questionStats)
            .filter(([key, stat]) => stat.level === level)
            .sort((a, b) => a[1].questionId - b[1].questionId);
        
        if (levelStats.length === 0) {
            questionStatsList.innerHTML = '<p class="no-stats">このレベルの統計データはまだありません。</p>';
            return;
        }
        
        levelStats.forEach(([key, stat]) => {
            const accuracy = stat.totalAttempts > 0 ? 
                Math.round((stat.correctAnswers / stat.totalAttempts) * 100) : 0;
            
            const statItem = document.createElement('div');
            statItem.className = 'question-stat-item';
            statItem.innerHTML = `
                <div class="question-info">
                    <div class="question-title">問題 ${stat.questionId}</div>
                    <div class="question-details">
                        挑戦: ${stat.totalAttempts}回 / 正解: ${stat.correctAnswers}回
                    </div>
                </div>
                <div class="question-accuracy ${this.getAccuracyClass(accuracy)}">
                    ${accuracy}%
                </div>
            `;
            
            questionStatsList.appendChild(statItem);
        });
    }

    // 正答率に基づいてCSSクラスを返す
    getAccuracyClass(accuracy) {
        if (accuracy >= 80) return 'accuracy-high';
        if (accuracy >= 60) return 'accuracy-medium';
        return 'accuracy-low';
    }

    // 統計をリセット
    resetStats() {
        if (confirm('本当に統計データをリセットしますか？この操作は取り消せません。')) {
            // ローカルストレージをクリア
            localStorage.removeItem('chemistry-quiz-stats');
            localStorage.removeItem('chemistryQuizProgress');
            
            // 統計データをリセット
            this.questionStats = {};
            this.localProgress = { level1: {}, level2: {}, level3: {} };
            
            console.log('Local storage and memory cleared');
            
            // 統計画面を再表示（サーバーから最新データを取得）
            this.showStats();
            
            alert('統計データをリセットしました。サーバーから最新のデータを取得します。');
        }
    }

    // ローカルストレージをクリア（デバッグ用）
    clearLocalStorage() {
        localStorage.removeItem('chemistry-quiz-stats');
        localStorage.removeItem('chemistryQuizProgress');
        console.log('Local storage cleared for debugging');
        alert('ローカルストレージをクリアしました。ページを再読み込みしてください。');
    }

    // 選択肢をランダム化する関数
    shuffleOptions(options, correctIndex) {
        // options: 配列, correctIndex: 正解のインデックス
        const arr = options.map((text, idx) => ({ text, isCorrect: idx === correctIndex }));
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.quizApp = new ChemistryQuizApp();
    
    // デバッグ用のグローバル関数を追加
    window.debugStats = () => {
        console.log('=== DEBUG STATS ===');
        console.log('Current questionStats:', window.quizApp.questionStats);
        console.log('LocalStorage chemistry-quiz-stats:', localStorage.getItem('chemistry-quiz-stats'));
        console.log('Server stats loaded flag:', window.quizApp.serverStatsLoaded);
    };
    
    window.clearAllStats = () => {
        localStorage.removeItem('chemistry-quiz-stats');
        localStorage.removeItem('chemistryQuizProgress');
        console.log('All stats cleared');
        alert('すべての統計データをクリアしました。ページを再読み込みしてください。');
    };
    
    console.log('Chemistry Quiz App initialized with server-only stats');
    console.log('Debug commands: debugStats(), clearAllStats()');
});