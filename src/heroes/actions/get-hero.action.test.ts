import { describe, expect, test } from "vitest";
import { getHeroAction } from "./get-hero.action";

const VITE_API_URL = import.meta.env.VITE_API_URL;

describe("GetHeroAction", () => {
  test("Should fetch hero data and return with complete image url", async () => {
    const mockHeroIdSlug = "clark-kent";

    const data = await getHeroAction(mockHeroIdSlug);

    expect(data).toBeDefined();
    expect(data).toStrictEqual({
      id: expect.any(String),
      name: "Clark Kent",
      slug: "clark-kent",
      alias: "Superman",
      powers: [
        "Súper fuerza",
        "Vuelo",
        "Visión de calor",
        "Visión de rayos X",
        "Invulnerabilidad",
        "Súper velocidad",
      ],
      description:
        "El Último Hijo de Krypton, protector de la Tierra y símbolo de esperanza para toda la humanidad.",
      strength: 10,
      intelligence: 8,
      speed: 9,
      durability: 10,
      team: "Liga de la Justicia",
      image: "http://localhost:3000/images/1.jpeg",
      firstAppearance: "1938",
      status: "Active",
      category: "Hero",
      universe: "DC",
    });
    expect(data.image).toContain(`${VITE_API_URL}/images/`);
  });

  test("should return throw an error if hero is not found", async () => {
    const invalidHeroIdSlug = "invalid-hero-slug";
    const result = await getHeroAction(invalidHeroIdSlug).catch((error) => {
      expect(error).toBeDefined();
      expect(error.response.status).toBe(404);
    });

    expect(result).toBeUndefined();
  });
});
