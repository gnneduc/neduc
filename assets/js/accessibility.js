import { qs, qsa } from './utils.js';

const storageKey = 'neduc-accessibility';
const defaultSettings = { fontScale: 1, contrast: false, reduceMotion: false };

function readSettings() {
  try { return { ...defaultSettings, ...JSON.parse(localStorage.getItem(storageKey) || '{}') }; }
  catch { return { ...defaultSettings }; }
}

function saveSettings(settings) {
  localStorage.setItem(storageKey, JSON.stringify(settings));
}

function applySettings(settings) {
  document.documentElement.style.setProperty('--font-scale', String(settings.fontScale));
  document.documentElement.dataset.theme = settings.contrast ? 'high-contrast' : 'default';
  document.documentElement.dataset.reduceMotion = String(settings.reduceMotion);
  qs('[data-contrast]')?.setAttribute('aria-pressed', String(settings.contrast));
  qs('[data-motion]')?.setAttribute('aria-pressed', String(settings.reduceMotion));
}

export function initAccessibility() {
  let settings = readSettings();
  let lastFocused = null;
  const panel = qs('.accessibility-panel');
  const backdrop = qs('[data-panel-backdrop]');

  const open = () => {
    lastFocused = document.activeElement;
    panel.hidden = false;
    backdrop.hidden = false;
    document.body.classList.add('panel-open');
    qs('[data-close-accessibility]')?.focus();
  };
  const close = () => {
    panel.hidden = true;
    backdrop.hidden = true;
    document.body.classList.remove('panel-open');
    lastFocused?.focus();
  };

  applySettings(settings);
  qsa('[data-open-accessibility]').forEach(button => button.addEventListener('click', open));
  qs('[data-close-accessibility]')?.addEventListener('click', close);
  backdrop?.addEventListener('click', close);

  qs('[data-font-increase]')?.addEventListener('click', () => {
    settings.fontScale = Math.min(1.25, +(settings.fontScale + .1).toFixed(2));
    applySettings(settings); saveSettings(settings);
  });
  qs('[data-font-decrease]')?.addEventListener('click', () => {
    settings.fontScale = Math.max(.9, +(settings.fontScale - .1).toFixed(2));
    applySettings(settings); saveSettings(settings);
  });
  qs('[data-font-reset]')?.addEventListener('click', () => {
    settings.fontScale = 1;
    applySettings(settings); saveSettings(settings);
  });
  qs('[data-contrast]')?.addEventListener('click', () => {
    settings.contrast = !settings.contrast;
    applySettings(settings); saveSettings(settings);
  });
  qs('[data-motion]')?.addEventListener('click', () => {
    settings.reduceMotion = !settings.reduceMotion;
    applySettings(settings); saveSettings(settings);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) close();
    if (event.key === 'Tab' && !panel.hidden) {
      const focusables = qsa('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])', panel).filter(el => !el.disabled && !el.hidden);
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
}
