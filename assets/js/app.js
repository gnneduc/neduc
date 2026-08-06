import { parseAsciiDoc } from './asciidoc.js';
import { blogCard, catalogCard, formatDate, renderToc } from './components.js';

const main = document.querySelector('#conteudo-principal');
const nav = document.querySelector('#menu-principal');
const menuButton = document.querySelector('.menu-button');
const defaultTitle = 'Neduc — Núcleo de Educação e Competências';

const routes = {
  'inicio': { partial: 'pages/inicio.html', title: defaultTitle, init: initHome },
  'quem-somos': { partial: 'pages/quem-somos.html', title: 'Quem somos | Neduc' },
  'cursos': { partial: 'pages/cursos.html', title: 'Cursos | Neduc', init: () => initCatalog('cursos', 'curso') },
  'treinamentos': { partial: 'pages/treinamentos.html', title: 'Treinamentos | Neduc', init: () => initCatalog('treinamentos', 'treinamento') },
  'mentorias': { partial: 'pages/mentorias.html', title: 'Mentorias | Neduc', init: () => initCatalog('mentorias', 'mentoria') },
  'blog': { partial: 'pages/blog.html', title: 'Blog | Neduc', init: initBlog },
  'contato': { partial: 'pages/contato.html', title: 'Contato | Neduc', init: initContact },
  'acessibilidade': { partial: 'pages/acessibilidade.html', title: 'Acessibilidade | Neduc' },
  'privacidade': { partial: 'pages/privacidade.html', title: 'Privacidade | Neduc' }
};

function parseRoute() {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const [path = 'inicio', queryString = ''] = hash.split('?');
  const segments = path.split('/').filter(Boolean);
  return { route: segments[0] || 'inicio', slug: segments[1] || '', params: new URLSearchParams(queryString) };
}

async function fetchText(path) {
  const response = await fetch(path, { cache: 'no-cache' });
  if (!response.ok) throw new Error(`Não foi possível carregar ${path} (${response.status}).`);
  return response.text();
}

async function fetchJson(path) {
  const response = await fetch(path, { cache: 'no-cache' });
  if (!response.ok) throw new Error(`Não foi possível carregar ${path} (${response.status}).`);
  return response.json();
}

async function navigate() {
  closeMenu();
  const { route, slug, params } = parseRoute();
  main.innerHTML = '<div class="route-loading" role="status" aria-live="polite"><span class="loader" aria-hidden="true"></span> Carregando conteúdo…</div>';

  try {
    if (route === 'blog' && slug) {
      const partial = await fetchText('pages/artigo.html');
      main.innerHTML = partial;
      await initArticle(slug);
      setActiveNav('blog');
    } else {
      const config = routes[route] || routes.inicio;
      const partial = await fetchText(config.partial);
      main.innerHTML = partial;
      document.title = config.title;
      updateDescription(main.querySelector('[data-page-description]')?.dataset.pageDescription);
      setActiveNav(route in routes ? route : 'inicio');
      if (config.init) await config.init(params);
    }

    main.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'auto' });
  } catch (error) {
    console.error(error);
    main.innerHTML = `
      <section class="route-error">
        <h1>Não foi possível carregar esta página</h1>
        <p>Confirme se o site está sendo executado por um servidor HTTP. Em ambiente local, use <code>python -m http.server</code>.</p>
        <a class="button" href="#/inicio">Voltar ao início</a>
      </section>`;
  }
}

function updateDescription(description) {
  const meta = document.querySelector('meta[name="description"]');
  if (description && meta) meta.content = description;
}

function setActiveNav(route) {
  document.querySelectorAll('[data-route]').forEach(link => {
    if (link.dataset.route === route) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

function closeMenu() {
  nav.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.querySelector('.sr-only').textContent = 'Abrir menu principal';
}

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menuButton.querySelector('.sr-only').textContent = open ? 'Abrir menu principal' : 'Fechar menu principal';
  nav.classList.toggle('is-open', !open);
});

nav.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closeMenu();
    menuButton.focus();
  }
});

async function initHome() {
  const [courses, posts] = await Promise.all([
    fetchJson('assets/data/cursos.json'),
    fetchJson('blog/index.json')
  ]);
  const courseTarget = document.querySelector('#cursos-destaque');
  const blogTarget = document.querySelector('#blog-destaque');
  if (courseTarget) courseTarget.innerHTML = courses.slice(0, 3).map(item => catalogCard(item, 'curso')).join('');
  if (blogTarget) blogTarget.innerHTML = posts.slice(0, 3).map(post => blogCard({ ...post, dataFormatada: formatDate(post.data) })).join('');
}

async function initCatalog(file, type) {
  const items = await fetchJson(`assets/data/${file}.json`);
  const target = document.querySelector('#catalogo-lista');
  const search = document.querySelector('#catalogo-busca');
  const filters = [...document.querySelectorAll('[data-filter]')];
  let activeFilter = 'todos';

  const render = () => {
    const term = search.value.trim().toLocaleLowerCase('pt-BR');
    const result = items.filter(item => {
      const filterMatch = activeFilter === 'todos' || item.categoria === activeFilter || item.formato.toLocaleLowerCase('pt-BR').includes(activeFilter);
      const haystack = [item.titulo, item.resumo, item.categoria, ...(item.temas || [])].join(' ').toLocaleLowerCase('pt-BR');
      return filterMatch && haystack.includes(term);
    });
    target.innerHTML = result.length
      ? result.map(item => catalogCard(item, type)).join('')
      : '<div class="empty-state"><h3>Nenhum resultado encontrado</h3><p>Tente outro termo ou selecione “Todos”.</p></div>';
    document.querySelector('#catalogo-contagem').textContent = `${result.length} ${result.length === 1 ? 'opção encontrada' : 'opções encontradas'}`;
  };

  search.addEventListener('input', render);
  filters.forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    render();
  }));
  render();
}

async function initBlog() {
  const posts = await fetchJson('blog/index.json');
  const target = document.querySelector('#blog-lista');
  const search = document.querySelector('#blog-busca');
  const category = document.querySelector('#blog-categoria');
  const categories = [...new Set(posts.map(post => post.categoria))].sort();
  category.innerHTML += categories.map(item => `<option value="${item}">${item}</option>`).join('');

  const render = () => {
    const term = search.value.trim().toLocaleLowerCase('pt-BR');
    const selected = category.value;
    const result = posts.filter(post => {
      const categoryMatch = !selected || post.categoria === selected;
      const haystack = [post.titulo, post.resumo, post.categoria, ...post.tags].join(' ').toLocaleLowerCase('pt-BR');
      return categoryMatch && haystack.includes(term);
    });
    target.innerHTML = result.length
      ? result.map(post => blogCard({ ...post, dataFormatada: formatDate(post.data) })).join('')
      : '<div class="empty-state"><h3>Nenhum artigo encontrado</h3><p>Altere os filtros e tente novamente.</p></div>';
  };
  search.addEventListener('input', render);
  category.addEventListener('change', render);
  render();
}

async function initArticle(slug) {
  const posts = await fetchJson('blog/index.json');
  const post = posts.find(item => item.id === slug);
  if (!post) throw new Error('Artigo não encontrado.');
  const source = await fetchText(post.arquivo);
  const parsed = parseAsciiDoc(source);

  document.title = `${parsed.title || post.titulo} | Blog Neduc`;
  updateDescription(parsed.attributes.description || post.resumo);
  document.querySelector('#artigo-categoria').textContent = post.categoria;
  document.querySelector('#artigo-titulo').textContent = parsed.title || post.titulo;
  document.querySelector('#artigo-resumo').textContent = parsed.attributes.description || post.resumo;
  document.querySelector('#artigo-data').textContent = formatDate(post.data);
  document.querySelector('#artigo-tempo').textContent = post.tempoLeitura;
  document.querySelector('#artigo-autor').textContent = parsed.attributes.author || 'Equipe Neduc';
  document.querySelector('#artigo-conteudo').innerHTML = parsed.html;
  document.querySelector('#artigo-sumario').innerHTML = renderToc(parsed.headings, slug);
  document.querySelectorAll('[data-scroll-target]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    document.getElementById(link.dataset.scrollTarget)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
}

function initContact(params) {
  const form = document.querySelector('#contato-form');
  const feedback = form.querySelector('.form-feedback');
  const subject = document.querySelector('#assunto');
  const interest = params.get('interesse');
  if (interest) subject.value = `Informações sobre: ${interest}`;

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const body = [
      `Nome: ${data.get('nome')}`,
      `E-mail: ${data.get('email')}`,
      `Telefone: ${data.get('telefone') || 'Não informado'}`,
      `Perfil: ${data.get('perfil')}`,
      '',
      data.get('mensagem')
    ].join('\n');
    const mailto = `mailto:contato@neduc.com.br?subject=${encodeURIComponent(data.get('assunto'))}&body=${encodeURIComponent(body)}`;
    feedback.textContent = 'Seu aplicativo de e-mail será aberto para concluir o envio.';
    feedback.classList.add('form-feedback--success');
    window.location.href = mailto;
  });
}

const newsletter = document.querySelector('#newsletter-form');
newsletter.addEventListener('submit', event => {
  event.preventDefault();
  const email = newsletter.querySelector('input').value;
  const feedback = newsletter.querySelector('.form-feedback');
  feedback.textContent = `Cadastro demonstrativo realizado para ${email}. Conecte este formulário ao seu serviço de e-mail antes da publicação comercial.`;
  feedback.classList.add('form-feedback--success');
  newsletter.reset();
});

document.querySelector('#ano-atual').textContent = new Date().getFullYear();
window.addEventListener('hashchange', navigate);
window.addEventListener('DOMContentLoaded', navigate);
