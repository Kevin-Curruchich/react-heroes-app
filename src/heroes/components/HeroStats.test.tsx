import { describe, expect, test, vi } from "vitest";
import { HeroStats } from "./HeroStats";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useHeroSummary } from "../hooks/useHeroSummary";
import type { SummaryInformationResponse } from "../types/summary-information.response";
import { FavoriteHeroProvider } from "../context/FavoriteHeroContext";

vi.mock("../hooks/useHeroSummary");

const mockUseHeroSummary = vi.mocked(useHeroSummary);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const mockHero = {
  id: "1",
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
  image: "1.jpeg",
  firstAppearance: "1938",
  status: "Active",
  category: "Hero",
  universe: "DC",
};

const mockSummaryData: SummaryInformationResponse = {
  totalHeroes: 25,
  strongestHero: {
    id: "1",
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
    image: "1.jpeg",
    firstAppearance: "1938",
    status: "Active",
    category: "Hero",
    universe: "DC",
  },
  smartestHero: {
    id: "2",
    name: "Bruce Wayne",
    slug: "bruce-wayne",
    alias: "Batman",
    powers: [
      "Artes marciales",
      "Habilidades de detective",
      "Tecnología avanzada",
      "Sigilo",
      "Genio táctico",
    ],
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
  heroCount: 18,
  villainCount: 7,
};

const renderHetoStats = (mockData?: Partial<SummaryInformationResponse>) => {
  if (mockData) {
    mockUseHeroSummary.mockReturnValue({
      data: mockData as unknown as ReturnType<typeof useHeroSummary>,
    });
  } else {
    mockUseHeroSummary.mockReturnValue({
      data: undefined as unknown as ReturnType<typeof useHeroSummary>,
    });
  }

  return render(
    <QueryClientProvider client={queryClient}>
      <FavoriteHeroProvider>
        <HeroStats />
      </FavoriteHeroProvider>
    </QueryClientProvider>,
  );
};

describe("<HeroStats />", () => {
  test("Should render component with default values", () => {
    const { container } = renderHetoStats();

    expect(screen.getByText("Loading stats...")).toBeDefined();
    expect(container).toMatchSnapshot();
  });

  test("Should render HeroStats with mock information", () => {
    renderHetoStats(mockSummaryData);

    expect(screen.getByText("Total Characters")).toBeDefined();
    expect(screen.getByText("25")).toBeDefined();
    expect(screen.getByText("18 Heroes")).toBeDefined();
    expect(screen.getByText("7 Villains")).toBeDefined();
  });

  test("Should change the porcentaje  of favorites when a hero is added to favorites", () => {
    localStorage.setItem("favoriteHeroes", JSON.stringify([mockHero]));

    console.log(localStorage.getItem("favorites"));

    renderHetoStats(mockSummaryData);

    const favoritePercentageElement = screen.getByTestId("favorite-percentage");
    // screen.debug(favoritePercentageElement);
    expect(favoritePercentageElement).toBeDefined();
    expect(favoritePercentageElement.textContent).toBe("4.00% of total");

    const favoriteCountElement = screen.getByTestId("favorite-count");
    expect(favoriteCountElement).toBeDefined();
    expect(favoriteCountElement.textContent).toBe("1");
  });
});
