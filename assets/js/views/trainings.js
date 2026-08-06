import { createCatalogView } from './catalog-view.js';

export default function trainingsView(context) {
  return createCatalogView({
    dataPath: 'data/trainings.json',
    type: 'treinamento',
    pageTitle: 'Treinamentos',
    eyebrow: 'Treinamentos para organizações',
    title: 'Capacitação conectada aos desafios do negócio.',
    description: 'Treinamentos corporativos, workshops, bootcamps, hackathons e masterclasses para fortalecer competências técnicas, comportamentais e estratégicas.',
    heroImage: 'assets/images/treinamentos.webp',
    primaryLabel: 'Explorar treinamentos',
    catalogEyebrow: 'Soluções corporativas',
    catalogTitle: 'Escolha um tema ou construa uma solução sob medida',
    catalogDescription: 'As propostas são ajustadas conforme o diagnóstico, o perfil dos participantes, os resultados esperados e o contexto da organização.',
    benefitsEyebrow: 'Desenho sob medida',
    benefitsTitle: 'Do diagnóstico à aplicação no trabalho',
    benefitsDescription: 'Cada treinamento parte do desafio organizacional e termina com orientações para continuidade e medição de resultados.',
    benefits: [
      'Diagnóstico de necessidades e definição de objetivos.',
      'Conteúdo contextualizado para o setor e a realidade da equipe.',
      'Metodologias ativas, desafios e atividades colaborativas.',
      'Opções presencial, on-line ao vivo e híbrida.',
      'Avaliação de aprendizagem e recomendações de continuidade.'
    ],
    benefitsImage: 'assets/images/treinamento-corporativo.webp',
    benefitsImageAlt: 'Profissional conduzindo treinamento corporativo para uma equipe',
    faq: [
      { question: 'Como funciona um treinamento in company?', answer: 'A Neduc realiza uma conversa de diagnóstico, define objetivos, público, formato e carga horária, apresenta a proposta e contextualiza o conteúdo para a organização.' },
      { question: 'É possível personalizar exemplos e atividades?', answer: 'Sim. Exemplos, estudos de caso, exercícios e projetos podem refletir processos, desafios e situações reais da empresa, respeitando a confidencialidade.' },
      { question: 'Qual é o tamanho recomendado da turma?', answer: 'Depende do formato. Workshops participativos costumam funcionar melhor com grupos menores; palestras e masterclasses permitem públicos maiores. A recomendação é feita no diagnóstico.' },
      { question: 'A Neduc mede os resultados do treinamento?', answer: 'Podem ser definidos indicadores de participação, aprendizagem, aplicação e percepção de impacto, com instrumentos adequados ao escopo contratado.' }
    ],
    ctaTitle: 'Sua organização tem um desafio específico?',
    ctaDescription: 'Vamos transformar esse desafio em uma experiência de aprendizagem com objetivos, prática e resultados mensuráveis.',
    ctaLabel: 'Solicitar proposta corporativa'
  }, context);
}
