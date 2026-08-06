# Referências e decisões de UX/UI

O projeto não copia identidade visual ou código de terceiros. Ele combina padrões recorrentes de plataformas educacionais internacionais com a identidade e o conteúdo institucional da Neduc.

## Padrões adotados

- **Proposta de valor orientada a resultados:** hero com mensagem direta, públicos e chamadas para cursos e soluções.
- **Descoberta de programas:** catálogos com pesquisa, filtro, nível, duração, formato, público e resultados esperados.
- **Flexibilidade de aprendizagem:** apresentação clara dos formatos presencial, on-line ao vivo e EaD.
- **Aprendizagem aplicada:** destaque para projetos, casos, acompanhamento e indicadores.
- **Conteúdo institucional confiável:** missão, visão, valores, metodologia, áreas de atuação e canais de contato.
- **Acessibilidade desde o projeto:** navegação por teclado, foco visível, semântica, formulários associados, movimento reduzido e layout refluível.

## Referências observadas

- Coursera: organização de catálogo, foco em competências e resultados profissionais.
- The Open University: busca de cursos e comunicação de flexibilidade.
- FutureLearn: metadados concisos de programas, duração e esforço.
- MIT Open Learning: posicionamento institucional e conexão entre tecnologia e aprendizagem.
- W3C WAI: WCAG 2.2 como referência para acessibilidade.

## Decisão de arquitetura

Foi adotada uma SPA multipágina híbrida. Cada seção principal existe como diretório físico para funcionar em acesso direto no GitHub Pages, enquanto o JavaScript intercepta a navegação interna e atualiza o conteúdo sem recarregar toda a estrutura.
