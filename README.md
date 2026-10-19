# Neduc — conteúdo textual em `data/site.json`

Esta versão retira dos HTMLs o conteúdo editorial visível e o carrega por JavaScript a partir de `data/site.json`.

## Arquivos

- `index.html`: arquivo principal convertido.
- `pages/*.html`: páginas da SPA convertidas.
- `data/site.json`: textos centralizados por página.
- `assets/js/content-loader.js`: carrega o JSON e preenche o DOM.

O `content-loader.js` usa `MutationObserver`, portanto também preenche automaticamente as páginas que o `app.js` inserir dinamicamente no `<main>`. Não é necessário alterar o roteador existente.

## Mantidos no HTML propositalmente

Para não prejudicar funcionamento, SEO e acessibilidade, continuam estáticos: `data-page-description`, `<title>`, `<meta>`, JSON-LD, `alt`, `aria-label` e `<noscript>`.

## Publicação

Mantenha seu `assets/js/app.js` atual. Copie `content-loader.js`, `site.json`, o novo `index.html` e substitua as páginas correspondentes. Em GitHub Pages, `fetch("data/site.json")` funciona normalmente. Para teste local, use um servidor HTTP; abrir por `file://` pode bloquear `fetch()`.
