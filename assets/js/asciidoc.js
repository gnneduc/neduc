const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const slugify = (value) => value
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const inline = (raw) => {
  let text = escapeHtml(raw);
  text = text.replace(/https?:\/\/[^\s\]]+\[[^\]]+\]/g, (match) => {
    const bracket = match.indexOf('[');
    const url = match.slice(0, bracket);
    const label = match.slice(bracket + 1, -1);
    return `<a href="${url}" rel="noopener noreferrer">${label}</a>`;
  });
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  text = text.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
  text = text.replace(/_([^_]+)_/g, '<em>$1</em>');
  return text;
};

export function parseAsciiDoc(source = '') {
  const lines = source.replace(/\r/g, '').split('\n');
  const attributes = {};
  const headings = [];
  const html = [];
  let index = 0;
  let title = '';
  let paragraph = [];
  let listType = null;
  let inCode = false;
  let codeLang = '';
  let codeLines = [];
  let pendingAdmonition = null;
  let inAdmonition = false;
  let admonitionLines = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${inline(paragraph.join(' '))}</p>`);
    paragraph = [];
  };
  const closeList = () => {
    if (!listType) return;
    html.push(`</${listType}>`);
    listType = null;
  };
  const flushCode = () => {
    html.push(`<pre><code${codeLang ? ` class="language-${escapeHtml(codeLang)}"` : ''}>${escapeHtml(codeLines.join('\n'))}</code></pre>`);
    codeLines = [];
    inCode = false;
    codeLang = '';
  };
  const flushAdmonition = () => {
    const kind = (pendingAdmonition || 'NOTE').toLowerCase();
    const label = {note:'Nota', tip:'Dica', important:'Importante', warning:'Atenção', caution:'Cuidado'}[kind] || 'Nota';
    const content = admonitionLines.join('\n').split(/\n\s*\n/).map(p => `<p>${inline(p.replace(/\n/g,' '))}</p>`).join('');
    html.push(`<aside class="article-admonition ${kind}" role="note"><strong>${label}</strong>${content}</aside>`);
    pendingAdmonition = null;
    admonitionLines = [];
    inAdmonition = false;
  };

  // Header
  if (lines[0]?.startsWith('= ')) {
    title = lines[0].slice(2).trim();
    index = 1;
    while (index < lines.length) {
      const line = lines[index];
      const match = line.match(/^:([^:]+):\s*(.*)$/);
      if (match) { attributes[match[1]] = match[2]; index += 1; continue; }
      if (line.trim() === '') { index += 1; continue; }
      break;
    }
  }

  for (; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (inCode) {
      if (trimmed === '----') flushCode(); else codeLines.push(line);
      continue;
    }
    if (inAdmonition) {
      if (trimmed === '====') flushAdmonition(); else admonitionLines.push(line);
      continue;
    }
    if (/^\[source(?:,([^\]]+))?\]$/.test(trimmed)) {
      flushParagraph(); closeList();
      codeLang = trimmed.match(/^\[source(?:,([^\]]+))?\]$/)?.[1] || '';
      if (lines[index + 1]?.trim() === '----') { index += 1; inCode = true; }
      continue;
    }
    if (/^\[(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]$/.test(trimmed)) {
      flushParagraph(); closeList(); pendingAdmonition = trimmed.slice(1,-1); continue;
    }
    if (trimmed === '====' && pendingAdmonition) { inAdmonition = true; continue; }
    if (trimmed.startsWith('== ')) {
      flushParagraph(); closeList();
      const level = Math.min(6, trimmed.match(/^=+/)[0].length);
      const label = trimmed.replace(/^=+\s*/, '');
      const id = slugify(label);
      headings.push({ level, label, id });
      html.push(`<h${level} id="${id}">${inline(label)}</h${level}>`);
      continue;
    }
    const unordered = line.match(/^\*\s+(.+)$/);
    const ordered = line.match(/^\.\s+(.+)$/);
    if (unordered || ordered) {
      flushParagraph();
      const desired = unordered ? 'ul' : 'ol';
      if (listType !== desired) { closeList(); html.push(`<${desired}>`); listType = desired; }
      html.push(`<li>${inline((unordered || ordered)[1])}</li>`);
      continue;
    }
    if (trimmed === '') { flushParagraph(); closeList(); continue; }
    paragraph.push(trimmed);
  }
  flushParagraph(); closeList();
  if (inCode) flushCode();
  if (inAdmonition) flushAdmonition();
  return { title, attributes, headings, html: html.join('\n') };
}
