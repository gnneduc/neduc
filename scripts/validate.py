#!/usr/bin/env python3
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse, unquote
import json, re, sys

ROOT = Path(__file__).resolve().parents[1]
errors=[]

class RefParser(HTMLParser):
    def __init__(self):
        super().__init__(); self.refs=[]; self.inline_scripts=0; self.inline_styles=0
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs)
        for key in ('href','src'):
            if key in attrs: self.refs.append((tag,key,attrs[key]))
        if tag=='script' and 'src' not in attrs: self.inline_scripts += 1
        if 'style' in attrs: self.inline_styles += 1

for p in ROOT.rglob('*.html'):
    parser=RefParser(); parser.feed(p.read_text(encoding='utf-8'))
    if p.name=='index.html' and p.parent.name in {'neduc-site','quem-somos','cursos','blog','treinamentos','mentorias','contato'}:
        if parser.inline_scripts: errors.append(f'{p}: script inline encontrado')
        if parser.inline_styles: errors.append(f'{p}: style inline encontrado')
    for tag,key,ref in parser.refs:
        if not ref or ref.startswith(('#','mailto:','tel:','http://','https://','data:')): continue
        ref=unquote(ref.split('#')[0].split('?')[0])
        target=(p.parent/ref).resolve()
        if not target.exists(): errors.append(f'{p}: referência ausente {ref}')

for p in (ROOT/'assets/data').glob('*.json'):
    try: json.loads(p.read_text(encoding='utf-8'))
    except Exception as e: errors.append(f'{p}: JSON inválido: {e}')

blog=json.loads((ROOT/'assets/data/blog.json').read_text(encoding='utf-8'))
pat=re.compile(r'^id_[a-z0-9_]+_\d{4}-\d{2}-\d{2}\.asciidoc$')
for item in blog:
    f=ROOT/item['arquivo']
    if not f.exists(): errors.append(f'Artigo ausente: {item["arquivo"]}')
    if not pat.match(f.name): errors.append(f'Nome de artigo fora do padrão: {f.name}')
    parts=f.parts
    try:
        i=parts.index('conteudos'); year,month=parts[i+1],parts[i+2]
        if not re.match(r'^\d{4}$',year) or not re.match(r'^(0[1-9]|1[0-2])$',month): errors.append(f'Diretório inválido: {f}')
    except Exception: errors.append(f'Estrutura de diretório inválida: {f}')

required=['index.html','quem-somos/index.html','cursos/index.html','blog/index.html','treinamentos/index.html','mentorias/index.html','contato/index.html','.nojekyll','404.html']
for rel in required:
    if not (ROOT/rel).exists(): errors.append(f'Arquivo obrigatório ausente: {rel}')

if errors:
    print('\n'.join(f'ERRO: {e}' for e in errors)); sys.exit(1)
print(f'Validação concluída: {sum(1 for _ in ROOT.rglob("*"))} itens verificados, sem erros estruturais.')
