import { describe, expect, it } from "vitest";
import { tierForXp, MEMBERSHIP_TIERS } from "./const";

describe("tierForXp", () => {
  it("returns the first tier (Iniciado) for xp < 500", () => {
    expect(tierForXp(0)).toBe(MEMBERSHIP_TIERS[0]);
    expect(tierForXp(250)).toBe(MEMBERSHIP_TIERS[0]);
    expect(tierForXp(499)).toBe(MEMBERSHIP_TIERS[0]);
  });

  it("returns the second tier (Abducido) for 500 <= xp < 2000", () => {
    expect(tierForXp(500)).toBe(MEMBERSHIP_TIERS[1]);
    expect(tierForXp(1000)).toBe(MEMBERSHIP_TIERS[1]);
    expect(tierForXp(1999)).toBe(MEMBERSHIP_TIERS[1]);
  });

  it("returns the third tier (Contactado) for xp >= 2000", () => {
    expect(tierForXp(2000)).toBe(MEMBERSHIP_TIERS[2]);
    expect(tierForXp(5000)).toBe(MEMBERSHIP_TIERS[2]);
    expect(tierForXp(10000)).toBe(MEMBERSHIP_TIERS[2]);
  });
});
