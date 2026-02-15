/**
 * SVGConverter - SVGソースコードをPNG画像に変換するクラス
 */
class SVGConverter {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  }

  /**
   * SVGソースコードをPNGのBlobに変換
   * @param {string} svgSource - SVGソースコード
   * @returns {Promise<Blob>} PNG形式のBlob
   */
  async convert(svgSource) {
    // 1. SVGソースをBlobに変換
    const svgBlob = new Blob([svgSource], {
      type: 'image/svg+xml;charset=utf-8'
    });

    // 2. BlobからオブジェクトURLを生成
    const url = URL.createObjectURL(svgBlob);

    try {
      // 3. Imageとして読み込み
      const img = await this.loadImage(url);

      // 4. Canvasサイズを画像サイズに設定
      this.canvas.width = img.width;
      this.canvas.height = img.height;

      // 5. CanvasにSVGを描画
      this.ctx.drawImage(img, 0, 0);

      // 6. PNGのBlobを生成
      return await this.canvasToBlob();

    } finally {
      // 7. オブジェクトURLを解放
      URL.revokeObjectURL(url);
    }
  }

  /**
   * 画像を非同期で読み込む
   * @param {string} url - 画像URL
   * @returns {Promise<HTMLImageElement>}
   */
  loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('SVG画像の読み込みに失敗しました'));
      img.src = url;
    });
  }

  /**
   * CanvasをPNG Blobに変換
   * @returns {Promise<Blob>}
   */
  canvasToBlob() {
    return new Promise((resolve, reject) => {
      this.canvas.toBlob(
        blob => blob ? resolve(blob) : reject(new Error('PNG変換に失敗しました')),
        'image/png'
      );
    });
  }
}

/**
 * UI - ユーザーインターフェース制御クラス
 */
class UI {
  constructor() {
    this.converter = new SVGConverter();
    this.pngBlob = null;
    this.initElements();
    this.bindEvents();
    this.loadSamples();
  }

  /**
   * DOM要素を初期化
   */
  initElements() {
    this.svgInput = document.getElementById('svg-input');
    this.convertBtn = document.getElementById('convert-btn');
    this.svgDownloadBtn = document.getElementById('svg-download-btn');
    this.downloadBtn = document.getElementById('download-btn');
    this.pngPreview = document.getElementById('png-preview');
    this.errorMsg = document.getElementById('error-message');
    this.samplesList = document.getElementById('samples-list');
  }

  /**
   * イベントリスナーをバインド
   */
  bindEvents() {
    this.convertBtn.addEventListener('click', () => this.handleConvert());
    this.svgDownloadBtn.addEventListener('click', () => this.handleSvgDownload());
    this.downloadBtn.addEventListener('click', () => this.handleDownload());

    // TextAreaの入力に応じてSVGダウンロードボタンの有効/無効を切り替え
    this.svgInput.addEventListener('input', () => this.updateSvgDownloadButton());
  }

  /**
   * サンプル一覧を読み込んで表示
   */
  async loadSamples() {
    if (!this.samplesList) return;

    try {
      const response = await fetch('samples/index.json', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('サンプル一覧の読み込みに失敗しました');
      }
      const samples = await response.json();
      if (!Array.isArray(samples)) {
        throw new Error('サンプル一覧の形式が正しくありません');
      }
      this.renderSamples(samples);
    } catch (error) {
      this.renderSamplesError(error.message);
    }
  }

  /**
   * サンプル一覧を描画
   * @param {Array<{file: string, description?: string}>} samples
   */
  renderSamples(samples) {
    this.samplesList.innerHTML = '';
    if (samples.length === 0) {
      this.samplesList.textContent = 'サンプルがありません';
      return;
    }

    samples.forEach(sample => {
      const card = document.createElement('div');
      card.className = 'sample-card';

      const img = document.createElement('img');
      img.className = 'sample-thumb';
      img.src = `samples/${sample.file}`;
      img.alt = sample.description ? sample.description : sample.file;
      img.loading = 'lazy';

      const title = document.createElement('div');
      title.className = 'sample-title';
      title.textContent = sample.description ? sample.description : sample.file;

      const fileName = document.createElement('div');
      fileName.className = 'sample-desc';
      fileName.textContent = sample.file;

      const loadBtn = document.createElement('button');
      loadBtn.className = 'btn btn-secondary sample-load-btn';
      loadBtn.textContent = 'ロード';
      loadBtn.addEventListener('click', () => this.handleSampleLoad(sample));

      card.appendChild(img);
      card.appendChild(title);
      card.appendChild(fileName);
      card.appendChild(loadBtn);
      this.samplesList.appendChild(card);
    });
  }

  /**
   * サンプル読み込み時のエラー表示
   * @param {string} message
   */
  renderSamplesError(message) {
    this.samplesList.innerHTML = '';
    const error = document.createElement('div');
    error.className = 'sample-desc';
    error.textContent = message;
    this.samplesList.appendChild(error);
  }

  /**
   * サンプルのロード処理
   * @param {{file: string, description?: string}} sample
   */
  async handleSampleLoad(sample) {
    const label = sample.description ? sample.description : sample.file;
    const confirmed = confirm(`「${label}」を読み込みますか？`);
    if (!confirmed) return;

    try {
      const response = await fetch(`samples/${sample.file}`, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('サンプルSVGの読み込みに失敗しました');
      }
      const svgText = await response.text();
      this.svgInput.value = svgText;
      this.updateSvgDownloadButton();
      this.showSuccess('サンプルを読み込みました');
    } catch (error) {
      this.showError(error.message);
    }
  }

  /**
   * 変換ボタンのクリックハンドラ
   */
  async handleConvert() {
    // エラーメッセージをクリア
    this.clearError();

    // 入力チェック
    const svgSource = this.svgInput.value.trim();
    if (!svgSource) {
      this.showError('SVGコードを入力してください');
      return;
    }

    // ボタンを無効化
    this.convertBtn.disabled = true;
    this.downloadBtn.disabled = true;

    try {
      // 変換実行
      this.pngBlob = await this.converter.convert(svgSource);

      // PNG画像を表示
      this.displayPNG(this.pngBlob);

      // ダウンロードボタンを有効化
      this.downloadBtn.disabled = false;
      this.showSuccess('変換が完了しました');

    } catch (error) {
      this.showError(`変換エラー: ${error.message}`);
      console.error(error);

    } finally {
      // 変換ボタンを再度有効化
      this.convertBtn.disabled = false;
    }
  }

  /**
   * SVGダウンロードボタンのクリックハンドラ
   */
  handleSvgDownload() {
    const svgSource = this.svgInput.value.trim();
    if (!svgSource) {
      this.showError('SVGコードを入力してください');
      return;
    }

    // 現在日時を取得してファイル名を生成
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const filename = `figure_${year}${month}${day}${hours}${minutes}${seconds}.svg`;

    // SVGをBlobとして作成
    const svgBlob = new Blob([svgSource], {
      type: 'image/svg+xml;charset=utf-8'
    });

    // ダウンロード用のリンクを生成
    const url = URL.createObjectURL(svgBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * SVGダウンロードボタンの有効/無効を更新
   */
  updateSvgDownloadButton() {
    const svgSource = this.svgInput.value.trim();
    this.svgDownloadBtn.disabled = !svgSource;
  }

  /**
   * PNG画像をプレビュー表示
   * @param {Blob} blob - PNG Blob
   */
  displayPNG(blob) {
    // 既存のプレビューURLがあれば解放
    if (this.pngPreview.src) {
      URL.revokeObjectURL(this.pngPreview.src);
    }

    // PNG画像をプレビュー表示
    const url = URL.createObjectURL(blob);
    this.pngPreview.src = url;
    this.pngPreview.style.display = 'block';
  }

  /**
   * ダウンロードボタンのクリックハンドラ
   */
  handleDownload() {
    if (!this.pngBlob) return;

    // 現在日時を取得してファイル名を生成
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const filename = `converted_${year}${month}${day}${hours}${minutes}${seconds}.png`;

    // ダウンロード用のリンクを生成
    const url = URL.createObjectURL(this.pngBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * エラーメッセージを表示
   * @param {string} message - メッセージ
   */
  showError(message) {
    this.errorMsg.textContent = message;
    this.errorMsg.className = 'message error';
  }

  /**
   * 成功メッセージを表示
   * @param {string} message - メッセージ
   */
  showSuccess(message) {
    this.errorMsg.textContent = message;
    this.errorMsg.className = 'message success';
  }

  /**
   * メッセージをクリア
   */
  clearError() {
    this.errorMsg.textContent = '';
    this.errorMsg.className = 'message';
  }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
  new UI();
});
