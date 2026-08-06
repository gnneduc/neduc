import { Router } from './router.js';
import { initAccessibility } from './accessibility.js';
import { qs, qsa } from './utils.js';
import homeView from './views/home.js';
import aboutView from './views/about.js';
import coursesView from './views/courses.js';
import trainingsView from './views/trainings.js';
import mentorshipsView from './views/mentorships.js';
import blogView from './views/blog.js';
import blogPostView from './views/blog-post.js';
import contactView from './views/contact.js';
import privacyView from './views/privacy.js';
import notFoundView from './views/not-found.js';

const app = qs('#app');
const nav = qs('.main-nav');
const menuToggle = qs('.menu-toggle');

function closeMenu() {
  nav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}

menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('is-open', !open);
  document.body.classList.toggle('menu-open', !open);
});

nav.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 1040) closeMenu();
});

const router = new Router({
  outlet: app,
  routes: {
    '/': homeView,
    '/quem-somos': aboutView,
    '/cursos': coursesView,
    '/treinamentos': trainingsView,
    '/mentorias': mentorshipsView,
    '/blog': blogView,
    '/blog/:slug': blogPostView,
    '/contato': contactView,
    '/privacidade': privacyView,
    '*': notFoundView
  },
  onAfterRender() {
    closeMenu();
  }
});

initAccessibility();
router.start();

qs('#current-year').textContent = new Date().getFullYear();

qsa('[data-newsletter-form]').forEach(form => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const message = form.querySelector('.form-message');
    if (!input.checkValidity()) {
      message.textContent = 'Digite um e-mail válido.';
      input.focus();
      return;
    }
    message.textContent = 'Cadastro registrado nesta demonstração. Integre o formulário ao seu serviço de e-mail marketing.';
    form.reset();
  });
});

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
}
