// render.pro.js
window.renderKSZ = function ({ html, css, js }, containerId = 'render-area') {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`[renderKSZ] 找不到容器 #${containerId}`);
    return;
  }

  container.innerHTML = '';

  const iframe = document.createElement('iframe');
  iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';

  container.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${js}<\/script>
      </body>
    </html>
  `);
  doc.close();
};
