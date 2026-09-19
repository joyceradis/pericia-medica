import { attributableIncrement, combineDeficits, round } from "./balthazard-core.mjs";

const rows = document.querySelector("#deficitRows");
const resultBox = document.querySelector("#resultBox");
const inverseBox = document.querySelector("#inverseResult");
const copyButton = document.querySelector("#copyResult");
const resetButton = document.querySelector("#resetTool");
const addButton = document.querySelector("#addRow");

function rowTemplate(index) {
  return `
    <div class="calc-row" data-row>
      <div class="row-index" aria-hidden="true">${index}</div>
      <label>
        Descrição da sequela
        <input type="text" data-description placeholder="Ex.: limitação de flexão do joelho">
      </label>
      <label>
        Valor (%)
        <input type="number" min="0" max="100" step="0.01" inputmode="decimal" data-deficit placeholder="0">
      </label>
      <label>
        Fonte / item / página
        <input type="text" data-source placeholder="Ex.: barema, item 3.2, p. 41">
      </label>
      <button class="icon-button" type="button" data-remove aria-label="Remover sequela ${index}">×</button>
    </div>`;
}

function renumberRows() {
  [...rows.querySelectorAll("[data-row]")].forEach((row, index) => {
    row.querySelector(".row-index").textContent = index + 1;
    row.querySelector("[data-remove]").setAttribute("aria-label", `Remover sequela ${index + 1}`);
  });
}

function addRow() {
  const count = rows.querySelectorAll("[data-row]").length;
  if (count >= 10) return;
  rows.insertAdjacentHTML("beforeend", rowTemplate(count + 1));
  bindRemoveButtons();
}

function bindRemoveButtons() {
  rows.querySelectorAll("[data-remove]").forEach(button => {
    button.onclick = () => {
      if (rows.querySelectorAll("[data-row]").length <= 1) return;
      button.closest("[data-row]").remove();
      renumberRows();
      calculate();
    };
  });
}

function getEntries() {
  return [...rows.querySelectorAll("[data-row]")].map((row, index) => ({
    label: `Sequela ${index + 1}`,
    description: row.querySelector("[data-description]").value.trim(),
    value: row.querySelector("[data-deficit]").value,
    source: row.querySelector("[data-source]").value.trim(),
  }));
}

function calculate() {
  const entries = getEntries().filter(entry => entry.value !== "");
  if (!entries.length) {
    resultBox.innerHTML = '<p class="muted">Informe ao menos um percentual para calcular.</p>';
    return;
  }

  try {
    const calc = combineDeficits(entries.map(entry => entry.value));
    const rowsHtml = calc.steps.map((step, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${entries[index]?.description || "—"}</td>
        <td>${round(step.deficit)}%</td>
        <td>${round(step.capacityBefore)}%</td>
        <td>${round(step.attributableImpact)}%</td>
        <td>${round(step.capacityAfter)}%</td>
        <td>${entries[index]?.source || "—"}</td>
      </tr>`).join("");

    resultBox.innerHTML = `
      <div class="metric-grid">
        <div><span>Déficit consolidado</span><strong>${round(calc.consolidatedDeficit)}%</strong></div>
        <div><span>Capacidade restante</span><strong>${round(calc.remainingCapacity)}%</strong></div>
        <div><span>Soma simples</span><strong>${round(calc.simpleSum)}%</strong></div>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>#</th><th>Sequela</th><th>Valor</th><th>Capacidade anterior</th><th>Impacto real</th><th>Capacidade restante</th><th>Fonte</th></tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </div>
      <p class="method-note">A fórmula combina déficits pela capacidade restante. A ordem não altera o resultado matemático final, mas a sequência exibida deve seguir o referencial técnico utilizado.</p>`;
  } catch (error) {
    resultBox.innerHTML = `<div class="notice warning">${error.message}</div>`;
  }
}

function calculateInverse() {
  const current = document.querySelector("#currentDeficit").value;
  const prior = document.querySelector("#priorDeficit").value;
  if (current === "" || prior === "") {
    inverseBox.innerHTML = '<p class="muted">Preencha os dois campos para calcular.</p>';
    return;
  }

  try {
    const attributable = attributableIncrement(current, prior);
    inverseBox.innerHTML = `
      <div class="metric-grid single">
        <div><span>Incremento funcional atribuível</span><strong>${round(attributable)}%</strong></div>
      </div>
      <p class="method-note">Resultado matemático. Só deve ser aplicado quando houver estado anterior funcional quantificável no mesmo domínio e um referencial que autorize o isolamento pela capacidade restante.</p>`;
  } catch (error) {
    inverseBox.innerHTML = `<div class="notice warning">${error.message}</div>`;
  }
}

function buildCopyText() {
  const entries = getEntries().filter(entry => entry.value !== "");
  if (!entries.length) return "";
  const calc = combineDeficits(entries.map(entry => entry.value));
  const sources = entries.map((entry, i) => `${i + 1}. ${entry.description || "sequela não descrita"} — ${entry.value}% — ${entry.source || "fonte não registrada"}`).join("\n");
  return `BALTHAZARD — CAPACIDADE RESTANTE
Déficits informados:
${sources}

Déficit consolidado: ${round(calc.consolidatedDeficit)}%
Capacidade restante: ${round(calc.remainingCapacity)}%
Soma simples apenas para comparação: ${round(calc.simpleSum)}%

Observação: cálculo matemático de apoio. A indicação metodológica e os percentuais de entrada dependem do referencial técnico aplicável.`;
}

rows.innerHTML = [1, 2, 3].map(rowTemplate).join("");
bindRemoveButtons();

rows.addEventListener("input", calculate);
addButton.addEventListener("click", addRow);
document.querySelector("#inverseInputs").addEventListener("input", calculateInverse);

copyButton.addEventListener("click", async () => {
  const text = buildCopyText();
  if (!text) return;
  await navigator.clipboard.writeText(text);
  copyButton.textContent = "Copiado";
  setTimeout(() => copyButton.textContent = "Copiar síntese", 1200);
});

resetButton.addEventListener("click", () => {
  rows.innerHTML = [1, 2, 3].map(rowTemplate).join("");
  bindRemoveButtons();
  document.querySelector("#currentDeficit").value = "";
  document.querySelector("#priorDeficit").value = "";
  resultBox.innerHTML = '<p class="muted">Informe ao menos um percentual para calcular.</p>';
  inverseBox.innerHTML = '<p class="muted">Preencha os dois campos para calcular.</p>';
});
