import { level1Questions } from './questions_level1.js';
import { level2Questions } from './questions_level2.js';
import { level3Questions } from './questions_level3.js';

class ChemistryQuizApp {
    constructor() {
        this.currentLevel = 1;
        this.currentBlock = 0;
        this.questions = [];
        this.currentIndex = 0;
        this.correctCount = 0;
        this.selectedOption = null;
        this.questionStats = {};
        this.bindEvents();
        this.loadLocalProgress();
        this.loadQuestionStats();
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
        try {
            const response = await fetch('/.netlify/functions/get-stats');
            
            // レスポンスのステータスコードをチェック
            if (!response.ok) {
                console.log(`Server responded with status: ${response.status}`);
                if (response.status === 404) {
                    console.log('Functions not found - using local storage fallback');
                    this.loadLocalStats();
                }
                return;
            }
            
            // レスポンスが空でないかチェック
            const responseText = await response.text();
            if (!responseText) {
                console.log('Empty response from server - using local storage fallback');
                this.loadLocalStats();
                return;
            }
            
            const result = JSON.parse(responseText);
            if (result.success && result.stats) {
                // サーバーから返される統計データの構造に合わせて修正
                Object.keys(result.stats).forEach(key => {
                    this.questionStats[key] = result.stats[key];
                });
                console.log('Server question stats loaded:', this.questionStats);
            }
        } catch (error) {
            console.log('Failed to load server stats - using local storage fallback:', error);
            // エラーの詳細をログに出力
            if (error.name === 'SyntaxError') {
                console.log('JSON parsing error - server may not be responding correctly');
            }
            this.loadLocalStats();
        }
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
                if (response.status === 404) {
                    console.log('Functions not found - using local storage fallback');
                    this.recordAnswerLocal(questionId, level, isCorrect, userAnswer);
                }
                return;
            }
            
            // レスポンスが空でないかチェック
            const responseText = await response.text();
            if (!responseText) {
                console.log('Empty response from server - using local storage fallback');
                this.recordAnswerLocal(questionId, level, isCorrect, userAnswer);
                return;
            }
            
            const result = JSON.parse(responseText);
            if (result.success) {
                // サーバーから返された統計を更新
                const key = `${level}-${questionId}`;
                this.questionStats[key] = result.data;
                console.log('Answer recorded to server:', result.data);
            }
        } catch (error) {
            console.log('Failed to record answer to server - using local storage fallback:', error);
            // エラーの詳細をログに出力
            if (error.name === 'SyntaxError') {
                console.log('JSON parsing error - server may not be responding correctly');
            }
            this.recordAnswerLocal(questionId, level, isCorrect, userAnswer);
        }
    }

    // ローカルストレージに解答を記録
    recordAnswerLocal(questionId, level, isCorrect, userAnswer) {
        const key = `${level}-${questionId}`;
        
        if (!this.questionStats[key]) {
            this.questionStats[key] = {
                questionId: parseInt(questionId),
                level: parseInt(level),
                totalAttempts: 0,
                correctAnswers: 0
            };
        }
        
        this.questionStats[key].totalAttempts++;
        if (isCorrect) {
            this.questionStats[key].correctAnswers++;
        }
        
        // ローカルストレージに保存
        this.saveLocalStats();
        console.log('Answer recorded to local storage:', this.questionStats[key]);
    }

    // 問題の正答率を取得
    getQuestionAccuracy(questionId, level) {
        const key = `${level}-${questionId}`;
        const stat = this.questionStats[key];
        if (stat && stat.totalAttempts > 0) {
            return Math.round((stat.correctAnswers / stat.totalAttempts) * 100);
        }
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

    startBlock(blockIndex) {
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
        
        this.showQuestion();
    }

    showLevelSelection() {
        document.getElementById('quiz-screen').style.display = 'none';
        document.getElementById('block-selection').style.display = 'none';
        document.getElementById('level-selection').style.display = '';
    }

    showQuestion() {
        const q = this.questions[this.currentIndex];
        const blockQuestionNumber = (this.currentIndex % 10) + 1;
        document.getElementById('question-number').textContent = blockQuestionNumber;
        document.getElementById('current-question').textContent = blockQuestionNumber;
        document.getElementById('question-text').textContent = q.question;
        
        // 正答率を表示（全参加者統計）
        const accuracy = this.getQuestionAccuracy(q.id, this.currentLevel);
        const accuracyElement = document.getElementById('question-accuracy');
        const accuracyPercentageElement = document.getElementById('accuracy-percentage');
        
        console.log('Question accuracy debug:', {
            questionId: q.id,
            level: this.currentLevel,
            accuracy: accuracy,
            questionStats: this.questionStats
        });
        
        if (accuracy !== null) {
            const key = `${this.currentLevel}-${q.id}`;
            const stats = this.questionStats[key];
            const totalAttempts = stats ? stats.totalAttempts : 0;
            const correctAnswers = stats ? stats.correctAnswers : 0;
            
            accuracyPercentageElement.textContent = accuracy;
            accuracyElement.style.display = 'block';
            accuracyElement.innerHTML = `全参加者統計: <span id="accuracy-percentage">${accuracy}</span>% (正解: ${correctAnswers}回 / 挑戦: ${totalAttempts}回)`;
        } else {
            accuracyElement.style.display = 'none';
        }
        
        // 進捗バーを更新
        const endIndex = Math.min((this.currentBlock + 1) * 10, this.questions.length);
        const totalQuestions = endIndex - (this.currentBlock * 10);
        const progress = (blockQuestionNumber / totalQuestions) * 100;
        document.getElementById('progress-fill').style.width = progress + '%';
        
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';
        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = `${idx + 1}. ${opt}`;
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
        const isCorrect = this.selectedOption === q.correct;
        if (isCorrect) this.correctCount++;
        
        // サーバーに解答を記録
        await this.recordAnswer(q.id, this.currentLevel, isCorrect, this.selectedOption);
        
        // 統計データを再読み込みして画面に反映
        await this.loadQuestionStats();
        
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
        }
        
        // 選択肢の表示を更新（正解・不正解を表示）
        document.querySelectorAll('.option-btn').forEach((btn, i) => {
            if (i === q.correct) {
                btn.classList.add('correct');
            } else if (i === this.selectedOption && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });
        
        const correctAnswerText = `${q.correct + 1}. ${q.options[q.correct]}`;
        const userAnswerText = `${this.selectedOption + 1}. ${q.options[this.selectedOption]}`;
        
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

    nextQuestion() {
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
            this.showQuestion();
        }
    }

    retryQuestion() {
        // 10問目の場合はブロック選択画面に戻る
        const blockQuestionNumber = (this.currentIndex % 10) + 1;
        if (blockQuestionNumber >= 10) {
            this.showBlockSelection(this.currentLevel);
        } else {
            // 通常の再挑戦
            this.currentIndex = this.currentBlock * 10;
            this.correctCount = 0;
            this.selectedOption = null;
            this.showQuestion();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.quizApp = new ChemistryQuizApp();
});