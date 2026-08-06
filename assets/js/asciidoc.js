import { escapeHTML } from './utils.js';

function inline(text) {
  let value = escapeHTML(text);
  value = value.replace(/https?:\/\/[^\s<]+/g, url => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
  value = value.replace(/link:([^\[]+)\[([^\]]+)\]/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$2</a>');
  value = value.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
  value = value.replace(/_([^_]+)_/g, '<em>$1</em>');
  value = value.replace(/`([^`]+)`/g, '<code>$1</code>');
  return value;
}

export function parseAsciiDoc(source) {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const attributes = {};
  let title = '';
  let author = '';
  let html = '';
  let paragraph = [];
  let listType = null;
  let inCode = false;
  let code = [];
  let inQuote = false;
  let quote = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      html += `<p>${inline(paragraph.join(' '))}</p>`;
      paragraph = [];
    }
  };
  const closeList = () => {
    if (listType) {
      html += `</${listType}>`;
      listType = null;
    }
  };
  const flushQuote = () => {
    if (quote.length) {
      html += `<blockquote><p>${inline(quote.join(' '))}</p></blockquote>`;
      quote = [];
    }
  };

  lines.forEach((raw, index) => {
    const line = raw.trimEnd();

    if (line === '----') {
      flushParagraph(); closeList(); flushQuote();
      if (inCode) {
        html += `<pre><code>${escapeHTML(code.join('\n'))}</code></pre>`;
        code = [];
      }
      inCode = !inCode;
      return;
    }
    if (inCode) { code.push(raw); return; }

    if (line === '____') {
      flushParagraph(); closeList();
      if (inQuote) flushQuote();
      inQuote = !inQuote;
      return;
    }
    if (inQuote) { if (line) quote.push(line); return; }

    if (index === 0 && /^=\s+/.test(line)) {
      title = line.replace(/^=\s+/, '').trim();
      return;
    }
    if (index === 1 && line && !line.startsWith(':') && !/^==/.test(line)) {
      author = line;
      return;
    }
    const attr = line.match(/^:([^:]+):\s*(.*)$/);
    if (attr) { attributes[attr[1].trim()] = attr[2].trim(); return; }

    if (!line.trim()) { flushParagraph(); closeList(); return; }

    const heading = line.match(/^(={2,6})\s+(.+)$/);
    if (heading) {
      flushParagraph(); closeList();
      const level = Math.min(6, heading[1].length);
      const id = heading[2].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      html += `<h${level} id="${id}">${inline(heading[2])}</h${level}>`;
      return;
    }

    const admonition = line.match(/^(NOTE|TIP|IMPORTANT|WARNING|CAUTION):\s*(.*)$/);
    if (admonition) {
      flushParagraph(); closeList();
      const labels = { NOTE: 'Nota', TIP: 'Dica', IMPORTANT: 'Importante', WARNING: 'Atenção', CAUTION: 'Cuidado' };
      html += `<div class="admonition"><strong>${labels[admonition[1]]}:</strong> ${inline(admonition[2])}</div>`;
      return;
    }

    const unordered = line.match(/^\*\s+(.+)$/);
    if (unordered) {
      flushParagraph();
      if (listType !== 'ul') { closeList(); html += '<ul>'; listType = 'ul'; }
      html += `<li>${inline(unordered[1])}</li>`;
      return;
    }

    const ordered = line.match(/^\.\s+(.+)$/);
    if (ordered) {
      flushParagraph();
      if (listType !== 'ol') { closeList(); html += '<ol>'; listType = 'ol'; }
      html += `<li>${inline(ordered[1])}</li>`;
      return;
    }

    closeList();
    paragraph.push(line.trim());
  });

  flushParagraph(); closeList(); flushQuote();
  if (inCode && code.length) html += `<pre><code>${escapeHTML(code.join('\n'))}</code></pre>`;

  return { title, author, attributes, html, plainText: lines.join(' ') };
}
