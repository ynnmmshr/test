# 本番環境デプロイ手順

## 🚀 Netlifyへのデプロイ

### 1. GitHubリポジトリの準備

1. 現在のプロジェクトをGitHubにプッシュ
2. リポジトリを公開またはプライベートに設定

### 2. Netlifyでのデプロイ

1. [Netlify](https://netlify.com)にアクセス
2. "New site from Git" をクリック
3. GitHubを選択し、リポジトリを接続
4. 以下の設定でデプロイ：
   - **Build command**: 空欄（静的サイトのため）
   - **Publish directory**: `.`（ルートディレクトリ）
   - **Functions directory**: `netlify/functions`

### 3. 環境変数の設定

Netlifyダッシュボードで以下の環境変数を設定：

#### 開発環境（dev）
| Key | Value |
|-----|-------|
| MONGODB_URI | mongodb+srv://chemistry-quiz-user:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/chemistry-quiz?retryWrites=true&w=majority |
| MONGODB_DB_NAME | chemistry-quiz |
| NODE_ENV | development |

#### 本番環境（production）
| Key | Value |
|-----|-------|
| MONGODB_URI | mongodb+srv://chemistry-quiz-user:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/chemistry-quiz?retryWrites=true&w=majority |
| MONGODB_DB_NAME | chemistry-quiz |
| NODE_ENV | production |

### 4. MongoDB Atlas設定（本番用）

#### 4.1 MongoDB Atlasアカウント作成
1. [MongoDB Atlas](https://www.mongodb.com/atlas) にアクセス
2. 無料アカウントを作成
3. M0 Freeクラスターを作成

#### 4.2 データベース設定
1. **データベースユーザー作成**:
   - Security → Database Access
   - "Add New Database User"
   - Username: `chemistry-quiz-user`
   - Password: 安全なパスワードを設定
   - Built-in Role: `Read and write to any database`

2. **ネットワークアクセス設定**:
   - Security → Network Access
   - "Add IP Address"
   - "Allow Access from Anywhere" (0.0.0.0/0) を選択

3. **接続文字列取得**:
   - Clusters → "Connect"
   - "Connect your application"
   - Driver: "Node.js"
   - 接続文字列をコピー

#### 4.3 環境変数更新
取得した接続文字列でNetlifyの環境変数を更新

### 5. デプロイ後の確認

1. **サイトURLにアクセス**
2. **Netlify Functionsの動作確認**:
   - `https://your-site.netlify.app/.netlify/functions/get-stats`
   - `https://your-site.netlify.app/.netlify/functions/record-answer`

3. **アプリケーションの動作確認**:
   - 問題解答機能
   - 統計表示機能
   - 解答記録機能

### 6. トラブルシューティング

#### 環境変数が読み込まれない場合
1. Netlifyダッシュボードで環境変数を再確認
2. デプロイを再実行
3. ブラウザのキャッシュをクリア

#### MongoDB接続エラーの場合
1. 接続文字列の確認
2. MongoDB Atlasのネットワークアクセス設定
3. データベースユーザーの権限確認

#### Functionsが動作しない場合
1. Netlify Functionsのログを確認
2. 依存関係の確認（package.json）
3. 関数の構文エラーを確認

### 7. 本番環境での動作

- **開発環境**: モックデータを使用（MongoDB接続エラー時）
- **本番環境**: 実際のMongoDB Atlasを使用
- **フォールバック**: サーバーエラー時にローカルストレージを使用

### 8. セキュリティ注意事項

- パスワードは安全に管理
- 本番環境では強力なパスワードを使用
- 必要に応じてIPアドレス制限を設定
- 環境変数は機密情報として扱う

## 📝 デプロイ後のメンテナンス

1. **定期的なバックアップ**: MongoDB Atlasの自動バックアップを有効化
2. **監視**: NetlifyのログとMongoDB Atlasのメトリクスを監視
3. **更新**: 定期的に依存関係を更新
4. **セキュリティ**: 定期的にパスワードを変更 