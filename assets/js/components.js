const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

const icon = (name) => {
  const icons = {
    clock: '◷', level: '↗', format: '▣', users: '◎', goal: '✓', calendar: '◫'
  };
  return icons[name] || '•';
};

export function tags(items = []) {
  return `<ul class="tag-list" aria-label="Temas">${items.map(item => `<li class="tag">${escapeHtml(item)}</li>`).join('')}</ul>`;
}

export function catalogCard(item, type) {
  const route = type === 'curso' ? 'cursos' : type === 'treinamento' ? 'treinamentos' : 'mentorias';
  return `
    <article class="card card--hover catalog-card">
      <img class="catalog-card__image" src="${escapeHtml(item.imagem)}" alt="" loading="lazy" width="800" height="450">
      <div class="catalog-card__content">
        <div class="card__meta">
          <span>${icon('format')} ${escapeHtml(item.formato)}</span>
          <span>${icon('clock')} ${escapeHtml(item.duracao)}</span>
          ${item.nivel ? `<span>${icon('level')} ${escapeHtml(item.nivel)}</span>` : ''}
        </div>
        <h3>${escapeHtml(item.titulo)}</h3>
        <p>${escapeHtml(item.resumo)}</p>
        ${tags(item.temas)}
        <a class="text-link" href="#/contato?interesse=${encodeURIComponent(item.titulo)}" aria-label="Solicitar informações sobre ${escapeHtml(item.titulo)}">Solicitar informações</a>
      </div>
    </article>`;
}

export function blogCard(post) {
  return `
    <article class="card card--hover blog-card">
      <img src="${escapeHtml(post.imagem)}" alt="" loading="lazy" width="800" height="450">
      <div class="blog-card__body">
        <div class="card__meta"><span>${escapeHtml(post.dataFormatada)}</span><span>${escapeHtml(post.tempoLeitura)}</span></div>
        <span class="badge badge--red">${escapeHtml(post.categoria)}</span>
        <h3><a href="#/blog/${escapeHtml(post.id)}">${escapeHtml(post.titulo)}</a></h3>
        <p>${escapeHtml(post.resumo)}</p>
        ${tags(post.tags)}
        <a class="text-link" href="#/blog/${escapeHtml(post.id)}" aria-label="Ler artigo: ${escapeHtml(post.titulo)}">Ler artigo</a>
      </div>
    </article>`;
}

export function renderToc(headings = [], slug = '') {
  if (!headings.length) return '';
  return `<nav aria-label="Neste artigo"><strong>Neste artigo</strong><ul>${headings.map(h => `<li><a href="#/blog/${escapeHtml(slug)}" data-scroll-target="${escapeHtml(h.id)}">${escapeHtml(h.text)}</a></li>`).join('')}</ul></nav>`;
}

export function formatDate(value) {
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
}
