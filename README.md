# SVG to PNG Converter

SVGコードをPNG画像に変換するシンプルなWebアプリケーションです。ブラウザ上で完結し、サーバー不要で動作します。

## 🚀 今すぐ試す

**GitHub Pagesでホスティング中！インストール不要で、すぐに使えます:**

### **[https://knight9999.github.io/ConvertSVGToPng/](https://knight9999.github.io/ConvertSVGToPng/)**

上記のURLにアクセスするだけで、すぐに使い始められます。

## 使い方

1. **上記のURLにアクセス**

2. **SVGコードを入力**

   テキストエリアにSVGコードを貼り付けます。例：
   ```svg
   <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
     <circle cx="100" cy="100" r="80" fill="#3498db"/>
   </svg>
   ```

3. **「変換」ボタンをクリック**

   変換されたPNG画像がプレビュー表示されます。

4. **「PNGダウンロード」ボタンをクリック**

   PNG画像がダウンロードされます（ファイル名：`converted_YYYYMMDDHHmmss.png`）

## 特徴

- ✨ **インストール不要** - ブラウザだけで動作
- 🔒 **プライバシー保護** - データはブラウザ内だけで処理され、外部に送信されません
- 📦 **軽量** - 外部ライブラリなし、高速動作
- 📱 **レスポンシブ** - スマートフォン・タブレット・PCに対応

## ローカルで実行する場合

### 方法1: 開発サーバーを使用 (推奨)

リポジトリをクローンして、開発サーバーを起動します：

```bash
git clone https://github.com/knight9999/ConvertSVGToPng.git
cd ConvertSVGToPng

# 依存パッケージをインストール
npm install

# サーバーを起動 (ポート 3000、ブラウザ自動起動)
npm start
```

サーバーが起動すると、自動的にブラウザで `http://localhost:3000` が開きます。

#### コマンドラインオプション

```bash
# ポート番号を指定 (例: 8080)
npm start -- --port=8080

# ブラウザの自動起動を無効化
npm start -- --no-browser

# 複数のオプションを組み合わせ
npm start -- --port=8080 --no-browser
```

### 方法2: ブラウザで直接開く

開発サーバーなしで動作させる場合は、`index.html` をブラウザで開くこともできます。
ただし、この場合はサンプル機能 (Samples パネル) が CORS 制約により動作しません。

```bash
open index.html
```

## 技術情報

開発者向けの詳細情報は [DEV_NOTE.md](DEV_NOTE.md) を参照してください。

## ライセンス

MIT License
