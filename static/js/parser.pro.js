// parser.pro.js
window.parseKSZ = function (content) {
  const lines = content.split('\n');
  const html = [], css = [], js = [];

  for (let line of lines) {
    if (line.startsWith('HTML|')) {
      html.push(line.slice(5).trim());
    } else if (line.startsWith('CSS|')) {
      css.push(line.slice(4).trim());
    } else if (line.startsWith('JS|')) {
      js.push(line.slice(3).trim());
    }
  }

  return {
    html: html.join('\n'),
    css: css.join('\n'),
    js: js.join('\n')
  };
};
