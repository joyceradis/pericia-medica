import test from "node:test";
import assert from "node:assert/strict";
import { attributableIncrement, combineDeficits, round } from "../balthazard-core.mjs";

test("combina dois déficits pela capacidade restante", () => {
  const result = combineDeficits([20, 30]);
  assert.equal(round(result.consolidatedDeficit), 44);
  assert.equal(round(result.remainingCapacity), 56);
});

test("resultado final é invariável à ordem matemática", () => {
  const a = combineDeficits([20, 30, 10]);
  const b = combineDeficits([10, 30, 20]);
  assert.equal(round(a.consolidatedDeficit, 8), round(b.consolidatedDeficit, 8));
});

test("zero não altera a capacidade restante", () => {
  const result = combineDeficits([0, 20]);
  assert.equal(round(result.consolidatedDeficit), 20);
});

test("rejeita percentuais fora de 0 a 100", () => {
  assert.throws(() => combineDeficits([120]), RangeError);
  assert.throws(() => combineDeficits([-1]), RangeError);
});

test("calcula Balthazard inversa", () => {
  assert.equal(round(attributableIncrement(44, 20)), 30);
});

test("rejeita déficit atual inferior ao estado anterior", () => {
  assert.throws(() => attributableIncrement(10, 20), RangeError);
});
