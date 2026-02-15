# SVG to PNG Converter

フロントエンドのみで動作するシンプルなSVG to PNG変換ツールです。SVGソースコードをテキストエリアに入力し、PNG画像に変換してダウンロードできます。

## 特徴

- 🚀 **フロントエンドのみで完結** - サーバー不要、ブラウザだけで動作
- 📦 **依存関係なし** - 外部ライブラリを使用せず、ネイティブWeb APIのみで実装
- 🎨 **シンプルなUI** - クリーンでモダンなデザイン
- 📱 **レスポンシブ対応** - モバイル・デスクトップ両対応
- ⚡ **軽量** - ビルドプロセス不要、合計ファイルサイズ < 20KB

## 機能

- SVGソースコードの入力（textarea）
- SVG → PNG変換
- PNG画像のダウンロード
- エラーハンドリングとメッセージ表示
- レスポンシブデザイン

## 使い方

### ローカルでの実行

1. リポジトリをクローン:
   ```bash
   git clone <repository-url>
   cd ConvertSVGtoPng
   ```

2. `index.html` をブラウザで開く:
   - ダブルクリックで開く
   - または、ローカルサーバーを起動:
     ```bash
     # Python 3の場合
     python3 -m http.server 8000

     # Node.jsの場合
     npx serve
     
     # expressをインストールして利用する場合
     npm install
     # Expressサーバーを起動 (ポート 3000、ブラウザ自動起動)
     npm start
     # Expressサーバーを起動（ポート 8080、ブラウザは自動起動しない）
     npm start -- --port=8080 --no-browser
     ```

3. SVGコードを入力:
   ```svg
   <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
     <circle cx="100" cy="100" r="80" fill="#3498db"/>
   </svg>
   ```

4. 「変換」ボタンをクリック

5. 「PNGダウンロード」ボタンで画像を保存

## 技術スタック

- **HTML5** - セマンティックHTML
- **CSS3** - CSS変数、Flexbox、レスポンシブデザイン
- **JavaScript (ES6+)** - クラス構文、Promise、async/await
- **Canvas API** - SVGのラスタライズとPNG変換
- **Blob API** - ファイルダウンロード

## ブラウザ対応

以下のモダンブラウザに対応しています:

- ✅ Chrome / Edge（最新版）
- ✅ Firefox（最新版）
- ✅ Safari（最新版）

必要なブラウザ機能:
- Canvas API
- Blob API
- Promise / async-await
- ES6 Class構文

## ファイル構成

```
ConvertSVGtoPng/
├── index.html          # メインHTMLファイル
├── script.js           # JavaScriptロジック
├── style.css           # スタイルシート
├── README.md           # このファイル
└── .gitignore          # Git除外設定
```

## 変換アルゴリズム

1. **SVGソースをBlobに変換** - SVGテキストをSVG MIMEタイプのBlobに変換
2. **オブジェクトURL生成** - Blobからブラウザ内の一時URLを生成
3. **Image要素として読み込み** - SVGをビットマップとして読み込み
4. **Canvasに描画** - Canvas APIでSVGをラスタライズ
5. **PNGエクスポート** - CanvasをPNG形式のBlobに変換
6. **ダウンロード** - `<a>`要素を動的に生成してダウンロード

## エラーハンドリング

以下のエラーケースに対応しています:

- 空の入力
- 無効なSVG構文
- Canvas変換エラー
- メモリ不足（巨大なSVG）

エラーメッセージは分かりやすく表示され、ユーザーに適切なフィードバックを提供します。

## デプロイ方法

### GitHub Pages

1. GitHubリポジトリにプッシュ
2. Settings → Pages → Source: `main` branch
3. 公開URLでアクセス可能

### 静的ホスティングサービス

- [Netlify](https://www.netlify.com/)
- [Vercel](https://vercel.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/)

ビルド不要で直接デプロイ可能です。

## セキュリティ

- SVGは`Image`要素として読み込むため、SVG内のスクリプトは実行されません
- ユーザーデータはブラウザ内でのみ処理され、外部に送信されません
- サーバー不要のため、データ漏洩リスクなし

## ライセンス

MIT License

## 開発者

このプロジェクトはフロントエンド学習とCanvas APIの実践を目的として作成されました。

## 貢献

プルリクエストやイシューの報告は歓迎します。

## 今後の拡張案

- [ ] カスタム解像度設定
- [ ] 複数形式対応（JPEG, WebP）
