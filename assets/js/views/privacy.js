import { breadcrumb } from '../components.js';

export default async function privacyView() {
  return {
    title: 'Privacidade',
    html: `
      ${breadcrumb([{ label: 'Início', href: '#/' }, { label: 'Privacidade' }])}
      <section class="section"><div class="article-shell">
        <span class="eyebrow">Privacidade</span>
        <h1>Política de privacidade</h1>
        <p class="lead">Modelo inicial para um site institucional estático. Antes da publicação definitiva, revise este texto conforme os processos reais da Neduc e a orientação jurídica aplicável.</p>
        <div class="article-content">
          <h2>Dados informados pelo visitante</h2>
          <p>O formulário de contato solicita nome, e-mail, telefone opcional, perfil, assunto e mensagem. Nesta versão estática, o formulário prepara uma mensagem no aplicativo de e-mail do próprio visitante; os dados não são armazenados pelo site.</p>
          <h2>Finalidade</h2>
          <p>Os dados enviados por e-mail devem ser utilizados para responder solicitações, apresentar informações sobre cursos, treinamentos e mentorias e dar continuidade ao relacionamento solicitado pelo titular.</p>
          <h2>Cookies e armazenamento local</h2>
          <p>O site usa armazenamento local apenas para manter preferências de acessibilidade. A versão entregue não inclui ferramentas de publicidade, rastreamento ou análise de terceiros.</p>
          <h2>Direitos do titular</h2>
          <p>Solicitações relacionadas a acesso, correção, exclusão ou esclarecimentos sobre dados pessoais podem ser encaminhadas para <a href="mailto:contato@neduc.com.br">contato@neduc.com.br</a>.</p>
          <h2>Atualizações</h2>
          <p>Esta política deve ser atualizada sempre que houver mudanças nos formulários, ferramentas, integrações, finalidades ou práticas de tratamento de dados.</p>
        </div>
      </div></section>
    `
  };
}
