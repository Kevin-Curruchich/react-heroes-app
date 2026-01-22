import { describe, expect, test } from "vitest";
import { getSummaryAction } from "./get-summary-action";

describe("GetSummaryAction", () => {
  test("Should fetch summary and resturn complete information", async () => {
    const summary = await getSummaryAction();
    expect(summary).toBeDefined();
    expect(summary).toStrictEqual({
      totalHeroes: 25,
      strongestHero: expect.objectContaining({
        id: "1",
        name: "Clark Kent",
        slug: "clark-kent",
        alias: "Superman",
        powers: expect.any(Array),
        description:
          "El Último Hijo de Krypton, protector de la Tierra y símbolo de esperanza para toda la humanidad.",
        strength: 10,
        intelligence: 8,
        speed: 9,
        durability: 10,
        team: "Liga de la Justicia",
        image: "1.jpeg",
        firstAppearance: "1938",
        status: "Active",
        category: "Hero",
        universe: "DC",
      }),
      smartestHero: {
        id: "2",
        name: "Bruce Wayne",
        slug: "bruce-wayne",
        alias: "Batman",
        powers: expect.any(Array),
        description:
          "El Caballero Oscuro de Ciudad Gótica, que utiliza el miedo como arma contra el crimen y la corrupción.",
        strength: 6,
        intelligence: 10,
        speed: 6,
        durability: 7,
        team: "Liga de la Justicia",
        image: "2.jpeg",
        firstAppearance: "1939",
        status: "Active",
        category: "Hero",
        universe: "DC",
      },
      heroCount: expect.any(Number),
      villainCount: expect.any(Number),
    });
  });
});
