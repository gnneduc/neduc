import { getJSON } from '../data-service.js';
import { hero, sectionHeading } from '../components.js';
import { debounce, escapeHTML, formatDate, normalizeText, qs } from '../utils.js';

export default async function blogView(context = {}) {
  const posts = [...await getJSON('blog/index.json')].sort((a, b) => b.date.localeCompare(a.date));
  const categories = ['Todos', ...new Set(posts.map(post => post.category))];

  return {
    title: 'Blog',
    html: `
      ${hero({
        eyebrow: 'Blog Neduc',
        title: 'Conteúdo para compreender, aplicar e evoluir.',
        description: 'Artigos sobre inteligência artificial, tecnologia, dados, gestão, produtividade, aprendizagem e desenvolvimento profissional.',
        image: 'assets/images/blog.webp',
        primary: { label: 'Ver artigos', href: '#/blog?section=artigos' },
        inner: true
      })}
      <section class="section" id="artigos" aria-labelledby="blog-title">
        <div class="container">
          ${sectionHeading({
            eyebrow: 'Publicações',
            title: '<span id="blog-title">Ideias práticas para o futuro do trabalho</span>',
            description: 'Pesquise por assunto, escolha uma categoria e encontre conteúdos para sua jornada de aprendizagem.'
          })}
          <div class="blog-layout">
            <div>
              <div class="catalog-toolbar" style="grid-template-columns:1fr">
                <div class="form-field">
                  <label for="blog-search">Buscar artigos</label>
                  <input type="search" id="blog-search" placeholder="Digite um tema, por exemplo: IA" autocomplete="off">
                </div>
              </div>
              <p class="catalog-count" role="status" aria-live="polite"></p>
              <div class="blog-grid" data-blog-grid></div>
            </div>
            <aside class="blog-sidebar" aria-label="Filtros e informações do blog">
              <section class="card">
                <h2>Categorias</h2>
                <div class="chip-list" data-category-chips>
                  ${categories.map((category, index) => `<button class="chip" type="button" data-category="${escapeHTML(category)}" aria-pressed="${index === 0}">${escapeHTML(category)}</button>`).join('')}
                </div>
              </section>
              <section class="card card--dark">
                <h2>Aprendizagem contínua</h2>
                <p>Use os artigos como ponto de partida e leve o tema para a prática com os cursos, treinamentos e mentorias da Neduc.</p>
                <a class="button button--ghost button--small" href="#/cursos">Explorar cursos</a>
              </section>
            </aside>
          </div>
        </div>
      </section>
    `,
    afterRender(scope) {
      const grid = qs('[data-blog-grid]', scope);
      const search = qs('#blog-search', scope);
      const count = qs('.catalog-count', scope);
      let selectedCategory = 'Todos';

      const render = () => {
        const term = normalizeText(search.value);
        const filtered = posts.filter(post => {
          const searchable = normalizeText(`${post.title} ${post.description} ${post.category} ${(post.tags || []).join(' ')}`);
          return (!term || searchable.includes(term)) && (selectedCategory === 'Todos' || post.category === selectedCategory);
        });
        count.textContent = `${filtered.length} ${filtered.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}.`;
        grid.innerHTML = filtered.length ? filtered.map(post => `<article class="card blog-card">
          <img src="${post.image}" alt="" width="640" height="360" loading="lazy">
          <div class="blog-card__body">
            <div class="blog-card__meta"><span>${formatDate(post.date)}</span><span>${post.readingTime} min de leitura</span></div>
            <span class="badge">${escapeHTML(post.category)}</span>
            <h2><a href="#/blog/${encodeURIComponent(post.slug)}">${escapeHTML(post.title)}</a></h2>
            <p>${escapeHTML(post.description)}</p>
            <a class="card__link" href="#/blog/${encodeURIComponent(post.slug)}">Ler artigo</a>
          </div>
        </article>`).join('') : '<div class="empty-state" style="grid-column:1/-1"><h2>Nenhum artigo encontrado</h2><p>Tente outro termo ou selecione a categoria “Todos”.</p></div>';
      };

      search.addEventListener('input', debounce(render));
      scope.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => {
        selectedCategory = button.dataset.category;
        scope.querySelectorAll('[data-category]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
        render();
      }));
      render();
      if (context.query?.get('section') === 'artigos') {
        requestAnimationFrame(() => scope.querySelector('#artigos')?.scrollIntoView({ behavior: document.documentElement.dataset.reduceMotion === 'true' ? 'auto' : 'smooth' }));
      }
    }
  };
}
