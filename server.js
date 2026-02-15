import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import open from 'open';

// ES Module で __dirname を取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// コマンドライン引数の解析
function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    port: 3000,
    browser: true
  };

  args.forEach(arg => {
    // --port=8080 形式の処理
    if (arg.startsWith('--port=')) {
      const portValue = parseInt(arg.split('=')[1], 10);
      if (!isNaN(portValue) && portValue > 0 && portValue <= 65535) {
        config.port = portValue;
      } else {
        console.warn(`警告: 無効なポート番号です: ${arg.split('=')[1]}`);
      }
    }
    // --no-browser オプションの処理
    else if (arg === '--no-browser') {
      config.browser = false;
    }
  });

  return config;
}

// サーバーの初期化
function startServer() {
  const config = parseArgs();
  const app = express();

  // 静的ファイルの配信（プロジェクトルートディレクトリ）
  app.use(express.static(path.join(__dirname)));

  // サーバー起動
  const server = app.listen(config.port, () => {
    const url = `http://localhost:${config.port}`;
    console.log(`\n✨ SVG to PNG Converter サーバーが起動しました！`);
    console.log(`\n📍 URL: ${url}`);
    console.log(`\n終了するには Ctrl+C を押してください\n`);

    // ブラウザ自動起動
    if (config.browser) {
      console.log('🌐 ブラウザを起動しています...\n');
      open(url).catch(err => {
        console.error('⚠️  ブラウザの起動に失敗しました:', err.message);
        console.log(`手動で ${url} にアクセスしてください\n`);
      });
    }
  });

  // エラーハンドリング
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ エラー: ポート ${config.port} は既に使用されています`);
      console.log(`別のポートを指定してください: npm start -- --port=<番号>\n`);
    } else {
      console.error('\n❌ サーバーエラー:', err.message, '\n');
    }
    process.exit(1);
  });

  // Ctrl+C でのグレースフルシャットダウン
  process.on('SIGINT', () => {
    console.log('\n\n👋 サーバーを終了しています...\n');
    server.close(() => {
      console.log('✅ サーバーを終了しました\n');
      process.exit(0);
    });
  });
}

// サーバー起動
startServer();
