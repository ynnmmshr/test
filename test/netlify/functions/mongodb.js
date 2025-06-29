// MongoDB接続ユーティリティ
const { MongoClient } = require('mongodb');

let client = null;
let db = null;

// MongoDB接続を取得（シングルトンパターン）
async function getConnection() {
    if (client && client.topology && client.topology.isConnected()) {
        return { client, db };
    }

    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI environment variable is not set');
        }

        client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        await client.connect();
        db = client.db(process.env.MONGODB_DB_NAME || 'chemistry-quiz');
        
        console.log('MongoDB connected successfully');
        return { client, db };
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

// 接続を閉じる
async function closeConnection() {
    if (client) {
        await client.close();
        client = null;
        db = null;
        console.log('MongoDB connection closed');
    }
}

// 統計データを取得
async function getStats(questionKey) {
    const { db } = await getConnection();
    const collection = db.collection('question-stats');
    
    const stats = await collection.findOne({ questionKey });
    return stats || null;
}

// 統計データを更新
async function updateStats(questionKey, statsData) {
    const { db } = await getConnection();
    const collection = db.collection('question-stats');
    
    const result = await collection.updateOne(
        { questionKey },
        { $set: statsData },
        { upsert: true }
    );
    
    return result;
}

// 全統計データを取得
async function getAllStats() {
    const { db } = await getConnection();
    const collection = db.collection('question-stats');
    
    const stats = await collection.find({}).toArray();
    return stats;
}

module.exports = {
    getConnection,
    closeConnection,
    getStats,
    updateStats,
    getAllStats
}; 