import test from "node:test";
import assert from "node:assert/strict";
import {
  isPositiveInteger,
  isValidEmail,
  slugify,
  toNullableNumber
} from "./validation.js";

test("isValidEmail accepts a normal email address", () => {
  assert.equal(isValidEmail("aziz@example.com"), true);
  assert.equal(isValidEmail("not-an-email"), false);
  assert.equal(isValidEmail(""), false);
});

test("isPositiveInteger accepts positive integer values only", () => {
  assert.equal(isPositiveInteger(4), true);
  assert.equal(isPositiveInteger("12"), true);
  assert.equal(isPositiveInteger(0), false);
  assert.equal(isPositiveInteger(-3), false);
  assert.equal(isPositiveInteger("2.5"), false);
});

test("slugify produces a URL-safe slug", () => {
  assert.equal(slugify("House of Sampoerna & Co."), "house-of-sampoerna-co");
  assert.equal(slugify("  Kota Lama Surabaya  "), "kota-lama-surabaya");
  assert.equal(slugify("***"), "");
});

test("toNullableNumber preserves empty values as null", () => {
  assert.equal(toNullableNumber(""), null);
  assert.equal(toNullableNumber(null), null);
  assert.equal(toNullableNumber("15000"), 15000);
});
