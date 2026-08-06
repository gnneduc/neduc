import { hero, sectionHeading } from '../components.js';
import { qs, qsa } from '../utils.js';

export default async function contactView({ query }) {
  const interest = query.get('interesse') || '';
  const title = query.get('titulo') || '';

  return {
    title: 'Contato',
    html: `
      ${hero({
        eyebrow: 'Contato',
        title: 'Vamos conversar sobre sua próxima jornada de aprendizagem?',
        description: 'Conte seu objetivo, desafio ou necessidade. A Neduc retornará com orientações sobre cursos, treinamentos, mentorias ou soluções personalizadas.',
        image: 'assets/images/contato.webp',
        inner: true
      })}
      <section class="section" aria-labelledby="contact-title">
        <div class="container contact-grid">
          <div>
            ${sectionHeading({
              eyebrow: 'Fale com a Neduc',
              title: '<span id="contact-title">Escolha o canal mais conveniente</span>',
              description: 'O atendimento inicial ajuda a entender contexto, objetivos, público, formato e próximos passos.'
            })}
            <div class="contact-card">
              <ul class="contact-list">
                <li><a href="mailto:contato@neduc.com.br"><span aria-hidden="true">@</span><span><strong>E-mail</strong><br>contato@neduc.com.br</span></a></li>
                <li><a href="tel:+5541996514289"><span aria-hidden="true">☎</span><span><strong>Telefone e WhatsApp</strong><br>(41) 9 9651-4289</span></a></li>
                <li><a href="https://www.instagram.com/neduc_oficial" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">◎</span><span><strong>Instagram</strong><br>@neduc_oficial</span></a></li>
                <li><a href="https://www.neduc.com.br" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">⌂</span><span><strong>Site</strong><br>www.neduc.com.br</span></a></li>
              </ul>
            </div>
          </div>
          <div>
            <form class="contact-form" novalidate data-contact-form>
              <div class="form-field">
                <label for="name">Nome completo *</label>
                <input id="name" name="name" type="text" autocomplete="name" required minlength="3">
                <p class="field-error" id="name-error"></p>
              </div>
              <div class="form-field">
                <label for="email">E-mail *</label>
                <input id="email" name="email" type="email" autocomplete="email" required>
                <p class="field-error" id="email-error"></p>
              </div>
              <div class="form-field">
                <label for="phone">Telefone</label>
                <input id="phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" placeholder="(00) 00000-0000">
                <p class="field-error" id="phone-error"></p>
              </div>
              <div class="form-field">
                <label for="profile">Você representa</label>
                <select id="profile" name="profile">
                  <option value="Pessoa">Pessoa</option>
                  <option value="Empresa">Empresa ou organização</option>
                  <option value="Instituição de ensino">Instituição de ensino</option>
                  <option value="Equipe">Equipe ou liderança</option>
                </select>
              </div>
              <div class="form-field form-field--full">
                <label for="interest">Assunto *</label>
                <select id="interest" name="interest" required>
                  <option value="">Selecione</option>
                  <option value="curso" ${interest === 'curso' ? 'selected' : ''}>Cursos</option>
                  <option value="treinamento" ${interest === 'treinamento' ? 'selected' : ''}>Treinamentos corporativos</option>
                  <option value="mentoria" ${interest === 'mentoria' ? 'selected' : ''}>Mentorias</option>
                  <option value="diagnostico" ${interest === 'diagnostico' ? 'selected' : ''}>Diagnóstico e solução personalizada</option>
                  <option value="conteudo" ${interest === 'conteudo' ? 'selected' : ''}>Conteúdo ou parceria</option>
                  <option value="outro">Outro assunto</option>
                </select>
                <p class="field-error" id="interest-error"></p>
              </div>
              <div class="form-field form-field--full">
                <label for="message">Como podemos ajudar? *</label>
                <textarea id="message" name="message" required minlength="20" placeholder="Descreva seu objetivo, público, prazo ou desafio.">${title ? `Tenho interesse em: ${title}. ` : ''}</textarea>
                <p class="field-error" id="message-error"></p>
              </div>
              <label class="form-consent">
                <input type="checkbox" name="consent" required>
                <span>Autorizo o uso destes dados para retorno sobre minha solicitação, conforme a política de privacidade. *</span>
              </label>
              <p class="field-error form-field--full" id="consent-error"></p>
              <div class="form-status" role="status" aria-live="polite"></div>
              <div class="form-field--full"><button class="button button--primary" type="submit">Preparar mensagem por e-mail</button></div>
            </form>
          </div>
        </div>
      </section>
    `,
    afterRender(scope) {
      const form = qs('[data-contact-form]', scope);
      const status = qs('.form-status', form);
      const fields = qsa('input, select, textarea', form);

      const validate = field => {
        const error = qs(`#${field.name}-error`, form);
        if (!error) return field.checkValidity();
        let message = '';
        if (field.validity.valueMissing) message = 'Este campo é obrigatório.';
        else if (field.validity.typeMismatch) message = 'Digite um formato válido.';
        else if (field.validity.tooShort) message = `Digite pelo menos ${field.minLength} caracteres.`;
        field.setAttribute('aria-invalid', String(Boolean(message)));
        if (message) field.setAttribute('aria-describedby', error.id); else field.removeAttribute('aria-describedby');
        error.textContent = message;
        return !message;
      };

      fields.forEach(field => field.addEventListener('blur', () => validate(field)));
      form.addEventListener('submit', event => {
        event.preventDefault();
        const validFields = fields.map(validate).every(Boolean);
        const consent = form.elements.consent;
        const consentError = qs('#consent-error', form);
        if (!consent.checked) consentError.textContent = 'Você precisa autorizar o retorno sobre a solicitação.'; else consentError.textContent = '';

        if (!validFields || !consent.checked) {
          status.className = 'form-status form-status--error';
          status.textContent = 'Revise os campos indicados antes de continuar.';
          form.querySelector('[aria-invalid="true"]')?.focus();
          return;
        }

        const data = new FormData(form);
        const subject = encodeURIComponent(`Contato pelo site Neduc — ${data.get('interest')}`);
        const body = encodeURIComponent(
          `Nome: ${data.get('name')}\nE-mail: ${data.get('email')}\nTelefone: ${data.get('phone') || 'Não informado'}\nPerfil: ${data.get('profile')}\nInteresse: ${data.get('interest')}\n\nMensagem:\n${data.get('message')}`
        );
        status.className = 'form-status form-status--success';
        status.textContent = 'Seu aplicativo de e-mail será aberto com a mensagem preenchida. Revise e envie para concluir.';
        window.location.href = `mailto:contato@neduc.com.br?subject=${subject}&body=${body}`;
      });
    }
  };
}
