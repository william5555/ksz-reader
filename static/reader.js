(() => {
  const backBtn = document.getElementById('back-btn');
  const metaInfo = document.getElementById('meta-info');
  const menuList = document.querySelector('#chapter-menu ul');
  const contentArea = document.getElementById('content-area');

  backBtn?.addEventListener('click', () => window.history.back());

  // 抓資料
  let content = sessionStorage.getItem('kszContent');
  let filename = sessionStorage.getItem('kszFileName');

  // 若無 sessionStorage → 嘗試從本地 fetch 一份檔案
  if (!content || !filename) {
    fetch("how-a-website.ksz")
      .then(res => res.text())
      .then(text => {
        sessionStorage.setItem("kszContent", text);
        sessionStorage.setItem("kszFileName", "how-a-website.ksz");
        location.reload();
      })
      .catch(err => {
        metaInfo.textContent = '❌ 無法載入預設 KSZ 檔案。請從 index.html 開啟';
        console.error(err);
      });
    return;
  }

  const validation = validateKSZFile(content, filename);
  if (!validation.valid) {
    metaInfo.textContent = `❌ ${validation.message}`;
    return;
  }

  // 顯示基本 meta
  const metaLines = content.split('\n').slice(0, 20);
  const titleLine = metaLines.find(line => line.startsWith('//!標題>>'));
  const authorLine = metaLines.find(line => line.startsWith('//!作者>>'));
  const signLine = metaLines.find(line => line.startsWith('//!SIGNCODE>>')) || '';
  const signedLine = metaLines.find(line => line.startsWith('//!SIGNED>>')) || '';

  const title = titleLine ? titleLine.split('>>')[1].trim() : '未命名筆記';
  const author = authorLine ? authorLine.split('>>')[1].trim() : '';
  const signcode = signLine ? signLine.split('>>')[1].trim() : '';
  const signed = signedLine.includes('true');

  metaInfo.textContent = `${title}${author ? ' ／ ' + author : ''}${signed ? ` ✔ 已簽章 (${signcode})` : ' ⚠ 未簽章'}`;

  const lines = content.split('\n');
  const chapters = [];
  let current = { title: '', lines: [] };

  for (const line of lines) {
    if (line.startsWith('##--章首--##')) {
      if (current.lines.length > 0) chapters.push(current);
      current = { title: '', lines: [] };
    } else if (line.startsWith('H1|') && !current.title) {
      current.title = line.slice(3).trim();
      current.lines.push(line);
    } else {
      current.lines.push(line);
    }
  }
  if (current.lines.length > 0) chapters.push(current);

  if (chapters.length === 0) {
    contentArea.innerHTML = '<p class="error-block">❌ 無法解析章節。</p>';
    return;
  }

  chapters.forEach((chap, idx) => {
    const li = document.createElement('li');
    li.textContent = chap.title || `章節 ${idx + 1}`;
    li.addEventListener('click', () => {
      renderChapter(idx);
      updateActive(idx);
      contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    menuList.appendChild(li);
  });

  function renderChapter(index) {
    const chapterText = chapters[index].lines.join('\n');
    try {
      const parsed = parseKSZ(chapterText);
      renderKSZ(parsed, 'content-area');
    } catch (err) {
      console.error('解析錯誤：', err);
      contentArea.innerHTML = '<p class="error-block">⚠ 本章節內容解析失敗。</p>';
    }
  }

  function updateActive(index) {
    [...menuList.children].forEach((li, i) => {
      li.classList.toggle('active', i === index);
    });
  }

  // 初始載入第一章
  renderChapter(0);
  updateActive(0);
})();
