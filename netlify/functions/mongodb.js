// MongoDB接続ユーティリティ
require('dotenv').config();
const { MongoClient } = require('mongodb');

// 環境変数の詳細チェック
function checkEnvironmentVariables() {
    const envCheck = {
        MONGODB_URI: process.env.MONGODB_URI || 'Not set',
        MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || 'chemistry-quiz (default)',
        NODE_ENV: process.env.NODE_ENV || 'Not set'
    };
    
    console.log('Environment variables check:', envCheck);
    
    // 開発環境ではMongoDB接続文字列がなくてもモックデータを使用
    if (process.env.NODE_ENV === 'development' && !process.env.MONGODB_URI) {
        console.log('Development mode: Using mock data instead of MongoDB');
        return envCheck;
    }
    
    if (!process.env.MONGODB_URI) {
        throw new Error(
            'MONGODB_URI environment variable is not set\n\n' +
            'Please set the following environment variables:\n' +
            '1. MONGODB_URI: Your MongoDB Atlas connection string\n' +
            '2. MONGODB_DB_NAME: Database name (optional, defaults to "chemistry-quiz")\n\n' +
            'For local development, you can:\n' +
            '1. Create a .env file in netlify/functions/\n' +
            '2. Add: MONGODB_URI=your_connection_string\n' +
            '3. Install dotenv: npm install dotenv\n\n' +
            'For production (Netlify):\n' +
            '1. Go to Netlify Dashboard → Site Settings → Environment Variables\n' +
            '2. Add MONGODB_URI with your MongoDB Atlas connection string\n\n' +
            'MongoDB Atlas setup:\n' +
            '1. Create account at https://www.mongodb.com/atlas\n' +
            '2. Create a cluster (M0 Free)\n' +
            '3. Create database user with read/write permissions\n' +
            '4. Add network access (0.0.0.0/0)\n' +
            '5. Get connection string from "Connect" button'
        );
    }
    
    return envCheck;
}

let client = null;
let db = null;

// MongoDB接続を取得（シングルトンパターン）
async function getConnection() {
    if (client && client.topology && client.topology.isConnected()) {
        console.log('Using existing MongoDB connection');
        return { client, db };
    }

    try {
        // 環境変数をチェック
        checkEnvironmentVariables();
        
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI environment variable is not set');
        }

        console.log('Creating new MongoDB connection...');
        console.log('URI format check:', uri.substring(0, 20) + '...');
        
        client = new MongoClient(uri, {
            serverSelectionTimeoutMS: 5000, // 5秒でタイムアウト
            connectTimeoutMS: 10000, // 10秒で接続タイムアウト
        });

        console.log('Attempting to connect to MongoDB...');
        await client.connect();
        
        db = client.db(process.env.MONGODB_DB_NAME || 'chemistry-quiz');
        
        console.log('MongoDB connected successfully');
        console.log('Database name:', db.databaseName);
        
        return { client, db };
    } catch (error) {
        console.error('MongoDB connection error:', error);
        console.error('Connection error details:', {
            name: error.name,
            message: error.message,
            code: error.code,
            errno: error.errno
        });
        
        // 接続をリセット
        client = null;
        db = null;
        
        throw error;
    }
}

// 接続を閉じる
async function closeConnection() {
    if (client) {
        try {
            await client.close();
            console.log('MongoDB connection closed');
        } catch (error) {
            console.error('Error closing MongoDB connection:', error);
        }
        client = null;
        db = null;
    }
}

// 統計データを取得
async function getStats(questionKey = null) {
    try {
        // 環境変数をチェック
        const envCheck = checkEnvironmentVariables();
        
        // 開発環境では常にモックデータを使用（MongoDB接続エラーを回避）
        if (process.env.NODE_ENV === 'development') {
            console.log('Development mode: Using mock data for reliable testing');
            return getMockStats(questionKey);
        }
        
        const { db } = await getConnection();
        const collection = db.collection('question_stats');
        
        if (questionKey) {
            const result = await collection.findOne({ questionKey });
            console.log(`Stats retrieved for ${questionKey}:`, result);
            return result;
        } else {
            const results = await collection.find({}).toArray();
            console.log(`All stats retrieved: ${results.length} records`);
            return results;
        }
    } catch (error) {
        console.error('Error getting stats for', questionKey, ':', error);
        throw error;
    }
}

// 統計データを更新
async function updateStats(questionKey, statsData) {
    try {
        // 環境変数をチェック
        const envCheck = checkEnvironmentVariables();
        
        // 開発環境では常にモックデータを使用（MongoDB接続エラーを回避）
        if (process.env.NODE_ENV === 'development') {
            console.log('Development mode: Using mock data update for reliable testing');
            return updateMockStats(questionKey, statsData);
        }
        
        const { db } = await getConnection();
        const collection = db.collection('question_stats');
        
        console.log(`Updating stats for ${questionKey}:`, statsData);
        
        const result = await collection.updateOne(
            { questionKey },
            { $set: statsData },
            { upsert: true }
        );
        
        console.log(`Update result for ${questionKey}:`, result);
        return result;
    } catch (error) {
        console.error('Error updating stats for', questionKey, ':', error);
        throw error;
    }
}

// 全統計データを取得
async function getAllStats() {
    try {
        // 環境変数をチェック
        const envCheck = checkEnvironmentVariables();
        
        // 開発環境では常にモックデータを使用（MongoDB接続エラーを回避）
        if (process.env.NODE_ENV === 'development') {
            console.log('Development mode: Using mock data for getAllStats for reliable testing');
            return getMockStats();
        }
        
        const { db } = await getConnection();
        const collection = db.collection('question_stats');
        
        const results = await collection.find({}).toArray();
        console.log(`All stats retrieved: ${results.length} records`);
        
        // 結果をオブジェクト形式に変換
        const statsObject = {};
        results.forEach(stat => {
            statsObject[stat.questionKey] = stat;
        });
        
        return statsObject;
    } catch (error) {
        console.error('Error getting all stats:', error);
        throw error;
    }
}

// モックデータ（開発環境用）
const mockStats = {
    "1-1": {
        questionKey: "1-1",
        questionId: 1,
        level: 1,
        totalAttempts: 2,
        correctAnswers: 1,
        lastUpdated: new Date(),
        userAnswers: [
            { answer: "H2O", isCorrect: true, timestamp: new Date() },
            { answer: "CO2", isCorrect: false, timestamp: new Date() }
        ]
    },
    "1-2": {
        questionKey: "1-2",
        questionId: 2,
        level: 1,
        totalAttempts: 1,
        correctAnswers: 1,
        lastUpdated: new Date(),
        userAnswers: [
            { answer: "NaCl", isCorrect: true, timestamp: new Date() }
        ]
    }
};

// モックデータを取得
function getMockStats(questionKey = null) {
    if (questionKey) {
        return mockStats[questionKey] || null;
    }
    return mockStats;
}

// モックデータを更新
function updateMockStats(questionKey, statsData) {
    // 既存のデータを完全に置き換える（重複更新を防ぐ）
    mockStats[questionKey] = {
        ...statsData,
        lastUpdated: new Date()
    };
    console.log('Mock stats updated for:', questionKey, statsData);
    return { matchedCount: 1, modifiedCount: 1, upsertedCount: 0 };
}

module.exports = {
    getConnection,
    closeConnection,
    getStats,
    updateStats,
    getAllStats,
    getMockStats,
    updateMockStats
}; 