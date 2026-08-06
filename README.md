# Site institucional Neduc

SPA estático desenvolvido com HTML5, CSS e JavaScript puro, sem frameworks ou bibliotecas externas. O conteúdo institucional foi estruturado a partir da apresentação da Neduc — Núcleo de Educação e Competências.

## Recursos

- Rotas SPA por hash, compatíveis com GitHub Pages.
- Cada item do menu utiliza uma página parcial independente em `pages/`.
- Cursos, treinamentos e mentorias carregados de arquivos JSON.
- Blog com artigos em AsciiDoc organizados por `ano/mês`.
- Conversor AsciiDoc local e seguro para os recursos utilizados nos artigos.
- Pesquisa e filtros em cursos, treinamentos, mentorias e blog.
- Layout responsivo, navegação por teclado, foco visível, contraste, semântica e suporte a movimento reduzido.
- Nenhuma dependência externa e nenhum processo de build.

## Estrutura

```text
.
├── index.html
├── 404.html
├── pages/
├── assets/
│   ├── css/styles.css
│   ├── js/
│   ├── data/
│   └── img/
└── blog/
    ├── index.json
    └── 2026/
        ├── 06/
        ├── 07/
        └── 08/
```

## Executar localmente

O navegador bloqueia `fetch()` quando o projeto é aberto diretamente por `file://`. Use um servidor local:

```bash
python3 -m http.server 8080
```

Acesse `http://localhost:8080`.

Alternativa com Node.js:

```bash
npx serve .
```

O site publicado não depende do Node.js.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie todos os arquivos para a raiz da branch `main`.
3. Em **Settings → Pages**, selecione **Deploy from a branch**.
4. Selecione a branch `main` e a pasta `/ (root)`.
5. Salve e aguarde a publicação.

As rotas usam fragmentos como `#/cursos`, portanto funcionam tanto em domínio próprio quanto em um subdiretório de projeto do GitHub Pages.

## Adicionar um curso, treinamento ou mentoria

Edite o JSON correspondente em `assets/data/`. Preserve os nomes dos campos existentes. O site monta os cartões automaticamente.

## Publicar um artigo

1. Crie a pasta `blog/ANO/MÊS/`, caso ainda não exista.
2. Crie o arquivo com o padrão:

```text
id_nome-da-publicacao_AAAA-MM-DD.asciidoc
```

3. Use os metadados:

```asciidoc
= Título
:author: Equipe Neduc
:revdate: 2026-08-06
:description: Resumo para a página e mecanismos de busca.
:tags: tema 1, tema 2
```

4. Adicione o artigo em `blog/index.json`, informando o caminho completo no campo `arquivo`.

O conversor implementa títulos, parágrafos, listas, negrito, itálico, código, links, citações e blocos NOTE/TIP/IMPORTANT/WARNING.

## Integrações pendentes para produção comercial

- O formulário de contato usa `mailto:` porque o GitHub Pages não executa backend.
- O formulário de newsletter é demonstrativo. Conecte-o a um serviço adequado antes de captar dados reais.
- Revise a política de privacidade após adicionar analytics, CRM, formulários externos ou pagamentos.
- Substitua ou complemente os dados institucionais conforme domínio, e-mail e canais definitivos.

## Testes recomendados antes do lançamento

- Navegação completa por teclado.
- Leitores de tela NVDA, VoiceOver ou Orca.
- Lighthouse e axe DevTools.
- Celulares reais em diferentes larguras.
- Validação HTML e revisão de contraste.
