import { createCatalogView } from './catalog-view.js';

export default function coursesView(context) {
  return createCatalogView({
    dataPath: 'data/courses.json',
    type: 'curso',
    pageTitle: 'Cursos',
    eyebrow: 'Cursos Neduc',
    title: 'Aprenda competências atuais com prática e acompanhamento.',
    description: 'Jornadas de aprendizagem para desenvolver conhecimentos técnicos, ampliar oportunidades profissionais e aplicar tecnologia, inteligência artificial, dados, gestão e inovação em desafios reais.',
    heroImage: 'assets/images/cursos.webp',
    primaryLabel: 'Ver catálogo',
    catalogEyebrow: 'Catálogo de cursos',
    catalogTitle: 'Encontre o próximo passo da sua jornada',
    catalogDescription: 'Use os filtros para localizar cursos por tema e formato. Os conteúdos podem ser oferecidos para turmas abertas ou grupos fechados.',
    benefitsEyebrow: 'Experiência de aprendizagem',
    benefitsTitle: 'Conteúdo que não termina na teoria',
    benefitsDescription: 'Os cursos foram organizados para favorecer compreensão, prática, feedback e aplicação profissional.',
    benefits: [
      'Conteúdo estruturado em objetivos de aprendizagem claros.',
      'Atividades práticas, casos e projetos contextualizados.',
      'Materiais de apoio e referências para estudo contínuo.',
      'Acompanhamento e feedback ao longo da jornada.',
      'Certificado de participação ou conclusão, conforme a oferta.'
    ],
    benefitsImage: 'assets/images/aprendizagem-digital.webp',
    benefitsImageAlt: 'Pessoa estudando tecnologia em uma plataforma digital',
    faq: [
      { question: 'Os cursos são presenciais ou on-line?', answer: 'A Neduc trabalha com formatos presencial, on-line ao vivo e EaD. O formato disponível aparece em cada curso e também pode ser adaptado para turmas fechadas.' },
      { question: 'Preciso ter experiência prévia?', answer: 'Cada curso informa o nível recomendado. Há opções introdutórias, intermediárias e avançadas, além de trilhas que organizam a progressão entre níveis.' },
      { question: 'Empresas podem contratar uma turma exclusiva?', answer: 'Sim. Conteúdo, exemplos, duração e atividades podem ser ajustados ao contexto da organização e às competências prioritárias.' },
      { question: 'Como recebo informações sobre novas turmas?', answer: 'Use o botão de interesse em cada curso ou o formulário de contato. A equipe retornará com calendário, investimento e condições da próxima oferta.' }
    ],
    ctaTitle: 'Não encontrou exatamente o que procura?',
    ctaDescription: 'A Neduc pode organizar uma trilha personalizada a partir dos seus objetivos, conhecimentos prévios e contexto profissional.',
    ctaLabel: 'Solicitar uma trilha'
  }, context);
}
