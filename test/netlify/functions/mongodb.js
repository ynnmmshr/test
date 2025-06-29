// MongoDB接続ユーティリティ
const { MongoClient } = require('mongodb');

let client = null;
let db = null;

// MongoDB接続を取得（シングルトンパターン）
async function getConnection() {
    if (client && client.topology && client.topology.isConnected()) {
        console.log('Using existing MongoDB connection');
        return { client, db };
    }

    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI environment variable is not set');
        }

        console.log('Creating new MongoDB connection...');
        console.log('URI format check:', uri.substring(0, 20) + '...');
        
        client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
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
async function getStats(questionKey) {
    try {
        const { db } = await getConnection();
        const collection = db.collection('question-stats');
        
        console.log(`Getting stats for question key: ${questionKey}`);
        const stats = await collection.findOne({ questionKey });
        console.log(`Stats found for ${questionKey}:`, stats ? 'Yes' : 'No');
        
        return stats || null;
    } catch (error) {
        console.error(`Error getting stats for ${questionKey}:`, error);
        throw error;
    }
}

// 統計データを更新
async function updateStats(questionKey, statsData) {
    try {
        const { db } = await getConnection();
        const collection = db.collection('question-stats');
        
        console.log(`Updating stats for question key: ${questionKey}`);
        const result = await collection.updateOne(
            { questionKey },
            { $set: statsData },
            { upsert: true }
        );
        
        console.log(`Update result for ${questionKey}:`, {
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
            upsertedCount: result.upsertedCount
        });
        
        return result;
    } catch (error) {
        console.error(`Error updating stats for ${questionKey}:`, error);
        throw error;
    }
}

// 全統計データを取得
async function getAllStats() {
    try {
        const { db } = await getConnection();
        const collection = db.collection('question-stats');
        
        console.log('Getting all stats from MongoDB...');
        const stats = await collection.find({}).toArray();
        console.log(`Retrieved ${stats.length} stats records from MongoDB`);
        
        return stats;
    } catch (error) {
        console.error('Error getting all stats:', error);
        throw error;
    }
}

module.exports = {
    getConnection,
    closeConnection,
    getStats,
    updateStats,
    getAllStats
}; 