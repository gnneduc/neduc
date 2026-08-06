# Checklist de acessibilidade

O projeto foi preparado com referência na WCAG 2.2, mas a conformidade final depende do conteúdo definitivo, das integrações e de testes humanos.

## Já implementado

- idioma da página definido como português do Brasil;
- títulos e landmarks semânticos;
- ordem de foco coerente;
- link “Ir para o conteúdo principal”;
- contraste forte na paleta principal;
- estados de foco visíveis;
- controles com nomes acessíveis;
- menus e painéis com estados `aria-expanded` e `aria-pressed`;
- feedback textual em filtros e formulários;
- suporte a ampliação de texto;
- opção de alto contraste;
- opção e preferência do sistema para redução de movimento;
- layout responsivo sem rolagem horizontal planejada;
- mensagens de erro associadas aos campos;
- artigos com estrutura de títulos;
- impressão simplificada.

## Testes recomendados antes da publicação

1. navegar por todas as páginas usando apenas Tab, Shift+Tab, Enter, Espaço e Escape;
2. testar com NVDA no Windows e Orca no Linux;
3. ampliar o navegador para 200% e 400%;
4. testar larguras de 320, 375, 768, 1024 e 1440 pixels;
5. validar contraste após qualquer alteração de cor;
6. revisar todos os textos alternativos;
7. testar formulários com erros e preenchimento automático;
8. verificar conteúdo com pessoas com diferentes necessidades de acesso;
9. executar ferramentas automáticas como axe ou Lighthouse como apoio, não como única validação.

## Conteúdo

Evite textos vagos como “clique aqui”. Use títulos descritivos, frases diretas, parágrafos curtos e instruções que não dependam apenas de cor, posição ou formato visual.
