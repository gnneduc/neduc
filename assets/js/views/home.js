import { getJSON } from '../data-service.js';
import { hero, sectionHeading, solutionCard, cta, catalogCard } from '../components.js';

export default async function homeView() {
  const [courses, posts] = await Promise.all([
    getJSON('data/courses.json'),
    getJSON('blog/index.json')
  ]);

  const featuredCourses = courses.filter(item => item.featured).slice(0, 3);
  const latestPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);

  return {
    title: 'Início',
    html: `
      ${hero({
        eyebrow: 'Educação, tecnologia e desenvolvimento',
        title: 'Competências para transformar desafios em resultados.',
        description: 'A Neduc desenvolve pessoas, equipes e organizações por meio de cursos, treinamentos, mentorias e experiências práticas em tecnologia, inteligência artificial, dados, gestão e inovação.',
        image: 'assets/images/hero-equipe.webp',
        primary: { label: 'Explorar soluções', href: '#/cursos' },
        secondary: { label: 'Conhecer a Neduc', href: '#/quem-somos' },
        meta: ['✓ Aprendizagem aplicada', '✓ Mentoria próxima', '✓ Soluções sob medida']
      })}

      <section class="section section--compact" aria-labelledby="home-audiences">
        <div class="container">
          ${sectionHeading({
            eyebrow: 'Para cada momento da jornada',
            title: '<span id="home-audiences">Aprendizagem que começa no contexto de quem aprende</span>',
            description: 'Caminhos claros para iniciantes, profissionais, líderes, equipes e organizações.'
          })}
          <div class="grid grid--4">
            <article class="card"><span class="card__icon" aria-hidden="true">01</span><h3>Estudantes e iniciantes</h3><p>Uma base prática para transformar curiosidade em competências aplicáveis em tecnologia, programação, IA e inovação.</p></article>
            <article class="card"><span class="card__icon" aria-hidden="true">02</span><h3>Profissionais em evolução</h3><p>Atualização de conhecimentos, ampliação de oportunidades e uso inteligente de novas tecnologias no trabalho.</p></article>
            <article class="card"><span class="card__icon" aria-hidden="true">03</span><h3>Equipes e lideranças</h3><p>Desenvolvimento técnico, estratégico e comportamental conectado aos desafios reais do cotidiano.</p></article>
            <article class="card"><span class="card__icon" aria-hidden="true">04</span><h3>Empresas e organizações</h3><p>Soluções personalizadas para capacitar pessoas, impulsionar inovação e construir uma cultura de aprendizagem contínua.</p></article>
          </div>
        </div>
      </section>

      <section class="section section--alt" aria-labelledby="home-solutions">
        <div class="container">
          ${sectionHeading({
            eyebrow: 'Soluções Neduc',
            title: '<span id="home-solutions">Conhecimento que se transforma em prática</span>',
            description: 'Formatos flexíveis e experiências de aprendizagem desenhadas para gerar autonomia, produtividade e evolução contínua.',
            centered: true
          })}
          <div class="grid grid--3">
            ${solutionCard({ iconText: 'C', title: 'Cursos', description: 'Jornadas estruturadas que combinam teoria, prática e acompanhamento para desenvolver competências atuais.', href: '#/cursos' })}
            ${solutionCard({ iconText: 'T', title: 'Treinamentos', description: 'Capacitações personalizadas para equipes, lideranças e organizações, com aplicação imediata no trabalho.', href: '#/treinamentos' })}
            ${solutionCard({ iconText: 'M', title: 'Mentorias', description: 'Orientação individual ou em grupo, com metas, plano de ação, feedback e acompanhamento próximo.', href: '#/mentorias' })}
          </div>
        </div>
      </section>

      <section class="section" aria-labelledby="home-value">
        <div class="container split split--wide">
          <div>
            ${sectionHeading({
              eyebrow: 'Como geramos valor',
              title: '<span id="home-value">Aprender, aplicar, medir e evoluir</span>',
              description: 'A experiência Neduc foi pensada para aproximar o conteúdo dos desafios que pessoas e organizações realmente enfrentam.'
            })}
            <ul class="icon-list">
              <li><span class="icon-list__icon" aria-hidden="true">✓</span><div><strong>Aprendizagem aplicada</strong>Casos reais, atividades contextualizadas e projetos que transformam conhecimento em competência.</div></li>
              <li><span class="icon-list__icon" aria-hidden="true">✓</span><div><strong>Mentoria próxima</strong>Orientação individualizada, feedback construtivo e um plano de ação claro para avançar com segurança.</div></li>
              <li><span class="icon-list__icon" aria-hidden="true">✓</span><div><strong>Soluções sob medida</strong>Diagnóstico de necessidades e desenho de jornadas alinhadas ao contexto e às prioridades de cada público.</div></li>
              <li><span class="icon-list__icon" aria-hidden="true">✓</span><div><strong>Resultados mensuráveis</strong>Objetivos e indicadores definidos desde o início para acompanhar evolução, aplicação e impacto.</div></li>
            </ul>
            <div class="button-row"><a class="button button--outline" href="#/quem-somos">Conheça nossa metodologia</a></div>
          </div>
          <figure class="media-frame">
            <img src="assets/images/aprendizagem-aplicada.webp" alt="Profissionais colaborando em uma atividade prática com recursos digitais" width="840" height="560" loading="lazy">
            <figcaption class="media-frame__badge"><strong>Prática com propósito</strong>Conteúdo, acompanhamento e aplicação no mesmo percurso.</figcaption>
          </figure>
        </div>
      </section>

      <section class="section section--pattern" aria-labelledby="home-courses">
        <div class="container">
          ${sectionHeading({
            eyebrow: 'Destaques',
            title: '<span id="home-courses">Cursos para competências que o mercado exige</span>',
            description: 'Conteúdos atuais, formatos flexíveis e projetos orientados para aplicação profissional.'
          })}
          <div class="catalog-grid">
            ${featuredCourses.map(item => catalogCard(item, 'curso')).join('')}
          </div>
          <div class="button-row"><a class="button button--secondary" href="#/cursos">Ver todos os cursos</a></div>
        </div>
      </section>

      <section class="section section--navy" aria-labelledby="home-method">
        <div class="container">
          ${sectionHeading({
            eyebrow: 'Metodologia de ensino',
            title: '<span id="home-method">Uma jornada em cinco etapas</span>',
            description: 'Da compreensão da necessidade à avaliação dos resultados, cada etapa mantém o aprendizado conectado ao objetivo.',
            centered: true
          })}
          <div class="process">
            <article class="process__item"><h3>Diagnosticar</h3><p>Identificar necessidades, objetivos e desafios.</p></article>
            <article class="process__item"><h3>Planejar</h3><p>Definir competências, conteúdos, trilha e metas.</p></article>
            <article class="process__item"><h3>Aprender e aplicar</h3><p>Combinar teoria, prática, casos e projetos.</p></article>
            <article class="process__item"><h3>Acompanhar e ajustar</h3><p>Orientar, oferecer feedback e ajustar a jornada.</p></article>
            <article class="process__item"><h3>Medir e evoluir</h3><p>Avaliar aprendizagem, aplicação e resultados.</p></article>
          </div>
        </div>
      </section>

      <section class="section" aria-labelledby="home-blog">
        <div class="container">
          ${sectionHeading({
            eyebrow: 'Conteúdos',
            title: '<span id="home-blog">Ideias para aprender e aplicar</span>',
            description: 'Artigos sobre inteligência artificial, tecnologia, produtividade, educação e desenvolvimento de competências.'
          })}
          <div class="grid grid--3">
            ${latestPosts.map(post => `<article class="card card--image">
              <img src="${post.image}" alt="" width="640" height="360" loading="lazy">
              <div class="card__body">
                <span class="badge">${post.category}</span>
                <h3>${post.title}</h3>
                <p>${post.description}</p>
                <a class="card__link" href="#/blog/${post.slug}">Ler artigo</a>
              </div>
            </article>`).join('')}
          </div>
        </div>
      </section>

      <section class="section section--compact"><div class="container">
        ${cta({
          title: 'Qual competência sua equipe precisa desenvolver agora?',
          description: 'Converse com a Neduc para desenhar uma trilha, treinamento ou mentoria alinhada aos desafios da sua organização.',
          label: 'Solicitar diagnóstico',
          href: '#/contato?interesse=diagnostico',
          secondaryLabel: 'Ver treinamentos',
          secondaryHref: '#/treinamentos'
        })}
      </div></section>
    `
  };
}
