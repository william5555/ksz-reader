// app.v1.1.js

const fileInput   = document.getElementById('kszFileInput');
const errBox      = document.getElementById('error-box');
const infoBar     = document.getElementById('info-bar');
const bookTitle   = document.getElementById('book-title');
const bookAuthor  = document.getElementById('book-author');
const themeToggle = document.getElementById('theme-toggle');
const readerLink  = document.getElementById('reader-link');

// 夜間模式切換
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});

// 主邏輯：載入 .ksz 檔案
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  errBox.textContent = '';
  infoBar.textContent = '';
  bookTitle.textContent = '— 讀取中 —';
  bookTitle.classList.add('loading');
  bookAuthor.textContent = '';
  readerLink.classList.add('hidden');

  if (!file) {
    errBox.textContent = '未選擇檔案';
    bookTitle.classList.remove('loading');
    return;
  }

  const reader = new FileReader();
  reader.onload = (event) => {
    const content = event.target.result;

    // 自動判斷檔案是否為 KSZ 格式
    if (!content.startsWith('KSZ/')) {
      errBox.textContent = '錯誤：不是有效的 .ksz 檔案';
      bookTitle.classList.remove('loading');
      return;
    }

    // 解析 metadata
    const metaLines = content.split('\n').slice(0, 20);
    const titleLine = metaLines.find(line => line.startsWith('//!標題>>'));
    const authorLine = metaLines.find(line => line.startsWith('//!作者>>'));
    const title = titleLine ? titleLine.split('>>')[1].trim() : '未命名標題';
    const author = authorLine ? authorLine.split('>>')[1].trim() : '未知作者';

    // 更新畫面
    bookTitle.textContent = title;
    bookTitle.classList.remove('loading');
    bookAuthor.textContent = author;
    readerLink.classList.remove('hidden');

    // 存入 sessionStorage，供 reader.html 使用
    sessionStorage.setItem('kszContent', content);
    sessionStorage.setItem('kszFileName', file.name);

    // 預覽區渲染
    if (typeof window.parseKSZ === 'function' && typeof window.renderKSZ === 'function') {
      const parsed = window.parseKSZ(content);
      window.renderKSZ(parsed);
    } else {
      errBox.textContent = '❌ 錯誤：無法載入預覽模組';
    }

    infoBar.textContent = '檔案已成功載入，可預覽或進入章節閱讀模式';
  };

  reader.readAsText(file, 'utf-8');
});
