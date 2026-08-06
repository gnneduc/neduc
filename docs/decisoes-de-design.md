# Decisões de UX e UI

## Direção visual

A interface preserva a identidade institucional da apresentação: azul-marinho para confiança e profundidade, vermelho para ação e destaque, branco e cinzas claros para legibilidade. A tipografia usa fontes do sistema para evitar dependências e melhorar desempenho.

## Arquitetura da informação

A página inicial apresenta, nesta ordem:

1. proposta de valor;
2. públicos atendidos;
3. soluções principais;
4. diferenciais;
5. cursos em destaque;
6. metodologia;
7. conteúdo do blog;
8. chamada para diagnóstico.

Essa sequência reduz a necessidade de o visitante conhecer previamente a organização. Primeiro ele reconhece o próprio contexto, depois entende as soluções e, por fim, encontra evidências de método e próximos passos.

## Referências analisadas

A estrutura foi inspirada em padrões observados em portais educacionais oficiais:

- MIT Open Learning: destaque para exploração de recursos, aprendizagem contínua e caminhos para pessoas e organizações;
- Stanford Continuing Studies: comunicação direta sobre formatos, flexibilidade e interação;
- University of Oxford: busca e descoberta de cursos, separação clara de públicos e orientação ao visitante;
- W3C WCAG 2.2: princípios e critérios de acessibilidade para conteúdo web.

Referências:

- https://openlearning.mit.edu/
- https://continuingstudies.stanford.edu/online
- https://www.ox.ac.uk/admissions
- https://www.w3.org/TR/WCAG22/

## SPA com páginas modulares

O site possui um único documento HTML, mas cada item de menu é implementado em um arquivo JavaScript separado. O roteador usa hash para permitir publicação em hospedagem estática sem configuração de servidor.

## Conteúdo orientado a dados

Cursos, treinamentos e mentorias ficam fora do código visual. Isso permite alterar catálogo, status, formatos e descrições sem editar os módulos de interface.

## Blog em AsciiDoc

Os artigos ficam organizados por ano e mês. Um índice JSON mantém os metadados necessários para listagem e localização. O interpretador local evita dependência de biblioteca externa.
