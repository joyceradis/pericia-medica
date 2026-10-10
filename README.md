# Kit do Perito

Ferramentas de apoio à perícia médica para organizar cálculos, critérios e referências na avaliação do dano pessoal.

**Aplicação:** https://joyceradis.github.io/pericia-medica/

## Identidade e limites do projeto

**Categoria:** ferramenta médico-pericial especializada · produto independente.

O **Kit do Perito** reúne cálculos e instrumentos de avaliação do dano, incluindo Balthazard e AIPE/Brasil. O [MedPer](https://github.com/joyceradis/MedPer) trata do workflow pericial completo. O Kit não precisa tornar-se um módulo da Radis e seus cálculos continuam sendo mantidos e testados aqui.

**Integração:** apenas eventual acesso por link ou interoperabilidade explicitamente definida; nenhuma integração automática está implementada. [Módulos e status](#módulos) distinguem funcionalidades atuais de roadmap.

**Rastreabilidade:** [histórico do README](https://github.com/joyceradis/pericia-medica/commits/main/README.md) · [PRs](https://github.com/joyceradis/pericia-medica/pulls?q=is%3Apr).

## Por que este projeto existe

Perícia não é uma coleção de escalas. O resultado só faz sentido quando o objeto está delimitado, o dano está demonstrado, o nexo foi analisado, a consolidação foi considerada e o método escolhido realmente responde à pergunta pericial.

O Kit do Perito nasceu de uma planilha que eu já usava para organizar a avaliação do dano pessoal. A versão web separa as ferramentas que mais fazem sentido usar de forma rápida no navegador.

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

## Regras que a ferramenta não pode quebrar

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

## Como foi feito

A calculadora de Balthazard mantém a matemática separada da interface para que as fórmulas possam ser testadas diretamente. O projeto também tem testes automatizados, verificação no GitHub Actions, funcionamento offline e páginas públicas independentes para cada ferramenta.

```text
balthazard-core.mjs   fórmulas
balthazard.js         interação da página
tests/                testes automatizados
aipe.html + app.js    módulo AIPE/Brasil
```

Isso deixa o cálculo mais fácil de conferir e reduz o risco de uma mudança visual alterar a lógica sem percebermos.

## Autoria

Projeto criado por **Dra. Joyce Radis**, médica e perita judicial, a partir de necessidades da própria rotina pericial.

GitHub: https://github.com/joyceradis  
LinkedIn: https://br.linkedin.com/in/drajoyceradis

## Licença

O código é publicamente visível para portfólio, avaliação e demonstração. Consulte [LICENSE](LICENSE) antes de copiar, modificar, distribuir ou reutilizar conteúdo. Materiais e instrumentos de terceiros permanecem sujeitos aos respectivos direitos e condições.
