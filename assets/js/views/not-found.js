export default async function notFoundView() {
  return {
    title: 'Página não encontrada',
    html: `<section class="error-page"><div><span class="error-code">404</span><h1>Página não encontrada</h1><p>O endereço pode estar incorreto ou o conteúdo foi movido.</p><div class="button-row" style="justify-content:center"><a class="button button--primary" href="#/">Voltar ao início</a><a class="button button--outline" href="#/contato">Falar com a Neduc</a></div></div></section>`
  };
}
