import { escapeHTML, icon } from './utils.js';

export function hero({ eyebrow, title, description, image, primary, secondary, inner = false, meta = [] }) {
  return `
    <section class="hero${inner ? ' hero--inner' : ''}" style="--hero-image:url('${escapeHTML(image)}')">
      <div class="container hero__content" data-reveal>
        ${eyebrow ? `<span class="eyebrow">${escapeHTML(eyebrow)}</span>` : ''}
        <h1>${title}</h1>
        <p>${description}</p>
        ${(primary || secondary) ? `<div class="button-row">
          ${primary ? `<a class="button button--primary" href="${primary.href}">${escapeHTML(primary.label)} ${icon('arrow')}</a>` : ''}
          ${secondary ? `<a class="button button--ghost" href="${secondary.href}">${escapeHTML(secondary.label)}</a>` : ''}
        </div>` : ''}
        ${meta.length ? `<div class="hero__meta">${meta.map(item => `<span>${item}</span>`).join('')}</div>` : ''}
      </div>
    </section>`;
}

export function sectionHeading({ eyebrow = '', title, description = '', centered = false }) {
  return `<div class="section-heading${centered ? ' section-heading--center' : ''}">
    ${eyebrow ? `<span class="eyebrow">${escapeHTML(eyebrow)}</span>` : ''}
    <h2>${title}</h2>
    ${description ? `<p>${description}</p>` : ''}
  </div>`;
}

export function solutionCard({ iconText, title, description, href, linkLabel = 'Saiba mais' }) {
  return `<article class="card card--accent">
    <span class="card__icon" aria-hidden="true">${iconText}</span>
    <h3>${escapeHTML(title)}</h3>
    <p>${escapeHTML(description)}</p>
    <a class="card__link" href="${href}">${escapeHTML(linkLabel)}</a>
  </article>`;
}

export function cta({ title, description, label = 'Fale com a Neduc', href = '#/contato', secondaryLabel = '', secondaryHref = '' }) {
  return `<div class="cta">
    <div class="cta__inner">
      <div><h2>${title}</h2><p>${description}</p></div>
      <div class="button-row">
        <a class="button button--primary" href="${href}">${escapeHTML(label)} ${icon('arrow')}</a>
        ${secondaryLabel ? `<a class="button button--ghost" href="${secondaryHref}">${escapeHTML(secondaryLabel)}</a>` : ''}
      </div>
    </div>
  </div>`;
}

export function catalogCard(item, type = 'curso') {
  const price = item.investment || item.price || 'Sob consulta';
  return `<article class="card catalog-card" data-item-card>
    <div class="catalog-card__image">
      <img src="${escapeHTML(item.image)}" alt="" width="640" height="360" loading="lazy">
      <span class="badge ${item.status === 'Inscrições abertas' ? 'badge--green' : ''}">${escapeHTML(item.status || 'Disponível')}</span>
    </div>
    <div class="catalog-card__body">
      <div class="catalog-card__meta">
        <span class="badge">${escapeHTML(item.category)}</span>
        <span class="badge badge--red">${escapeHTML(item.level || item.audience || 'Personalizado')}</span>
      </div>
      <h3>${escapeHTML(item.title)}</h3>
      <p>${escapeHTML(item.summary)}</p>
      <div class="catalog-card__details">
        <span>${icon('clock')} ${escapeHTML(item.duration)}</span>
        <span>${icon('monitor')} ${escapeHTML(item.format)}</span>
      </div>
      <div class="catalog-card__footer">
        <span class="catalog-card__price">${escapeHTML(price)}</span>
        <a class="button button--small button--secondary" href="#/contato?interesse=${encodeURIComponent(type)}&titulo=${encodeURIComponent(item.title)}">Tenho interesse</a>
      </div>
    </div>
  </article>`;
}

export function breadcrumb(items) {
  return `<nav class="breadcrumb container" aria-label="Trilha de navegação"><ol>${items.map((item, index) => `<li>${index === items.length - 1 ? `<span aria-current="page">${escapeHTML(item.label)}</span>` : `<a href="${item.href}">${escapeHTML(item.label)}</a>`}</li>`).join('')}</ol></nav>`;
}

export function accordion(items) {
  return `<div class="accordion">${items.map((item, index) => `<section class="accordion__item">
    <h3><button class="accordion__button" type="button" aria-expanded="false" aria-controls="faq-panel-${index}" id="faq-button-${index}">${escapeHTML(item.question)}</button></h3>
    <div class="accordion__panel" id="faq-panel-${index}" role="region" aria-labelledby="faq-button-${index}" hidden><p>${item.answer}</p></div>
  </section>`).join('')}</div>`;
}

export function bindAccordions(scope = document) {
  scope.querySelectorAll('.accordion__button').forEach(button => {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
      const panel = document.getElementById(button.getAttribute('aria-controls'));
      if (panel) panel.hidden = expanded;
    });
  });
}
