// app.controller.js
document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('kszFileInput'); // 👈 需與 index.html 的 input ID 相符
  const infoBar = document.getElementById('info-bar');       // ⬅️ 替代原本的 #status
  const previewArea = document.getElementById('render-area'); // ⬅️ 確保預覽區存在

  if (!fileInput || !window.parseKSZ || !window.renderKSZ || !previewArea) {
    console.error('[KSZ Reader] 系統初始化錯誤：缺少必要元件');
    if (infoBar) infoBar.textContent = '❌ Reader 初始化錯誤';
    return;
  }

  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        if (!content.startsWith('KSZ/1.2')) {
          infoBar.textContent = '❌ 錯誤：不支援的 KSZ 格式';
          return;
        }

        const parsed = window.parseKSZ(content);
        window.renderKSZ(parsed);
        infoBar.textContent = `✅ 已成功載入：${file.name}`;
      } catch (err) {
        console.error('[KSZ Reader] 載入或解析錯誤：', err);
        infoBar.textContent = '❌ 載入失敗，請檢查檔案格式';
      }
    };

    reader.readAsText(file, 'utf-8');
  });
});

