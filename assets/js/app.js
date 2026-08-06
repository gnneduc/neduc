import { parseAsciiDoc } from './asciidoc.js';

const ROOT = new URL('../../', import.meta.url);
const DATA = new URL('assets/data/', ROOT);
const IMAGES = new URL('assets/images/', ROOT);
const app = document.querySelector('#app');
const headerHost = document.querySelector('#site-header');
const footerHost = document.querySelector('#site-footer');
const cache = new Map();
let siteConfig = null;

const icons = {
  education: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m3 10 9-5 9 5-9 5-9-5Z"/><path d="M7 12.2V17c2.8 2 7.2 2 10 0v-4.8"/><path d="M21 10v6"/></svg>',
  technology: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 9h6v6H9zM9 1v3m6-3v3M9 20v3m6-3v3M20 9h3m-3 6h3M1 9h3m-3 6h3"/></svg>',
  consulting: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20V10m6 10V4m6 16v-7m4 7H2"/><path d="m3 7 5-4 5 4 7-5"/></svg>',
  course: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 3h11a3 3 0 0 1 3 3v15H7a3 3 0 0 1-3-3V4a1 1 0 0 1 1-1Z"/><path d="M7 17h12M8 7h7M8 11h5"/></svg>',
  training: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4M7 9h3v4H7zm7-2h3v6h-3z"/></svg>',
  mentoring: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8 2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M2 21c0-4 2.4-7 6-7s6 3 6 7m0 0c0-2.8 1.7-5 4-5s4 2.2 4 5"/></svg>',
  target: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>',
  check: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 12 4 4L19 6"/></svg>',
  mail: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></svg>',
  phone: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 4h4l2 5-3 2a16 16 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2C9.7 21 3 14.3 3 6a2 2 0 0 1 2-2Z"/></svg>',
  social: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>',
  menu: '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg>'
};

const routeMeta = {
  '': { key: 'inicio', title: 'Neduc — Núcleo de Educação e Competências', description: 'Cursos, treinamentos e mentorias práticas em tecnologia, inteligência artificial, dados, gestão e inovação.' },
  'quem-somos': { key: 'quem-somos', title: 'Quem somos | Neduc', description: 'Conheça a missão, a visão, os valores, as áreas de atuação e a metodologia de ensino da Neduc.' },
  'cursos': { key: 'cursos', title: 'Cursos | Neduc', description: 'Cursos práticos em inteligência artificial, programação, dados, automação, gestão e inovação.' },
  'blog': { key: 'blog', title: 'Blog | Neduc', description: 'Artigos sobre educação, inteligência artificial, tecnologia, carreira, liderança e futuro do trabalho.' },
  'treinamentos': { key: 'treinamentos', title: 'Treinamentos | Neduc', description: 'Treinamentos corporativos, workshops, bootcamps e trilhas de aprendizagem sob medida.' },
  'mentorias': { key: 'mentorias', title: 'Mentorias | Neduc', description: 'Mentorias individuais e em grupo para carreira, liderança, IA, dados e projetos.' },
  'contato': { key: 'contato', title: 'Contato | Neduc', description: 'Fale com a Neduc e solicite uma proposta de curso, treinamento ou mentoria.' }
};

const navItems = [
  ['', 'Início'], ['quem-somos/', 'Quem somos'], ['cursos/', 'Cursos'], ['blog/', 'Blog'],
  ['treinamentos/', 'Treinamentos'], ['mentorias/', 'Mentorias'], ['contato/', 'Contato']
];

const urlFor = (path = '') => new URL(path, ROOT).href;
const asset = (path) => urlFor(path);
const escapeHtml = (value = '') => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
const formatDate = (value) => new Intl.DateTimeFormat('pt-BR', { day:'2-digit', month:'long', year:'numeric', timeZone:'UTC' }).format(new Date(`${value}T12:00:00Z`));

async function loadJson(name) {
  if (cache.has(name)) return cache.get(name);
  const response = await fetch(new URL(name, DATA));
  if (!response.ok) throw new Error(`Não foi possível carregar ${name}.`);
  const data = await response.json();
  cache.set(name, data);
  return data;
}

function relativePath() {
  const basePath = ROOT.pathname.endsWith('/') ? ROOT.pathname : `${ROOT.pathname}/`;
  let path = decodeURIComponent(location.pathname);
  if (path.startsWith(basePath)) path = path.slice(basePath.length);
  path = path.replace(/^\/+|\/+$/g,'').replace(/index\.html$/,'').replace(/\/+$/,'');
  return path;
}

function currentRoute() {
  const path = relativePath();
  const first = path.split('/')[0];
  return routeMeta[first] ? first : '';
}

function updateDocument(route, customTitle = null, customDescription = null) {
  const meta = routeMeta[route] || routeMeta[''];
  document.title = customTitle || meta.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', customDescription || meta.description);
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', location.href.split('#')[0]);
}

async function renderChrome() {
  siteConfig = await loadJson('site.json');
  headerHost.innerHTML = `
    <div class="announcement"><div class="container">${escapeHtml(siteConfig.slogan)}</div></div>
    <div class="site-header">
      <div class="container header-inner">
        <a class="brand" href="${urlFor('')}" data-route aria-label="Neduc — página inicial">
          <img src="${asset('assets/images/logo-neduc.png')}" width="190" height="64" alt="Neduc">
          <span class="brand-subtitle">Núcleo de Educação e Competências</span>
        </a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="Abrir menu">${icons.menu}</button>
        <nav class="site-nav" id="primary-navigation" aria-label="Navegação principal" data-open="false">
          <ul>${navItems.map(([path,label]) => `<li><a href="${urlFor(path)}" data-route data-nav="${path.replace('/','') || 'inicio'}"${label==='Contato'?' class="nav-cta"':''}>${label}</a></li>`).join('')}</ul>
        </nav>
      </div>
    </div>`;

  footerHost.innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand stack">
            <img src="${asset('assets/images/logo-neduc.png')}" width="220" height="74" alt="Neduc">
            <p>Desenvolvemos competências aplicáveis para pessoas, equipes e organizações por meio de educação, tecnologia e consultoria.</p>
          </div>
          <div><h2>Soluções</h2><ul><li><a href="${urlFor('cursos/')}" data-route>Cursos</a></li><li><a href="${urlFor('treinamentos/')}" data-route>Treinamentos</a></li><li><a href="${urlFor('mentorias/')}" data-route>Mentorias</a></li><li><a href="${urlFor('blog/')}" data-route>Blog</a></li></ul></div>
          <div><h2>Institucional</h2><ul><li><a href="${urlFor('quem-somos/')}" data-route>Quem somos</a></li><li><a href="${urlFor('contato/')}" data-route>Contato</a></li><li><a href="${urlFor('acessibilidade.html')}">Acessibilidade</a></li><li><a href="${urlFor('privacidade.html')}">Privacidade</a></li></ul></div>
          <div><h2>Fale conosco</h2><ul><li><a href="mailto:${escapeHtml(siteConfig.email)}">${escapeHtml(siteConfig.email)}</a></li><li><a href="tel:${escapeHtml(siteConfig.telefone.replace(/\s/g,''))}">${escapeHtml(siteConfig.telefoneExibicao)}</a></li><li><span>@${escapeHtml(siteConfig.instagram)}</span></li></ul></div>
        </div>
        <div class="footer-bottom"><span>© ${new Date().getFullYear()} Neduc. Todos os direitos reservados.</span><span>HTML5, CSS e JavaScript — compatível com GitHub Pages.</span></div>
      </div>
    </footer>`;

  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  toggle?.addEventListener('click', () => {
    const open = nav.dataset.open !== 'true';
    nav.dataset.open = String(open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    if (open) nav.querySelector('a')?.focus();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav?.dataset.open === 'true') {
      nav.dataset.open = 'false'; toggle?.setAttribute('aria-expanded','false'); toggle?.focus();
    }
  });
}

function setActiveNav(route) {
  const key = route || 'inicio';
  document.querySelectorAll('[data-nav]').forEach(link => {
    if (link.dataset.nav === key) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');
  });
  const nav = document.querySelector('.site-nav');
  const toggle = document.querySelector('.nav-toggle');
  if (nav) nav.dataset.open = 'false';
  toggle?.setAttribute('aria-expanded','false');
}

function pageHero({ eyebrow, title, description }) {
  return `<section class="page-hero"><div class="container"><nav class="breadcrumb" aria-label="Trilha de navegação"><a href="${urlFor('')}" data-route>Início</a><span aria-hidden="true">/</span><span aria-current="page">${escapeHtml(title)}</span></nav><p class="eyebrow">${escapeHtml(eyebrow)}</p><h1>${escapeHtml(title)}</h1><p class="lead">${escapeHtml(description)}</p></div></section>`;
}

function cardIcon(icon) { return `<div class="card-icon">${icons[icon] || icons.target}</div>`; }
function ctaBand() {
  return `<section class="section-sm"><div class="container"><div class="cta-band"><div><p class="eyebrow">Próximo passo</p><h2>Vamos construir uma jornada de aprendizagem com propósito?</h2><p>Conte o desafio da sua carreira, equipe ou organização. A Neduc ajuda a diagnosticar necessidades e propor o formato mais adequado.</p></div><a class="btn btn-secondary" href="${urlFor('contato/')}" data-route>Falar com a Neduc</a></div></div></section>`;
}

function renderHome() {
  updateDocument('');
  app.innerHTML = `
    <section class="hero">
      <div class="container"><div class="hero-content">
        <p class="eyebrow">Educação • Tecnologia • Consultoria</p>
        <h1 class="display">Competências para <span>transformar</span> desafios em resultados.</h1>
        <p class="lead">A Neduc desenvolve pessoas, equipes e organizações com cursos, treinamentos, mentorias e experiências práticas em tecnologia, inteligência artificial, dados, gestão e inovação.</p>
        <div class="hero-actions"><a class="btn btn-primary" href="${urlFor('cursos/')}" data-route>Explorar cursos</a><a class="btn btn-light-outline" href="${urlFor('contato/')}" data-route>Solicitar uma proposta</a></div>
        <div class="hero-proof" aria-label="Estrutura da Neduc"><div><strong>3</strong><span>áreas de atuação</span></div><div><strong>5</strong><span>etapas metodológicas</span></div><div><strong>3</strong><span>formatos de aprendizagem</span></div></div>
      </div></div>
    </section>

    <section class="section"><div class="container">
      <div class="section-heading"><div><p class="eyebrow">Soluções profissionais</p><h2>Aprendizado que se conecta à realidade</h2></div><p>Combinamos teoria, prática, acompanhamento e metas para transformar conhecimento em competências aplicáveis.</p></div>
      <div class="grid-3">
        <article class="card solution-card">${cardIcon('course')}<h3>Cursos</h3><p>Jornadas estruturadas para desenvolver competências atuais, ampliar oportunidades e aplicar tecnologia em desafios reais.</p><a class="link-arrow" href="${urlFor('cursos/')}" data-route>Conhecer cursos</a></article>
        <article class="card solution-card">${cardIcon('training')}<h3>Treinamentos</h3><p>Capacitações personalizadas para equipes, lideranças e organizações, com formatos in company, workshops e trilhas.</p><a class="link-arrow" href="${urlFor('treinamentos/')}" data-route>Conhecer treinamentos</a></article>
        <article class="card solution-card">${cardIcon('mentoring')}<h3>Mentorias</h3><p>Acompanhamento individual ou em grupo, com diagnóstico, metas, plano de ação, feedback e orientação aplicada.</p><a class="link-arrow" href="${urlFor('mentorias/')}" data-route>Conhecer mentorias</a></article>
      </div>
    </div></section>

    <section class="section section-soft"><div class="container"><div class="split">
      <div class="media-frame"><img src="${asset('assets/images/aprendizagem.webp')}" alt="Pessoa estudando inteligência artificial em uma biblioteca" loading="lazy" width="1000" height="563"></div>
      <div class="stack-lg"><div><p class="eyebrow">Nossa essência</p><h2>Conhecimento aplicado para pessoas e organizações</h2></div><p class="lead">Aprendizagem ganha valor quando ajuda alguém a agir com mais autonomia, segurança e qualidade.</p><ul class="feature-list"><li>Casos, atividades e projetos contextualizados.</li><li>Orientação próxima e feedback construtivo.</li><li>Soluções alinhadas a necessidades reais.</li><li>Objetivos e indicadores definidos desde o início.</li></ul><div><a class="btn btn-outline" href="${urlFor('quem-somos/')}" data-route>Conhecer a Neduc</a></div></div>
    </div></div></section>

    <section class="section"><div class="container">
      <div class="section-heading"><div><p class="eyebrow">Para quem se destina</p><h2>Desenvolvimento em diferentes momentos da jornada</h2></div><p>Da primeira experiência com tecnologia ao desenvolvimento de lideranças e soluções organizacionais sob medida.</p></div>
      <div class="grid-4">
        <article class="card audience-card"><h3>Estudantes e iniciantes</h3><p>Base prática para transformar curiosidade em competências aplicáveis.</p></article>
        <article class="card audience-card"><h3>Profissionais em evolução</h3><p>Atualização, produtividade e ampliação de oportunidades de carreira.</p></article>
        <article class="card audience-card"><h3>Equipes e lideranças</h3><p>Competências técnicas, estratégicas e comportamentais conectadas ao cotidiano.</p></article>
        <article class="card audience-card"><h3>Empresas e organizações</h3><p>Soluções personalizadas para capacitar pessoas e impulsionar inovação.</p></article>
      </div>
    </div></section>

    <section class="section section-dark"><div class="container"><div class="section-heading"><div><p class="eyebrow">Metodologia Neduc</p><h2>Uma jornada clara, acompanhada e mensurável</h2></div><p>O processo organiza a aprendizagem do diagnóstico à evolução dos resultados.</p></div><div class="process">
      <article class="process-step"><h3>Diagnosticar</h3><p>Identificar necessidades, objetivos e desafios.</p></article>
      <article class="process-step"><h3>Planejar</h3><p>Definir competências, conteúdos, trilha e metas.</p></article>
      <article class="process-step"><h3>Aprender e aplicar</h3><p>Combinar teoria, prática, casos e projetos.</p></article>
      <article class="process-step"><h3>Acompanhar e ajustar</h3><p>Orientar, oferecer feedback e ajustar a jornada.</p></article>
      <article class="process-step"><h3>Medir e evoluir</h3><p>Avaliar aprendizagem, aplicação e resultados.</p></article>
    </div></div></section>

    <section class="section"><div class="container"><div class="section-heading"><div><p class="eyebrow">Em destaque</p><h2>Programas para competências atuais</h2></div><p>Os conteúdos são carregados diretamente do catálogo em JSON e podem ser atualizados sem alterar a estrutura da página.</p></div><div id="home-featured" class="catalog-grid"><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div></div></div></section>

    <section class="section section-blue"><div class="container"><div class="section-heading"><div><p class="eyebrow">Experiências de aprendizagem</p><h2>Formatos que respeitam objetivos e contextos</h2></div><p>Presencial, on-line ao vivo ou EaD, com possibilidade de bootcamps, hackathons, masterclasses, workshops e trilhas.</p></div><div class="grid-3"><article class="card"><h3>Presencial</h3><p>Interação direta, colaboração e prática no local da empresa ou em espaço definido.</p></article><article class="card"><h3>On-line ao vivo</h3><p>Aulas em tempo real, com professor, participação ativa, dúvidas e atividades conduzidas ao vivo.</p></article><article class="card"><h3>EaD</h3><p>Conteúdos em ambiente virtual, com flexibilidade, autonomia e aprendizagem no próprio ritmo.</p></article></div></div></section>
    ${ctaBand()}`;
  loadJson('cursos.json').then(data => {
    const host = document.querySelector('#home-featured');
    if (host) host.innerHTML = data.filter(x => x.destaque).slice(0,3).map(programCard).join('');
  }).catch(showDataError);
}

function renderAbout() {
  updateDocument('quem-somos');
  app.innerHTML = `${pageHero({eyebrow:'Institucional', title:'Quem somos', description:'A Neduc desenvolve competências aplicáveis por meio de experiências educacionais práticas em tecnologia, inteligência artificial, dados, gestão e inovação.'})}
    <section class="section"><div class="container"><div class="split"><div class="stack-lg"><div><p class="eyebrow">Conhecimento aplicado</p><h2>Educação que aproxima pessoas do futuro do trabalho</h2></div><p class="lead">Promovemos desenvolvimento com propósito, orientação próxima e conexão entre aprendizagem e desafios reais.</p><p>Nossa proposta atende pessoas em diferentes momentos profissionais e organizações que precisam fortalecer competências, adotar novas tecnologias, melhorar produtividade e desenvolver lideranças.</p><ul class="feature-list"><li>Aprendizagem aplicada a contextos reais.</li><li>Mentoria e acompanhamento próximos.</li><li>Soluções construídas sob medida.</li><li>Resultados acompanhados com objetivos e indicadores.</li></ul></div><div class="media-frame"><img src="${asset('assets/images/equipe.webp')}" alt="Profissionais colaborando em uma reunião de aprendizagem" loading="lazy"></div></div></div></section>
    <section class="section section-soft"><div class="container"><div class="grid-3"><article class="card value-card"><p class="eyebrow">Missão</p><h3>Desenvolver pessoas e organizações</h3><p>Promover desenvolvimento por meio de mentorias, treinamentos e soluções educacionais práticas em tecnologia, inteligência artificial, gestão e inovação.</p></article><article class="card value-card"><p class="eyebrow">Visão</p><h3>Preparar para o futuro</h3><p>Ser referência em capacitação profissional, preparando pessoas, equipes e organizações para desafios e oportunidades do futuro do trabalho.</p></article><article class="card value-card"><p class="eyebrow">Valores</p><h3>Agir com propósito</h3><p>Ética, inovação, inclusão, colaboração, qualidade, aprendizado contínuo e compromisso com resultados reais.</p></article></div></div></section>
    <section class="section"><div class="container"><div class="section-heading"><div><p class="eyebrow">Áreas de atuação</p><h2>Três frentes que se complementam</h2></div><p>Integramos educação, tecnologia e consultoria para responder a desafios de desenvolvimento profissional e organizacional.</p></div><div class="grid-3"><article class="card">${cardIcon('education')}<h3>Educação</h3><p>Cursos, treinamentos e mentorias para transformar conhecimento em competências aplicáveis.</p></article><article class="card">${cardIcon('technology')}<h3>Tecnologia</h3><p>Inteligência artificial, programação, dados e automação para melhorar processos e produtividade.</p></article><article class="card">${cardIcon('consulting')}<h3>Consultoria</h3><p>Diagnóstico e implementação de soluções educacionais, tecnológicas e inovadoras para organizações.</p></article></div></div></section>
    <section class="section section-dark"><div class="container"><div class="section-heading"><div><p class="eyebrow">Desafios que ajudamos a superar</p><h2>Do diagnóstico à aplicação</h2></div><p>As soluções são desenhadas a partir de necessidades concretas, não de fórmulas genéricas.</p></div><div class="grid-3"><article class="card"><h3>Lacunas de competências</h3><p>Identificar prioridades e construir uma jornada de desenvolvimento coerente.</p></article><article class="card"><h3>Adoção prática de IA</h3><p>Transformar curiosidade em casos de uso seguros, úteis e mensuráveis.</p></article><article class="card"><h3>Baixa produtividade</h3><p>Revisar rotinas, desenvolver capacidades e melhorar processos.</p></article><article class="card"><h3>Atualização profissional</h3><p>Conectar conhecimentos atuais às oportunidades do mercado e da carreira.</p></article><article class="card"><h3>Desenvolvimento de lideranças</h3><p>Fortalecer comunicação, decisão, colaboração e gestão de pessoas.</p></article><article class="card"><h3>Inovação sustentável</h3><p>Experimentar soluções com critérios, governança e aprendizagem contínua.</p></article></div></div></section>
    <section class="section"><div class="container"><div class="quote-panel"><blockquote>“Treinamento que capacita. Mentoria que orienta. Futuro que se constrói.”</blockquote><cite>Neduc — Núcleo de Educação e Competências</cite></div></div></section>${ctaBand()}`;
}

function programCard(item) {
  const duration = item.cargaHoraria || item.duracao || item.ciclo;
  const formats = Array.isArray(item.formato) ? item.formato.join(' • ') : (item.formato || item.modalidade || 'Formato personalizado');
  const list = item.resultados || item.entregaveis || item.etapas || [];
  const modules = item.modulos || [];
  return `<article class="card program-card">
    <div class="program-image"><img src="${asset(item.imagem)}" alt="" loading="lazy" width="600" height="338"></div>
    <div class="program-body"><div class="program-meta">${item.categoria ? `<span class="tag tag-red">${escapeHtml(item.categoria)}</span>` : ''}${item.nivel ? `<span class="tag">${escapeHtml(item.nivel)}</span>` : ''}</div>
    <h3>${escapeHtml(item.titulo)}</h3><p class="program-summary">${escapeHtml(item.resumo)}</p><p><strong>${escapeHtml(duration || '')}</strong><br><span>${escapeHtml(formats)}</span></p>
    <details><summary>Ver detalhes</summary><p><strong>Público:</strong> ${escapeHtml(item.publico)}</p>${list.length ? `<h4>Resultados e entregas</h4><ul>${list.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul>`:''}${modules.length ? `<h4>Conteúdo</h4><ul>${modules.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul>`:''}<a class="btn btn-primary btn-small" href="${urlFor('contato/')}?interesse=${encodeURIComponent(item.titulo)}" data-route>Tenho interesse</a></details></div></article>`;
}

function showDataError(error) {
  console.error(error);
  const candidates = document.querySelectorAll('.catalog-grid, .blog-grid');
  candidates.forEach(host => { if (!host.children.length || host.querySelector('.skeleton')) host.innerHTML = `<div class="empty-state"><h3>Conteúdo indisponível</h3><p>Execute o site por um servidor HTTP para permitir a leitura dos arquivos JSON e AsciiDoc.</p></div>`; });
}

function setupCatalog({data, gridId, searchId, filterId, statusId, extraFilter = () => true}) {
  const grid = document.querySelector(`#${gridId}`);
  const search = document.querySelector(`#${searchId}`);
  const filter = document.querySelector(`#${filterId}`);
  const status = document.querySelector(`#${statusId}`);
  const categories = [...new Set(data.map(x => x.categoria).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
  if (filter) filter.innerHTML = `<option value="">Todas as categorias</option>${categories.map(x=>`<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`).join('')}`;
  const draw = () => {
    const query = search?.value.trim().toLocaleLowerCase('pt-BR') || '';
    const category = filter?.value || '';
    const result = data.filter(item => {
      const text = `${item.titulo} ${item.resumo} ${item.publico} ${item.categoria || ''}`.toLocaleLowerCase('pt-BR');
      return (!query || text.includes(query)) && (!category || item.categoria === category) && extraFilter(item);
    });
    grid.innerHTML = result.length ? result.map(programCard).join('') : `<div class="empty-state"><h3>Nenhum resultado encontrado</h3><p>Tente remover um filtro ou usar termos mais amplos.</p></div>`;
    status.textContent = `${result.length} ${result.length === 1 ? 'opção encontrada' : 'opções encontradas'}.`;
  };
  search?.addEventListener('input', draw); filter?.addEventListener('change', draw); draw();
}

function catalogPage({route, eyebrow, title, description, dataFile, introTitle, introText, image, type}) {
  updateDocument(route);
  app.innerHTML = `${pageHero({eyebrow,title,description})}
    <section class="section-sm section-soft"><div class="container"><div class="split"><div class="stack"><p class="eyebrow">${escapeHtml(type)}</p><h2>${escapeHtml(introTitle)}</h2><p class="lead">${escapeHtml(introText)}</p></div><div class="media-frame"><img src="${asset(image)}" alt="" loading="lazy"></div></div></div></section>
    <section class="section"><div class="container"><div class="section-heading"><div><p class="eyebrow">Catálogo</p><h2>Encontre a solução adequada</h2></div><p>Pesquise por tema, objetivo ou público. As informações abaixo são lidas diretamente do arquivo JSON.</p></div>
      <div class="catalog-toolbar"><div class="form-field"><label for="catalog-search">Pesquisar</label><input class="input" id="catalog-search" type="search" placeholder="Ex.: inteligência artificial, liderança, dados"></div><div class="form-field"><label for="catalog-filter">Categoria</label><select class="select" id="catalog-filter"><option>Carregando...</option></select></div><button class="btn btn-outline" id="catalog-clear" type="button">Limpar filtros</button></div>
      <p class="results-status" id="catalog-status" role="status" aria-live="polite">Carregando opções...</p><div class="catalog-grid" id="catalog-grid"><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div></div>
    </div></section>${ctaBand()}`;
  loadJson(dataFile).then(data => {
    setupCatalog({data, gridId:'catalog-grid', searchId:'catalog-search', filterId:'catalog-filter', statusId:'catalog-status'});
    document.querySelector('#catalog-clear')?.addEventListener('click', () => { document.querySelector('#catalog-search').value=''; document.querySelector('#catalog-filter').value=''; document.querySelector('#catalog-search').dispatchEvent(new Event('input')); document.querySelector('#catalog-search').focus(); });
  }).catch(showDataError);
}

function renderCourses() {
  catalogPage({route:'cursos', eyebrow:'Formação profissional', title:'Cursos', description:'Jornadas que combinam fundamentos, prática, acompanhamento e projetos para desenvolver competências atuais.', dataFile:'cursos.json', introTitle:'Teoria e prática em uma jornada estruturada', introText:'Os cursos da Neduc ampliam oportunidades profissionais e ajudam participantes a aplicar tecnologia, inteligência artificial e inovação em desafios reais.', image:'assets/images/cursos.webp', type:'Aprendizado contínuo'});
}

function renderTrainings() {
  catalogPage({route:'treinamentos', eyebrow:'Soluções para organizações', title:'Treinamentos', description:'Capacitações personalizadas, workshops, bootcamps e trilhas alinhadas aos desafios da organização.', dataFile:'treinamentos.json', introTitle:'Desenvolvimento conectado ao negócio', introText:'Cada treinamento pode ser adaptado ao contexto, à maturidade e às prioridades da equipe, com atividades aplicadas e entregas claras.', image:'assets/images/treinamentos.webp', type:'In company e experiências intensivas'});
  setTimeout(() => {
    const section = document.querySelector('.section-sm .container');
    section?.insertAdjacentHTML('afterend', `<div class="container section-sm"><div class="grid-3"><article class="card"><h3>Workshops</h3><p>Encontros dinâmicos para introduzir temas, resolver desafios e gerar aplicação imediata.</p></article><article class="card"><h3>Bootcamps e hackathons</h3><p>Jornadas intensivas com desafios, colaboração, prototipação e acompanhamento especializado.</p></article><article class="card"><h3>Trilhas de aprendizagem</h3><p>Percursos contínuos que combinam conteúdos, práticas, metas e avaliação de resultados.</p></article></div></div>`);
  },0);
}

function renderMentoring() {
  catalogPage({route:'mentorias', eyebrow:'Desenvolvimento orientado', title:'Mentorias', description:'Acompanhamento próximo para transformar objetivos em planos de ação, prática, feedback e evolução.', dataFile:'mentorias.json', introTitle:'Orientação para decisões e desafios reais', introText:'As mentorias podem ser individuais ou em grupo e começam por um diagnóstico para definir foco, metas e ritmo de acompanhamento.', image:'assets/images/mentorias.webp', type:'Mentoria próxima'});
}

function blogCard(article) {
  return `<article class="card blog-card"><div class="blog-card-image"><img src="${asset(article.imagem)}" alt="" loading="lazy"></div><div class="blog-card-body"><div class="program-meta"><span class="tag tag-red">${escapeHtml(article.categoria)}</span></div><h2>${escapeHtml(article.titulo)}</h2><div class="blog-meta"><time datetime="${article.data}">${formatDate(article.data)}</time><span>•</span><span>${escapeHtml(article.tempoLeitura)}</span></div><p>${escapeHtml(article.resumo)}</p><a class="link-arrow" href="${urlFor('blog/')}?artigo=${encodeURIComponent(article.id)}" data-article="${escapeHtml(article.id)}">Ler artigo</a></div></article>`;
}

function renderBlog() {
  const articleId = new URLSearchParams(location.search).get('artigo');
  if (articleId) { renderArticle(articleId); return; }
  updateDocument('blog');
  app.innerHTML = `${pageHero({eyebrow:'Conteúdo e ideias', title:'Blog', description:'Reflexões e orientações práticas sobre educação, tecnologia, inteligência artificial, carreira, liderança e inovação.'})}
    <section class="section"><div class="container"><div class="catalog-toolbar"><div class="form-field"><label for="blog-search">Pesquisar artigos</label><input class="input" id="blog-search" type="search" placeholder="Ex.: aprendizagem, IA, liderança"></div><div class="form-field"><label for="blog-filter">Categoria</label><select class="select" id="blog-filter"><option>Carregando...</option></select></div><button class="btn btn-outline" id="blog-clear" type="button">Limpar filtros</button></div><p class="results-status" id="blog-status" role="status" aria-live="polite">Carregando artigos...</p><div class="blog-grid" id="blog-grid"><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div></div></div></section>${ctaBand()}`;
  loadJson('blog.json').then(data => {
    const grid = document.querySelector('#blog-grid'), search = document.querySelector('#blog-search'), filter = document.querySelector('#blog-filter'), status = document.querySelector('#blog-status');
    const categories=[...new Set(data.map(x=>x.categoria))].sort((a,b)=>a.localeCompare(b,'pt-BR'));
    filter.innerHTML=`<option value="">Todas as categorias</option>${categories.map(x=>`<option value="${escapeHtml(x)}">${escapeHtml(x)}</option>`).join('')}`;
    const draw=()=>{ const q=search.value.trim().toLocaleLowerCase('pt-BR'), cat=filter.value; const result=data.filter(x=>(!q||`${x.titulo} ${x.resumo} ${x.tags.join(' ')}`.toLocaleLowerCase('pt-BR').includes(q))&&(!cat||x.categoria===cat)); grid.innerHTML=result.length?result.map(blogCard).join(''):`<div class="empty-state"><h3>Nenhum artigo encontrado</h3><p>Tente uma busca diferente.</p></div>`; status.textContent=`${result.length} ${result.length===1?'artigo encontrado':'artigos encontrados'}.`; };
    search.addEventListener('input',draw); filter.addEventListener('change',draw); document.querySelector('#blog-clear').addEventListener('click',()=>{search.value='';filter.value='';draw();search.focus();}); draw();
  }).catch(showDataError);
}

async function renderArticle(id) {
  try {
    const articles = await loadJson('blog.json');
    const meta = articles.find(x => x.id === id);
    if (!meta) throw new Error('Artigo não encontrado.');
    const response = await fetch(new URL(meta.arquivo, ROOT));
    if (!response.ok) throw new Error('Não foi possível carregar o artigo.');
    const parsed = parseAsciiDoc(await response.text());
    updateDocument('blog', `${meta.titulo} | Neduc`, meta.resumo);
    const toc = parsed.headings.length ? `<aside class="article-toc" aria-label="Sumário do artigo"><h2>Neste artigo</h2><ol>${parsed.headings.map(h=>`<li><a href="#${h.id}">${escapeHtml(h.label)}</a></li>`).join('')}</ol></aside>` : '';
    app.innerHTML = `<section class="page-hero"><div class="container article-header"><nav class="breadcrumb" aria-label="Trilha de navegação"><a href="${urlFor('')}" data-route>Início</a><span aria-hidden="true">/</span><a href="${urlFor('blog/')}" data-route>Blog</a><span aria-hidden="true">/</span><span aria-current="page">Artigo</span></nav><p class="eyebrow">${escapeHtml(meta.categoria)}</p><h1>${escapeHtml(meta.titulo)}</h1><div class="blog-meta"><time datetime="${meta.data}">${formatDate(meta.data)}</time><span>•</span><span>${escapeHtml(meta.tempoLeitura)}</span><span>•</span><span>${escapeHtml(meta.autor)}</span></div><div class="article-lead-image"><img src="${asset(meta.imagem)}" alt="" width="1200" height="525"></div></div></section><section class="section"><div class="container article-shell"><article class="article">${parsed.html}<hr><p><a class="link-arrow" href="${urlFor('blog/')}" data-route>Voltar ao blog</a></p></article>${toc}</div></section>${ctaBand()}`;
    window.scrollTo({top:0,behavior:'auto'});
  } catch (error) {
    updateDocument('blog','Artigo não encontrado | Neduc');
    app.innerHTML = `${pageHero({eyebrow:'Blog',title:'Artigo não encontrado',description:'O conteúdo solicitado não está disponível ou o endereço está incorreto.'})}<section class="section"><div class="container"><a class="btn btn-primary" href="${urlFor('blog/')}" data-route>Voltar ao blog</a></div></section>`;
  }
}

function renderContact() {
  updateDocument('contato');
  const interest = new URLSearchParams(location.search).get('interesse') || '';
  app.innerHTML = `${pageHero({eyebrow:'Vamos conversar', title:'Contato', description:'Compartilhe seu objetivo ou desafio. A Neduc ajuda a identificar o formato mais adequado para pessoas, equipes e organizações.'})}
    <section class="section"><div class="container contact-grid"><div class="stack-lg"><div><p class="eyebrow">Canais de atendimento</p><h2>Fale com a Neduc</h2><p>Use o formulário ou entre em contato pelos canais abaixo. O envio do formulário abrirá seu aplicativo de e-mail, pois o GitHub Pages é uma hospedagem estática.</p></div><ul class="contact-list"><li>${cardIcon('mail')}<div><strong>E-mail</strong><br><a href="mailto:${escapeHtml(siteConfig.email)}">${escapeHtml(siteConfig.email)}</a><br><a href="mailto:${escapeHtml(siteConfig.emailInstitucional)}">${escapeHtml(siteConfig.emailInstitucional)}</a></div></li><li>${cardIcon('phone')}<div><strong>Telefone e WhatsApp</strong><br><a href="tel:${escapeHtml(siteConfig.telefone.replace(/\s/g,''))}">${escapeHtml(siteConfig.telefoneExibicao)}</a></div></li><li>${cardIcon('social')}<div><strong>Redes sociais</strong><br>Instagram e Telegram: @${escapeHtml(siteConfig.instagram)}<br>Facebook: ${escapeHtml(siteConfig.facebook)}</div></li></ul><div class="notice"><strong>Atendimento personalizado:</strong> para treinamentos corporativos, informe público, quantidade estimada de participantes, formato desejado e principal desafio.</div></div>
      <form class="contact-form" id="contact-form" novalidate><div class="stack"><p class="eyebrow">Solicite informações</p><h2>Conte o que você precisa</h2></div><div class="form-grid">
        <div class="form-field"><label for="name">Nome <span aria-hidden="true">*</span></label><input class="input" id="name" name="name" autocomplete="name" required><span class="error-text" id="name-error"></span></div>
        <div class="form-field"><label for="email">E-mail <span aria-hidden="true">*</span></label><input class="input" id="email" name="email" type="email" autocomplete="email" required><span class="error-text" id="email-error"></span></div>
        <div class="form-field"><label for="phone">Telefone</label><input class="input" id="phone" name="phone" type="tel" autocomplete="tel"><span class="error-text" id="phone-error"></span></div>
        <div class="form-field"><label for="profile">Perfil</label><select class="select" id="profile" name="profile"><option value="">Selecione</option><option>Estudante ou iniciante</option><option>Profissional</option><option>Liderança</option><option>Empresa ou organização</option></select></div>
        <div class="form-field full"><label for="subject">Assunto <span aria-hidden="true">*</span></label><input class="input" id="subject" name="subject" required value="${escapeHtml(interest)}"><span class="error-text" id="subject-error"></span></div>
        <div class="form-field full"><label for="message">Mensagem <span aria-hidden="true">*</span></label><textarea class="textarea" id="message" name="message" required placeholder="Descreva seu objetivo, público, prazo ou principal desafio."></textarea><span class="error-text" id="message-error"></span></div>
        <div class="honeypot" aria-hidden="true"><label for="website">Não preencha este campo</label><input id="website" name="website" tabindex="-1" autocomplete="off"></div>
        <div class="full"><p class="form-help">Ao continuar, seu aplicativo de e-mail será aberto com a mensagem preenchida. Nenhum dado é armazenado por este site.</p><p class="form-status" id="form-status" role="status" aria-live="polite"></p><button class="btn btn-primary" type="submit">Preparar e-mail</button></div>
      </div></form></div></section>
    <section class="section section-soft"><div class="container"><div class="section-heading"><div><p class="eyebrow">Perguntas frequentes</p><h2>Antes de entrar em contato</h2></div><p>As soluções podem ser adaptadas ao formato, à carga horária e ao contexto de cada público.</p></div><div class="faq"><details><summary>Os treinamentos podem ser personalizados?</summary><p>Sim. O processo começa pelo diagnóstico de necessidades, objetivos, público e contexto para definir conteúdos, práticas, formatos e indicadores.</p></details><details><summary>A Neduc oferece atividades on-line?</summary><p>Sim. Há opções on-line ao vivo e EaD, além de formatos presenciais e híbridos conforme a proposta.</p></details><details><summary>As mentorias podem atender grupos?</summary><p>Sim. Algumas jornadas podem ser individuais, em pequenos grupos ou direcionadas a equipes de projeto e lideranças.</p></details><details><summary>Como recebo uma proposta?</summary><p>Envie o objetivo, o perfil do público, a quantidade estimada de participantes e o formato desejado. A Neduc poderá solicitar uma conversa de diagnóstico.</p></details></div></div></section>`;
  const form = document.querySelector('#contact-form');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (form.elements.website.value) return;
    const fields=['name','email','subject','message']; let valid=true;
    fields.forEach(id=>{ const field=form.elements[id], error=document.querySelector(`#${id}-error`); field.classList.remove('invalid'); error.textContent=''; if(!field.value.trim() || (id==='email'&&!/^\S+@\S+\.\S+$/.test(field.value))){valid=false;field.classList.add('invalid');error.textContent=id==='email'?'Informe um e-mail válido.':'Este campo é obrigatório.';field.setAttribute('aria-invalid','true');field.setAttribute('aria-describedby',`${id}-error`);}else{field.removeAttribute('aria-invalid');}});
    if(!valid){form.querySelector('.invalid')?.focus();document.querySelector('#form-status').textContent='Revise os campos indicados.';return;}
    const body = [`Nome: ${form.elements.name.value}`,`E-mail: ${form.elements.email.value}`,`Telefone: ${form.elements.phone.value}`,`Perfil: ${form.elements.profile.value}`,'',form.elements.message.value].join('\n');
    document.querySelector('#form-status').textContent='Abrindo seu aplicativo de e-mail…'; document.querySelector('#form-status').className='form-status success';
    location.href=`mailto:${siteConfig.email}?subject=${encodeURIComponent(`[Site Neduc] ${form.elements.subject.value}`)}&body=${encodeURIComponent(body)}`;
  });
}

function renderNotFound() {
  updateDocument('', 'Página não encontrada | Neduc');
  app.innerHTML = `${pageHero({eyebrow:'Erro 404',title:'Página não encontrada',description:'O endereço informado não corresponde a uma página disponível.'})}<section class="section"><div class="container"><a class="btn btn-primary" href="${urlFor('')}" data-route>Voltar ao início</a></div></section>`;
}

async function renderRoute({push = false, href = null} = {}) {
  if (push && href) history.pushState({}, '', href);
  const path = relativePath();
  const route = currentRoute();
  if (path && !routeMeta[path.split('/')[0]]) { renderNotFound(); return; }
  setActiveNav(route);
  if (route !== 'blog' || !new URLSearchParams(location.search).get('artigo')) window.scrollTo({top:0,behavior:'auto'});
  ({'':renderHome,'quem-somos':renderAbout,'cursos':renderCourses,'blog':renderBlog,'treinamentos':renderTrainings,'mentorias':renderMentoring,'contato':renderContact}[route] || renderHome)();
}

document.addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (!link || (!link.hasAttribute('data-route') && !link.hasAttribute('data-article')) || link.target === '_blank' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const target = new URL(link.href, location.href);
  if (target.origin !== location.origin || !target.href.startsWith(ROOT.href) || link.hasAttribute('download') || target.protocol === 'mailto:' || target.protocol === 'tel:') return;
  event.preventDefault();
  history.pushState({}, '', `${target.pathname}${target.search}${target.hash}`);
  renderRoute();
});
window.addEventListener('popstate', () => renderRoute());

(async function init() {
  try { await renderChrome(); await renderRoute(); }
  catch (error) { console.error(error); app.innerHTML='<section class="section"><div class="container"><h1>Não foi possível iniciar o site</h1><p>Execute os arquivos por um servidor HTTP local ou publique no GitHub Pages.</p></div></section>'; }
})();
