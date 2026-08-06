/**
 * Conversor AsciiDoc deliberadamente pequeno e seguro para os recursos usados
 * pelos artigos deste projeto. Não executa HTML do arquivo de origem.
 */
const escapeHtml = (value = '') => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

function inline(text) {
  let output = escapeHtml(text);
  output = output.replace(/`([^`]+)`/g, '<code>$1</code>');
  output = output.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
  output = output.replace(/_([^_]+)_/g, '<em>$1</em>');
  output = output.replace(/(https?:\/\/[^\s\[]+)\[([^\]]+)\]/g, '<a href="$1" rel="noopener noreferrer">$2</a>');
  return output;
}

export function parseAsciiDoc(source) {
  const lines = source.replaceAll('\r\n', '\n').split('\n');
  const attributes = {};
  const headings = [];
  let title = '';
  let bodyStart = 0;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (index === 0 && line.startsWith('= ')) {
      title = line.slice(2).trim();
      bodyStart = 1;
      continue;
    }
    const attributeMatch = line.match(/^:([a-z0-9-]+):\s*(.*)$/i);
    if (attributeMatch) {
      attributes[attributeMatch[1]] = attributeMatch[2];
      bodyStart = index + 1;
      continue;
    }
    if (!line && index <= bodyStart + 1) {
      bodyStart = index + 1;
      continue;
    }
    break;
  }

  let html = '';
  let paragraph = [];
  let listType = null;
  let inCode = false;
  let code = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    html += `<p>${inline(paragraph.join(' '))}</p>`;
    paragraph = [];
  };
  const closeList = () => {
    if (!listType) return;
    html += `</${listType}>`;
    listType = null;
  };

  for (let index = bodyStart; index < lines.length; index += 1) {
    const raw = lines[index];
    const line = raw.trim();

    if (line === '----') {
      flushParagraph();
      closeList();
      if (inCode) {
        html += `<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`;
        code = [];
      }
      inCode = !inCode;
      continue;
    }
    if (inCode) {
      code.push(raw);
      continue;
    }
    if (!line) {
      flushParagraph();
      closeList();
      continue;
    }
    if (line.startsWith('//')) continue;

    const headingMatch = line.match(/^(==|===|====)\s+(.+)$/);
    if (headingMatch) {
      flushParagraph();
      closeList();
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const id = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      headings.push({ level, text, id });
      html += `<h${level} id="${id}">${inline(text)}</h${level}>`;
      continue;
    }

    const unordered = line.match(/^\*\s+(.+)$/);
    const ordered = line.match(/^\.\s+(.+)$/);
    if (unordered || ordered) {
      flushParagraph();
      const type = unordered ? 'ul' : 'ol';
      if (listType !== type) {
        closeList();
        html += `<${type}>`;
        listType = type;
      }
      html += `<li>${inline((unordered || ordered)[1])}</li>`;
      continue;
    }

    const admonition = line.match(/^(NOTE|TIP|IMPORTANT|WARNING):\s*(.+)$/);
    if (admonition) {
      flushParagraph();
      closeList();
      const labels = { NOTE: 'Nota', TIP: 'Dica', IMPORTANT: 'Importante', WARNING: 'Atenção' };
      html += `<div class="admonition"><strong>${labels[admonition[1]]}:</strong> ${inline(admonition[2])}</div>`;
      continue;
    }

    if (line.startsWith('> ')) {
      flushParagraph();
      closeList();
      html += `<blockquote><p>${inline(line.slice(2))}</p></blockquote>`;
      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();
  closeList();
  if (inCode && code.length) html += `<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`;

  return { title, attributes, headings, html };
}
