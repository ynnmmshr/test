# MongoDB Atlas 設定手順

## 1. MongoDB Atlas アカウント作成

1. [MongoDB Atlas](https://www.mongodb.com/atlas) にアクセス
2. "Try Free" をクリック
3. アカウント情報を入力してサインアップ
4. 組織名とプロジェクト名を設定

## 2. クラスター作成

1. "Build a Database" をクリック
2. "FREE" プラン（M0）を選択
3. クラウドプロバイダーとリージョンを選択（推奨：AWS + Tokyo）
4. "Create" をクリック

## 3. データベースユーザー作成

1. 左メニューから "Database Access" をクリック
2. "Add New Database User" をクリック
3. 以下の設定でユーザーを作成：
   - **Authentication Method**: Password
   - **Username**: `chemistry-quiz-user`
   - **Password**: 安全なパスワードを設定（メモしておく）
   - **Built-in Role**: `Read and write to any database`
4. "Add User" をクリック

## 4. ネットワークアクセス設定

1. 左メニューから "Network Access" をクリック
2. "Add IP Address" をクリック
3. "Allow Access from Anywhere" を選択（0.0.0.0/0）
4. "Confirm" をクリック

## 5. 接続文字列取得

1. クラスター一覧で "Connect" をクリック
2. "Connect your application" を選択
3. Driver: "Node.js" を選択
4. Version: 最新版を選択
5. 接続文字列をコピー

接続文字列の例：
```
mongodb+srv://chemistry-quiz-user:YOUR_PASSWORD@cluster.mongodb.net/?retryWrites=true&w=majority
```

## 6. 環境変数設定

### ローカル開発用

1. `netlify/functions/` フォルダに `.env` ファイルを作成
2. 以下の内容を追加：

```env
MONGODB_URI=mongodb+srv://chemistry-quiz-user:YOUR_PASSWORD@cluster.mongodb.net/chemistry-quiz?retryWrites=true&w=majority
MONGODB_DB_NAME=chemistry-quiz
NODE_ENV=development
```

**注意**: `YOUR_PASSWORD` を実際のパスワードに置き換えてください。

### Netlify本番環境用

1. Netlifyダッシュボードにログイン
2. プロジェクトを選択
3. "Site settings" → "Environment variables" をクリック
4. 以下の環境変数を追加：

| Key | Value |
|-----|-------|
| MONGODB_URI | mongodb+srv://chemistry-quiz-user:YOUR_PASSWORD@cluster.mongodb.net/chemistry-quiz?retryWrites=true&w=majority |
| MONGODB_DB_NAME | chemistry-quiz |

## 7. テスト

環境変数を設定後、以下のコマンドでテスト：

```bash
# ローカル開発サーバー起動
netlify dev

# ブラウザで以下にアクセス
http://localhost:55040/mongodb-test.html
```

## トラブルシューティング

### 接続エラーが発生する場合

1. **パスワード確認**: 接続文字列のパスワードが正しいか確認
2. **ネットワークアクセス**: 0.0.0.0/0 が設定されているか確認
3. **ユーザー権限**: データベースユーザーに read/write 権限があるか確認
4. **クラスター状態**: クラスターが起動しているか確認

### 環境変数が読み込まれない場合

1. **ローカル**: `.env` ファイルが `netlify/functions/` フォルダにあるか確認
2. **本番**: Netlifyダッシュボードで環境変数が正しく設定されているか確認
3. **再デプロイ**: 環境変数変更後は再デプロイが必要

## セキュリティ注意事項

- パスワードは安全に管理してください
- 本番環境では強力なパスワードを使用してください
- 必要に応じてIPアドレス制限を設定してください 