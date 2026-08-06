# Neduc — Núcleo de Educação e Competências

Site institucional completo, responsivo e acessível, desenvolvido somente com HTML5, CSS e JavaScript. A navegação usa o modelo SPA com rotas por hash, sem framework e sem back-end obrigatório.

## Executar localmente

Por segurança do navegador, arquivos JSON e AsciiDoc precisam ser carregados por HTTP. Abra um terminal na pasta do projeto e execute uma das opções:

```bash
python3 -m http.server 8080
```

ou:

```bash
npx serve .
```

Depois, acesse `http://localhost:8080`.

## Estrutura principal

```text
neduc-site/
├── index.html
├── manifest.webmanifest
├── service-worker.js
├── assets/
│   ├── css/styles.css
│   ├── images/
│   └── js/
│       ├── app.js
│       ├── router.js
│       ├── asciidoc.js
│       └── views/
├── data/
│   ├── courses.json
│   ├── trainings.json
│   └── mentorships.json
├── blog/
│   ├── index.json
│   └── ANO/MÊS/id_nome_da_publicacao_DATA.asciidoc
└── docs/
```

Cada item do menu possui um módulo de página separado em `assets/js/views/`, embora toda a experiência seja carregada pelo mesmo `index.html`.

## Rotas

- `#/` — início
- `#/quem-somos`
- `#/cursos`
- `#/treinamentos`
- `#/mentorias`
- `#/blog`
- `#/blog/<slug>`
- `#/contato`
- `#/privacidade`

## Alterar cursos, treinamentos e mentorias

Edite os arquivos em `data/`. Cada item é um objeto JSON. Os catálogos são montados automaticamente, com pesquisa, categoria e formato.

Campos utilizados:

```json
{
  "id": "identificador-unico",
  "title": "Nome da solução",
  "category": "Categoria",
  "level": "Nível ou público",
  "summary": "Descrição curta",
  "duration": "20 horas",
  "format": "On-line ao vivo",
  "status": "Inscrições abertas",
  "investment": "Sob consulta",
  "image": "assets/images/arquivo.webp",
  "skills": ["competência 1", "competência 2"]
}
```

## Publicar um artigo em AsciiDoc

1. Crie a pasta de ano e mês, caso ainda não exista.
2. Crie o arquivo no padrão obrigatório:

```text
blog/2026/08/id_nome_da_publicacao_2026-08-06.asciidoc
```

3. Registre o artigo no `blog/index.json`.

Exemplo de conteúdo:

```asciidoc
= Título do artigo
Equipe Neduc
:revdate: 2026-08-06
:description: Resumo do artigo.

Parágrafo introdutório.

== Primeiro tópico

* Item de lista
* Outro item

IMPORTANT: Informação em destaque.
```

O interpretador incluído em `assets/js/asciidoc.js` processa títulos, subtítulos, parágrafos, listas, blocos de código, citações, avisos e formatação inline básica.

## Formulários

O projeto é estático:

- o formulário de contato valida os campos e abre o aplicativo de e-mail com a mensagem preenchida;
- a inscrição de newsletter é uma demonstração de interface;
- para uso em produção, conecte os formulários a um serviço autorizado ou a uma API própria.

## Identidade e imagens

As cores e o conteúdo foram baseados na apresentação institucional fornecida. As imagens utilizadas no projeto foram extraídas e otimizadas a partir desse material.

## Acessibilidade

A implementação inclui:

- HTML semântico e landmarks;
- link para pular ao conteúdo;
- navegação por teclado;
- foco visível;
- menu móvel com estado acessível;
- painel de tamanho de texto, alto contraste e redução de movimento;
- regiões `aria-live` para carregamento e filtros;
- formulários com mensagens de erro associadas;
- respeito a `prefers-reduced-motion`;
- conteúdo imprimível nos artigos;
- imagens decorativas com texto alternativo vazio e imagens informativas descritas.

Consulte `docs/acessibilidade.md` antes da publicação.

## Publicação

O projeto pode ser hospedado em qualquer serviço de arquivos estáticos, como servidor Apache/Nginx, GitHub Pages, Cloudflare Pages, Netlify ou similar. Como as rotas usam hash, não é necessário configurar redirecionamento de fallback.

Antes de publicar:

1. revise contatos, domínio e redes sociais;
2. confirme cursos, investimentos e calendários;
3. integre formulários e consentimentos aos processos reais;
4. revise a política de privacidade;
5. execute testes com teclado, leitores de tela e dispositivos reais;
6. atualize o nome do cache no `service-worker.js` após alterações relevantes.
