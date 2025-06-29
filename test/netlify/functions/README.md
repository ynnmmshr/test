# Chemistry Quiz - Netlify Functions with MongoDB

このディレクトリには、化学クイズアプリケーションのNetlify Functionsが含まれています。統計データの永続化のためにMongoDBを使用しています。

## ファイル構成

- `record-answer.js` - ユーザーの回答を記録し、統計データを更新
- `get-stats.js` - 統計データを取得
- `mongodb.js` - MongoDB接続とデータ操作のユーティリティ
- `package.json` - 依存関係の定義

## セットアップ手順

### 1. MongoDB Atlas のセットアップ

1. [MongoDB Atlas](https://www.mongodb.com/atlas) にアカウントを作成
2. 新しいクラスターを作成（無料プランで十分）
3. データベースユーザーを作成
4. ネットワークアクセスを設定（IPアドレス `0.0.0.0/0` で全アクセス許可）
5. 接続文字列を取得

### 2. 環境変数の設定

Netlifyのダッシュボードで以下の環境変数を設定：

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chemistry-quiz?retryWrites=true&w=majority
MONGODB_DB_NAME=chemistry-quiz
NODE_ENV=production
```

### 3. 依存関係のインストール

```bash
cd netlify/functions
npm install
```

## データベーススキーマ

### question-stats コレクション

```javascript
{
  _id: ObjectId,
  questionKey: "1-1", // "level-questionId" 形式
  questionId: 1,
  level: 1,
  totalAttempts: 10,
  correctAnswers: 7,
  lastUpdated: ISODate("2024-01-01T00:00:00.000Z"),
  userAnswers: [
    {
      answer: "H2O",
      isCorrect: true,
      timestamp: ISODate("2024-01-01T00:00:00.000Z")
    }
  ]
}
```

## API エンドポイント

### POST /api/record-answer

回答を記録します。

**リクエスト例:**
```javascript
{
  "questionId": 1,
  "level": 1,
  "isCorrect": true,
  "userAnswer": "H2O"
}
```

**レスポンス例:**
```javascript
{
  "success": true,
  "data": {
    "questionKey": "1-1",
    "questionId": 1,
    "level": 1,
    "totalAttempts": 10,
    "correctAnswers": 7,
    "accuracy": "70.00%"
  },
  "saved": true,
  "message": "Answer recorded successfully in MongoDB"
}
```

### GET /api/get-stats

統計データを取得します。

**レスポンス例:**
```javascript
{
  "success": true,
  "stats": {
    "1-1": {
      "questionId": 1,
      "level": 1,
      "totalAttempts": 10,
      "correctAnswers": 7,
      "accuracy": "70.00%",
      "lastUpdated": "2024-01-01T00:00:00.000Z"
    }
  },
  "overallStats": {
    "totalQuestions": 1,
    "totalAttempts": 10,
    "totalCorrectAnswers": 7,
    "overallAccuracy": "70.00%"
  }
}
```

## エラーハンドリング

- **400**: バリデーションエラー（必須パラメータ不足、JSON形式エラー）
- **405**: メソッド不許可
- **503**: データベース接続エラー
- **500**: 内部サーバーエラー

## 開発時の注意事項

1. **ローカル開発**: `netlify dev` を使用してローカルでテスト
2. **環境変数**: `.env` ファイルでローカル環境変数を設定
3. **ログ**: Netlify FunctionsのログはNetlifyダッシュボードで確認可能

## トラブルシューティング

### MongoDB接続エラー

1. 環境変数 `MONGODB_URI` が正しく設定されているか確認
2. MongoDB Atlasのネットワークアクセス設定を確認
3. データベースユーザーの認証情報を確認

### 関数が動作しない

1. `package.json` の依存関係が正しくインストールされているか確認
2. Netlifyのビルドログでエラーがないか確認
3. 環境変数が正しく設定されているか確認

## セキュリティ考慮事項

- 本番環境ではCORS設定を適切に制限する
- MongoDB Atlasのネットワークアクセスを必要最小限に制限する
- 環境変数は適切に管理し、公開リポジトリにコミットしない 