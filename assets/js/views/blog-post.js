import { getJSON, getText } from '../data-service.js';
import { parseAsciiDoc } from '../asciidoc.js';
import { breadcrumb } from '../components.js';
import { escapeHTML, formatDate, readingTime } from '../utils.js';

export default async function blogPostView({ params }) {
  const posts = await getJSON('blog/index.json');
  const post = posts.find(item => item.slug === params.slug);
  if (!post) return import('./not-found.js').then(module => module.default());

  const source = await getText(post.path);
  const document = parseAsciiDoc(source);
  const minutes = post.readingTime || readingTime(document.plainText);

  return {
    title: post.title,
    html: `
      ${breadcrumb([{ label: 'Início', href: '#/' }, { label: 'Blog', href: '#/blog' }, { label: post.title }])}
      <article class="article-shell">
        <header class="article-header">
          <span class="eyebrow">${escapeHTML(post.category)}</span>
          <h1>${escapeHTML(post.title)}</h1>
          <p class="lead">${escapeHTML(post.description)}</p>
          <div class="article-meta">
            <span>Publicado em ${formatDate(post.date)}</span>
            <span>Por ${escapeHTML(post.author || document.author || 'Equipe Neduc')}</span>
            <span>${minutes} min de leitura</span>
          </div>
        </header>
        <figure class="article-cover"><img src="${post.image}" alt="${escapeHTML(post.imageAlt || '')}" width="1200" height="675"></figure>
        <div class="article-content">
          ${document.html}
          <div class="article-share" aria-label="Ações do artigo">
            <button class="button button--outline button--small" type="button" data-copy-link>Copiar link</button>
            <button class="button button--outline button--small" type="button" data-print>Imprimir artigo</button>
            <a class="button button--secondary button--small" href="#/contato?interesse=conteudo&titulo=${encodeURIComponent(post.title)}">Conversar sobre o tema</a>
          </div>
          <p class="form-message" role="status" data-copy-status></p>
        </div>
      </article>
    `,
    afterRender(scope) {
      scope.querySelector('[data-copy-link]')?.addEventListener('click', async () => {
        const status = scope.querySelector('[data-copy-status]');
        try {
          await navigator.clipboard.writeText(window.location.href);
          status.textContent = 'Link copiado.';
        } catch {
          status.textContent = 'Não foi possível copiar automaticamente. Copie o endereço exibido no navegador.';
        }
      });
      scope.querySelector('[data-print]')?.addEventListener('click', () => window.print());
    }
  };
}
