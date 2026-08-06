import { hero, sectionHeading, cta } from '../components.js';

export default async function aboutView() {
  return {
    title: 'Quem somos',
    html: `
      ${hero({
        eyebrow: 'Quem somos',
        title: 'Educação para desenvolver competências que fazem diferença.',
        description: 'A Neduc conecta conhecimento, prática e acompanhamento para preparar pessoas e organizações para os desafios e as oportunidades do futuro do trabalho.',
        image: 'assets/images/quem-somos.webp',
        primary: { label: 'Conhecer as soluções', href: '#/cursos' },
        inner: true
      })}

      <section class="section" aria-labelledby="about-essence">
        <div class="container split">
          <figure class="media-frame">
            <img src="assets/images/equipe-colaboracao.webp" alt="Equipe reunida em um ambiente de aprendizagem e colaboração" width="840" height="560">
          </figure>
          <div>
            ${sectionHeading({
              eyebrow: 'Nossa essência',
              title: '<span id="about-essence">Conhecimento aplicado para pessoas e organizações</span>',
              description: 'Desenvolvemos competências por meio de experiências educacionais práticas, próximas e alinhadas às demandas do mundo profissional.'
            })}
            <p>A Neduc atua nas áreas de educação, tecnologia e consultoria, reunindo cursos, treinamentos, mentorias, workshops, bootcamps, hackathons e masterclasses.</p>
            <p>Nossa proposta parte de uma ideia simples: aprender ganha valor quando o conteúdo pode ser compreendido, experimentado, aplicado e acompanhado.</p>
          </div>
        </div>
      </section>

      <section class="section section--alt" aria-labelledby="about-pillars">
        <div class="container">
          ${sectionHeading({ eyebrow: 'Direcionadores', title: '<span id="about-pillars">Missão, visão e valores</span>', centered: true })}
          <div class="grid grid--3">
            <article class="card card--accent"><span class="card__icon" aria-hidden="true">M</span><h3>Missão</h3><p>Promover o desenvolvimento de pessoas e organizações por meio de mentorias, treinamentos e soluções educacionais práticas em tecnologia, inteligência artificial, gestão e inovação.</p></article>
            <article class="card card--accent"><span class="card__icon" aria-hidden="true">V</span><h3>Visão</h3><p>Ser referência em treinamentos, mentorias e capacitação profissional, preparando pessoas, equipes e organizações para o futuro do trabalho.</p></article>
            <article class="card card--accent"><span class="card__icon" aria-hidden="true">+</span><h3>Valores</h3><p>Ética, inovação, inclusão, colaboração, qualidade, aprendizado contínuo e compromisso com resultados reais.</p></article>
          </div>
        </div>
      </section>

      <section class="section" aria-labelledby="about-areas">
        <div class="container">
          ${sectionHeading({
            eyebrow: 'Áreas de atuação',
            title: '<span id="about-areas">Três frentes, um mesmo compromisso</span>',
            description: 'Transformar conhecimento em competências aplicáveis e resultados sustentáveis.'
          })}
          <div class="grid grid--3">
            <article class="card"><span class="card__icon" aria-hidden="true">E</span><h3>Educação</h3><p>Cursos, treinamentos, trilhas e mentorias para apoiar o desenvolvimento contínuo de pessoas e equipes.</p></article>
            <article class="card"><span class="card__icon" aria-hidden="true">T</span><h3>Tecnologia</h3><p>Inteligência artificial, programação, dados e automação para melhorar processos, decisões e produtividade.</p></article>
            <article class="card"><span class="card__icon" aria-hidden="true">C</span><h3>Consultoria</h3><p>Diagnóstico e implementação de soluções educacionais, tecnológicas e inovadoras para organizações.</p></article>
          </div>
        </div>
      </section>

      <section class="section section--navy" aria-labelledby="about-challenges">
        <div class="container split">
          <div>
            ${sectionHeading({
              eyebrow: 'Desafios que ajudamos a superar',
              title: '<span id="about-challenges">Da lacuna de competência à aplicação real</span>',
              description: 'Nossas soluções são desenhadas para contextos em que conhecimento, mudança e resultados precisam caminhar juntos.'
            })}
            <ul class="check-list">
              <li>Lacunas de competências técnicas, digitais e comportamentais.</li>
              <li>Adoção prática e responsável da inteligência artificial.</li>
              <li>Baixa produtividade e processos pouco eficientes.</li>
              <li>Necessidade de atualização profissional contínua.</li>
              <li>Desenvolvimento de lideranças mais preparadas para mudanças.</li>
            </ul>
          </div>
          <figure class="media-frame">
            <img src="assets/images/lideranca-inovacao.webp" alt="Liderança conduzindo uma conversa sobre inovação com a equipe" width="840" height="560" loading="lazy">
          </figure>
        </div>
      </section>

      <section class="section" aria-labelledby="about-formats">
        <div class="container">
          ${sectionHeading({
            eyebrow: 'Formatos de aprendizagem',
            title: '<span id="about-formats">Flexibilidade sem perder proximidade</span>',
            description: 'O formato é escolhido conforme o público, os objetivos, a disponibilidade e o nível de interação necessário.'
          })}
          <div class="grid grid--3">
            <article class="card"><h3>Presencial</h3><p>Encontros no local da empresa ou em espaço definido, com interação direta, prática e colaboração entre participantes.</p></article>
            <article class="card"><h3>On-line ao vivo</h3><p>Aulas em tempo real, com professor, participação ativa, espaço para dúvidas e atividades conduzidas ao vivo.</p></article>
            <article class="card"><h3>EaD</h3><p>Conteúdos disponíveis em ambiente virtual, com flexibilidade de horário, autonomia e aprendizagem no próprio ritmo.</p></article>
          </div>
        </div>
      </section>

      <section class="section section--compact"><div class="container">
        ${cta({
          title: 'Vamos construir uma jornada de aprendizagem relevante?',
          description: 'Conte o seu desafio. A Neduc ajuda a diagnosticar necessidades, definir competências e organizar a melhor solução.',
          label: 'Conversar com a Neduc',
          href: '#/contato'
        })}
      </div></section>
    `
  };
}
