import { createCatalogView } from './catalog-view.js';

export default function mentorshipsView(context) {
  return createCatalogView({
    dataPath: 'data/mentorships.json',
    type: 'mentoria',
    pageTitle: 'Mentorias',
    eyebrow: 'Mentorias Neduc',
    title: 'Orientação próxima para avançar com clareza e autonomia.',
    description: 'Acompanhamento individual ou em grupo, com diagnóstico, metas, plano de ação, encontros orientados, feedback e revisão de resultados.',
    heroImage: 'assets/images/mentorias.webp',
    primaryLabel: 'Conhecer mentorias',
    catalogEyebrow: 'Programas de mentoria',
    catalogTitle: 'Escolha o acompanhamento que combina com seu objetivo',
    catalogDescription: 'Os programas podem apoiar carreira, liderança, projetos, adoção de inteligência artificial e desenvolvimento técnico.',
    benefitsEyebrow: 'Acompanhamento orientado',
    benefitsTitle: 'Você não precisa organizar toda a jornada sozinho',
    benefitsDescription: 'A mentoria cria um espaço estruturado para analisar contexto, tomar decisões, aplicar ações e aprender com os resultados.',
    benefits: [
      'Diagnóstico inicial e definição de objetivo prioritário.',
      'Plano de ação com etapas, prazos e critérios de progresso.',
      'Encontros individuais ou em pequenos grupos.',
      'Feedback construtivo sobre decisões, práticas e entregas.',
      'Revisão de avanços e ajustes ao longo do percurso.'
    ],
    benefitsImage: 'assets/images/mentoria-proxima.webp',
    benefitsImageAlt: 'Profissionais em uma conversa individual de mentoria',
    faq: [
      { question: 'Qual é a diferença entre curso e mentoria?', answer: 'O curso segue uma estrutura de conteúdos e atividades. A mentoria parte de um objetivo específico e organiza orientação, decisões e ações conforme o contexto da pessoa ou grupo.' },
      { question: 'As mentorias são individuais ou coletivas?', answer: 'Há opções individuais e em grupo. O formato depende do programa, da complexidade do objetivo e do nível de personalização necessário.' },
      { question: 'Quanto tempo dura uma mentoria?', answer: 'Os programas variam de encontros pontuais a jornadas de vários meses. A duração é informada em cada opção e pode ser ajustada em propostas personalizadas.' },
      { question: 'Como sei qual mentoria escolher?', answer: 'No contato inicial, a Neduc identifica seu objetivo, momento profissional e disponibilidade para recomendar o programa mais adequado.' }
    ],
    ctaTitle: 'Pronto para transformar intenção em plano de ação?',
    ctaDescription: 'Conte seu objetivo e receba uma orientação inicial sobre o programa de mentoria mais adequado.',
    ctaLabel: 'Solicitar orientação'
  }, context);
}
