"use strict";

const CAMINHO_CONTEUDO = "data/site.json";
let conteudoSite = null;

function obterValor(caminho) {
  if (!conteudoSite || !caminho) return undefined;
  return caminho.split(".").reduce((valor, chave) => valor?.[chave], conteudoSite);
}

function aplicarConteudo(raiz = document) {
  const elementos = [];

  if (raiz.nodeType === Node.ELEMENT_NODE && raiz.matches?.("[data-content-text]")) {
    elementos.push(raiz);
  }
  raiz.querySelectorAll?.("[data-content-text]").forEach((elemento) => elementos.push(elemento));

  elementos.forEach((elemento) => {
    const valor = obterValor(elemento.dataset.contentText);
    if (valor !== undefined && valor !== null) elemento.textContent = valor;
  });

  const comPlaceholder = [];
  if (raiz.nodeType === Node.ELEMENT_NODE && raiz.matches?.("[data-content-placeholder]")) {
    comPlaceholder.push(raiz);
  }
  raiz.querySelectorAll?.("[data-content-placeholder]").forEach((elemento) => comPlaceholder.push(elemento));

  comPlaceholder.forEach((elemento) => {
    const valor = obterValor(elemento.dataset.contentPlaceholder);
    if (valor !== undefined && valor !== null) elemento.setAttribute("placeholder", valor);
  });
}

async function carregarConteudo() {
  try {
    const resposta = await fetch(CAMINHO_CONTEUDO, { cache: "no-cache" });
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);

    conteudoSite = await resposta.json();
    aplicarConteudo(document);
  } catch (erro) {
    console.error("Não foi possível carregar data/site.json:", erro);
  }
}

// O app.js insere as páginas da SPA dinamicamente no <main>.
// O observer aplica os textos do JSON assim que novos elementos entram no DOM.
const observador = new MutationObserver((mutacoes) => {
  if (!conteudoSite) return;

  for (const mutacao of mutacoes) {
    for (const no of mutacao.addedNodes) {
      if (no.nodeType === Node.ELEMENT_NODE) aplicarConteudo(no);
    }
  }
});

observador.observe(document.documentElement, { childList: true, subtree: true });
carregarConteudo();
