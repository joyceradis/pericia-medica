# PericialKit BR

> **Traceable medico-legal tools for personal injury assessment.**

Ferramentas médico-legais para avaliação do dano pessoal, construídas a partir de fluxo pericial real e organizadas para manter **método, fonte, limite técnico e decisão humana** visíveis.

**Aplicação:** https://joyceradis.github.io/pericia-medica/

## Por que este projeto existe

Perícia não é uma coleção de escalas. O resultado só faz sentido quando o objeto está delimitado, o dano está demonstrado, o nexo foi analisado, a consolidação foi considerada e o método escolhido realmente responde à pergunta pericial.

O PericialKit BR nasceu primeiro como uma planilha operacional de avaliação do dano pessoal. A versão web transforma partes desse fluxo em módulos independentes, testáveis e auditáveis.

```text
OBJETO
  ↓
DANO DEMONSTRÁVEL
  ↓
NEXO
  ↓
CURA / CONSOLIDAÇÃO
  ↓
MÉTODO APLICÁVEL
  ↓
VALORAÇÃO
  ↓
INTEGRAÇÃO + LIMITES
```

## Módulos

| Módulo | Status | O que faz |
| --- | --- | --- |
| **Balthazard** | disponível | Combina déficits pela capacidade restante, mantém descrição/fonte por entrada e oferece cálculo inverso para estado anterior funcional quantificável. |
| **AIPE/Brasil** | disponível | Fluxo guiado para descrição e análise do prejuízo estético, preservando fundamentação manual e limites metodológicos. |
| **Danos temporários** | roadmap | Reconstrução cronológica, períodos e consolidação. |
| **Integração pericial** | roadmap | Fechamento por eixos independentes, sem escore global artificial. |

## Invariantes de segurança

```text
campo vazio      ≠ achado negativo
percentual       ≠ fato sem fonte
Balthazard       ≠ gerador de percentual clínico
AIPE             ≠ prova de nexo
escala           ≠ substituto do exame
automação        ≠ autoridade pericial
```

## Balthazard

A lógica matemática fica separada da interface em `balthazard-core.mjs`.

A cada etapa:

```text
impacto = capacidade_anterior × déficit
capacidade_restante = capacidade_anterior − impacto
```

O déficit consolidado é o complemento da capacidade restante.

O módulo também implementa a operação inversa:

```text
D = (F − Ea) / (1 − Ea)
```

onde `F` é o déficit funcional global atual e `Ea` é o estado anterior funcional quantificável. A própria interface registra que a operação matemática só é pertinente quando o referencial técnico autoriza esse isolamento.

### Testes

```bash
npm test
npm run check
```

Os testes cobrem combinação de déficits, invariância matemática à ordem, entradas fora de faixa e Balthazard inversa.

## AIPE/Brasil

O módulo AIPE preserva uma distinção importante: **compatibilidade interna do formulário não é um escore validado adicional**. A categoria e o ajuste permanecem decisões fundamentadas do perito.

As referências metodológicas e limitações estão em [NOTAS_METODOLOGICAS.md](NOTAS_METODOLOGICAS.md).

## Privacidade

- sem backend;
- sem autenticação;
- sem telemetria de paciente;
- cálculos executados no navegador;
- nenhum documento judicial deve ser publicado no repositório;
- demonstrações devem usar dados fictícios ou plenamente desidentificados.

Consulte [SECURITY.md](SECURITY.md).

## Arquitetura

```text
index.html                landing / descoberta
toolkit.css               design system público
balthazard.html           interface Balthazard
balthazard.js             controller da interface
balthazard-core.mjs       funções matemáticas puras
tests/                    testes automatizados
aipe.html                 interface AIPE/Brasil
app.js                    lógica do módulo AIPE
NOTAS_METODOLOGICAS.md    critérios e referências
.github/workflows/        verificação automatizada
```

## Qualidade

- JavaScript sem dependência de framework no cliente;
- funções matemáticas isoladas da UI;
- testes com Node.js test runner;
- verificação de sintaxe em CI;
- GitHub Pages;
- PWA/offline shell;
- sitemap, canonical URLs e metadata estruturada;
- `CITATION.cff` para citação do software.

## Autoria

Projeto concebido por **Dra. Joyce Radis**, médica e perita judicial, a partir de necessidades observadas na prática médico-pericial.

GitHub: https://github.com/joyceradis  
LinkedIn: https://br.linkedin.com/in/drajoyceradis

## Licença

O código é publicamente visível para portfólio, avaliação e demonstração. Consulte [LICENSE](LICENSE) antes de copiar, modificar, distribuir ou reutilizar conteúdo. Materiais e instrumentos de terceiros permanecem sujeitos aos respectivos direitos e condições.
