import { titleFromRoute } from './utils.js';

export class Router {
  constructor({ outlet, routes, onAfterRender }) {
    this.outlet = outlet;
    this.routes = routes;
    this.onAfterRender = onAfterRender;
    this.handleChange = this.handleChange.bind(this);
  }

  start() {
    window.addEventListener('hashchange', this.handleChange);
    if (!window.location.hash) window.location.hash = '#/';
    else this.handleChange();
  }

  parseLocation() {
    const raw = window.location.hash.replace(/^#/, '') || '/';
    const [pathPart, queryString = ''] = raw.split('?');
    const path = pathPart.length > 1 ? pathPart.replace(/\/$/, '') : pathPart;
    return { path, query: new URLSearchParams(queryString) };
  }

  match(path) {
    if (this.routes[path]) return { handler: this.routes[path], params: {} };
    if (path.startsWith('/blog/')) {
      return { handler: this.routes['/blog/:slug'], params: { slug: decodeURIComponent(path.replace('/blog/', '')) } };
    }
    return { handler: this.routes['*'], params: {} };
  }

  async handleChange() {
    const { path, query } = this.parseLocation();
    const match = this.match(path);
    this.outlet.setAttribute('aria-busy', 'true');
    this.outlet.innerHTML = '<div class="route-loader" role="status"><span class="spinner" aria-hidden="true"></span><span class="sr-only">Carregando página</span></div>';

    try {
      const result = await match.handler({ path, query, params: match.params });
      this.outlet.innerHTML = typeof result === 'string' ? result : result.html;
      if (result?.afterRender) await result.afterRender(this.outlet);
      const pageTitle = result?.title || titleFromRoute(path);
      document.title = `${pageTitle} | Neduc`;
      document.querySelector('#route-announcer').textContent = `Página ${pageTitle} carregada.`;
      this.updateNavigation(path);
      window.scrollTo({ top: 0, behavior: document.documentElement.dataset.reduceMotion === 'true' ? 'auto' : 'smooth' });
      this.outlet.setAttribute('aria-busy', 'false');
      this.onAfterRender?.({ path, query, title: pageTitle });
      requestAnimationFrame(() => document.querySelector('#conteudo-principal')?.focus({ preventScroll: true }));
    } catch (error) {
      console.error(error);
      this.outlet.innerHTML = `<section class="error-page"><div><span class="error-code">!</span><h1>Não foi possível carregar esta página</h1><p>${error.message || 'Tente novamente em instantes.'}</p><a class="button button--primary" href="#/">Voltar ao início</a></div></section>`;
      this.outlet.setAttribute('aria-busy', 'false');
    }
  }

  updateNavigation(path) {
    document.querySelectorAll('[data-route-link]').forEach(link => {
      const linkPath = link.getAttribute('href').replace(/^#/, '');
      const isCurrent = path === linkPath || (linkPath !== '/' && path.startsWith(`${linkPath}/`));
      if (isCurrent) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }
}
