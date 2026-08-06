# Site institucional Neduc

Site estático, responsivo e acessível para a **Neduc — Núcleo de Educação e Competências**, desenvolvido somente com **HTML5, CSS e JavaScript**, sem frameworks ou etapa de compilação.

## Arquitetura

O projeto usa uma **SPA multipágina híbrida**:

- cada item principal possui uma página física (`/cursos/`, `/blog/`, `/contato/` etc.), permitindo acesso direto no GitHub Pages;
- o JavaScript intercepta a navegação interna e atualiza o conteúdo sem recarregar toda a página;
- o caminho-base é calculado a partir do próprio módulo JavaScript, então o site funciona em domínio próprio e em repositórios de projeto, como `usuario.github.io/nome-do-repositorio/`.

## Executar localmente

A leitura de JSON e AsciiDoc exige HTTP. Não abra `index.html` diretamente pelo gerenciador de arquivos.

```bash
cd neduc-site
python3 -m http.server 8000
```

Acesse `http://localhost:8000`.

## Publicar no GitHub Pages

1. Crie um repositório e envie todo o conteúdo desta pasta para a branch principal.
2. No GitHub, abra **Settings > Pages**.
3. Em **Build and deployment**, selecione **Deploy from a branch**.
4. Escolha a branch principal e a pasta `/ (root)`.
5. Salve e aguarde a publicação.

O arquivo `.nojekyll` evita processamento desnecessário pelo Jekyll.

## Atualizar catálogos JSON

Arquivos:

- `assets/data/cursos.json`
- `assets/data/treinamentos.json`
- `assets/data/mentorias.json`

Cada objeto possui campos de título, público, formato, duração, resumo, resultados e imagem. É possível adicionar ou remover itens sem alterar o HTML.

Valide a sintaxe após editar:

```bash
python3 -m json.tool assets/data/cursos.json > /dev/null
```

## Publicar artigo em AsciiDoc

1. Crie o diretório do ano e do mês, caso não exista:
   `blog/conteudos/AAAA/MM/`
2. Use o padrão obrigatório:
   `id_<nome_da_publicacao>_<AAAA-MM-DD>.asciidoc`
3. Adicione os metadados do artigo em `assets/data/blog.json`.

Exemplo:

```asciidoc
= Título do artigo
:author: Equipe Neduc
:revdate: 2026-08-06
:description: Resumo do artigo.

Introdução do conteúdo.

== Primeiro tópico

* Item um
* Item dois
```

O parser local suporta título, atributos, subtítulos, parágrafos, listas, links, negrito, itálico, código e blocos de aviso (`NOTE`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`). Ele não executa HTML arbitrário.

## Formulário de contato

GitHub Pages não processa formulários no servidor. Por isso, o formulário valida os campos e abre o aplicativo de e-mail do visitante com a mensagem preenchida. Para envio automático, integre futuramente um serviço de formulários e atualize a política de privacidade e a Content Security Policy.

## Acessibilidade e UX

O projeto foi estruturado tomando a WCAG 2.2 nível AA como referência:

- HTML semântico, landmarks e hierarquia de títulos;
- navegação por teclado, menu com `aria-expanded` e fechamento por `Esc`;
- link “Pular para o conteúdo”;
- foco visível, contraste e alvos de interação adequados;
- formulários com rótulos, instruções e erros associados;
- textos alternativos e imagens decorativas sem ruído para leitores de tela;
- adaptação a movimento reduzido;
- layouts responsivos de 320 px a telas amplas;
- sem dependências externas, rastreadores ou fontes remotas.

Uma declaração de acessibilidade está em `acessibilidade.html`.

## Identidade e conteúdo

Textos institucionais e imagens foram derivados da apresentação Overview da Neduc fornecida para o projeto. O catálogo inicial é editável e deve ser revisado antes da publicação comercial para confirmar nomes, cargas horárias, valores e disponibilidade.

## Estrutura principal

```text
neduc-site/
├── index.html
├── quem-somos/index.html
├── cursos/index.html
├── blog/index.html
├── treinamentos/index.html
├── mentorias/index.html
├── contato/index.html
├── assets/
│   ├── css/styles.css
│   ├── js/app.js
│   ├── js/asciidoc.js
│   ├── data/*.json
│   └── images/*
├── blog/conteudos/AAAA/MM/*.asciidoc
├── acessibilidade.html
├── privacidade.html
├── 404.html
├── manifest.webmanifest
├── sitemap.xml
├── robots.txt
└── .nojekyll
```
