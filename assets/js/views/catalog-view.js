import { getJSON } from '../data-service.js';
import { hero, sectionHeading, catalogCard, cta, accordion, bindAccordions } from '../components.js';
import { debounce, normalizeText, qs } from '../utils.js';

export async function createCatalogView(config, context = {}) {
  const items = await getJSON(config.dataPath);
  const categories = ['Todos', ...new Set(items.map(item => item.category))];
  const formats = ['Todos', ...new Set(items.map(item => item.format))];

  return {
    title: config.pageTitle,
    html: `
      ${hero({
        eyebrow: config.eyebrow,
        title: config.title,
        description: config.description,
        image: config.heroImage,
        primary: { label: config.primaryLabel, href: `#${context.path || '/'}?section=catalogo` },
        secondary: { label: 'Falar com um especialista', href: `#/contato?interesse=${encodeURIComponent(config.type)}` },
        inner: true
      })}

      <section class="section" id="catalogo" aria-labelledby="catalog-title">
        <div class="container">
          ${sectionHeading({
            eyebrow: config.catalogEyebrow,
            title: `<span id="catalog-title">${config.catalogTitle}</span>`,
            description: config.catalogDescription
          })}

          <div class="catalog-toolbar" role="search" aria-label="Filtros do catálogo">
            <div class="form-field">
              <label for="catalog-search">Buscar por tema ou competência</label>
              <input id="catalog-search" type="search" placeholder="Ex.: inteligência artificial" autocomplete="off">
            </div>
            <div class="form-field">
              <label for="catalog-category">Categoria</label>
              <select id="catalog-category">${categories.map(category => `<option value="${category}">${category}</option>`).join('')}</select>
            </div>
            <div class="form-field">
              <label for="catalog-format">Formato</label>
              <select id="catalog-format">${formats.map(format => `<option value="${format}">${format}</option>`).join('')}</select>
            </div>
          </div>
          <p class="catalog-count" role="status" aria-live="polite"></p>
          <div class="catalog-grid" data-catalog-grid></div>
        </div>
      </section>

      <section class="section section--alt" aria-labelledby="catalog-benefits">
        <div class="container split">
          <div>
            ${sectionHeading({
              eyebrow: config.benefitsEyebrow,
              title: `<span id="catalog-benefits">${config.benefitsTitle}</span>`,
              description: config.benefitsDescription
            })}
            <ul class="check-list">${config.benefits.map(item => `<li>${item}</li>`).join('')}</ul>
          </div>
          <figure class="media-frame"><img src="${config.benefitsImage}" alt="${config.benefitsImageAlt}" width="840" height="560" loading="lazy"></figure>
        </div>
      </section>

      <section class="section" aria-labelledby="catalog-faq">
        <div class="container split split--wide">
          <div>
            ${sectionHeading({
              eyebrow: 'Dúvidas frequentes',
              title: '<span id="catalog-faq">Informações para decidir com segurança</span>',
              description: 'Cada solução pode ser ajustada conforme objetivos, público, carga horária e formato.'
            })}
          </div>
          ${accordion(config.faq)}
        </div>
      </section>

      <section class="section section--compact"><div class="container">
        ${cta({ title: config.ctaTitle, description: config.ctaDescription, label: config.ctaLabel, href: `#/contato?interesse=${encodeURIComponent(config.type)}` })}
      </div></section>
    `,
    afterRender(scope) {
      const search = qs('#catalog-search', scope);
      const category = qs('#catalog-category', scope);
      const format = qs('#catalog-format', scope);
      const grid = qs('[data-catalog-grid]', scope);
      const count = qs('.catalog-count', scope);

      const render = () => {
        const term = normalizeText(search.value);
        const filtered = items.filter(item => {
          const searchable = normalizeText(`${item.title} ${item.summary} ${item.category} ${(item.skills || []).join(' ')}`);
          return (!term || searchable.includes(term)) &&
            (category.value === 'Todos' || item.category === category.value) &&
            (format.value === 'Todos' || item.format === format.value);
        });
        count.textContent = `${filtered.length} ${filtered.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}.`;
        grid.innerHTML = filtered.length
          ? filtered.map(item => catalogCard(item, config.type)).join('')
          : '<div class="empty-state" style="grid-column:1/-1"><h3>Nenhum resultado encontrado</h3><p>Altere os filtros ou fale com a Neduc para solicitar uma solução personalizada.</p><a class="button button--secondary" href="#/contato">Solicitar solução</a></div>';
      };

      search.addEventListener('input', debounce(render));
      category.addEventListener('change', render);
      format.addEventListener('change', render);
      bindAccordions(scope);
      render();
      if (context.query?.get('section') === 'catalogo') {
        requestAnimationFrame(() => scope.querySelector('#catalogo')?.scrollIntoView({ behavior: document.documentElement.dataset.reduceMotion === 'true' ? 'auto' : 'smooth' }));
      }
    }
  };
}
