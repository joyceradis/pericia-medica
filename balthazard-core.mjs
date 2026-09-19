export function normalizePercent(value, label = "valor") {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0 || n > 100) {
    throw new RangeError(`${label} deve estar entre 0 e 100.`);
  }
  return n;
}

export function combineDeficits(values) {
  const clean = values
    .map((value, index) => normalizePercent(value, `Sequela ${index + 1}`))
    .filter(value => value > 0);

  let remaining = 100;
  const steps = clean.map((value, index) => {
    const capacityBefore = remaining;
    const attributableImpact = capacityBefore * (value / 100);
    remaining -= attributableImpact;

    return {
      index: index + 1,
      deficit: value,
      capacityBefore,
      attributableImpact,
      capacityAfter: remaining,
      consolidatedDeficit: 100 - remaining,
    };
  });

  return {
    values: clean,
    steps,
    remainingCapacity: remaining,
    consolidatedDeficit: 100 - remaining,
    simpleSum: clean.reduce((sum, value) => sum + value, 0),
  };
}

export function attributableIncrement(currentGlobalDeficit, priorDeficit) {
  const current = normalizePercent(currentGlobalDeficit, "Déficit global atual");
  const prior = normalizePercent(priorDeficit, "Estado anterior");

  if (prior >= 100) {
    throw new RangeError("O estado anterior deve ser inferior a 100% para cálculo inverso.");
  }
  if (current < prior) {
    throw new RangeError("O déficit global atual não pode ser inferior ao estado anterior neste cálculo.");
  }

  return ((current - prior) / (100 - prior)) * 100;
}

export function round(value, decimals = 2) {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}
