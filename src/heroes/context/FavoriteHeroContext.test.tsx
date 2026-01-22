import { beforeEach, describe, expect, test } from "vitest";
import {
  FavoriteHeroContext,
  FavoriteHeroProvider,
} from "./FavoriteHeroContext";
import { fireEvent, render, screen } from "@testing-library/react";
import { use } from "react";
import type { Hero } from "../types/hero.interface";

const mockHero = {
  id: "hero-1",
  name: "Mock Hero",
  slug: "mock-hero",
  alias: "Mock Alias",
  powers: ["Mock Power"],
  description: "Mock Description",
  strength: 10,
  intelligence: 10,
  speed: 10,
  durability: 10,
  team: "Mock Team",
  image: "mock.jpg",
  firstAppearance: "2023",
  status: "Active",
  category: "Hero",
  universe: "Marvel",
} as unknown as Hero;

const TestComponent = () => {
  const { favoriteCount, favorites, toggleFavorite, isFavorite } =
    use(FavoriteHeroContext);

  return (
    <div>
      <div data-testid="favorite-count">{favoriteCount}</div>
      <div data-testid="favorite-list">
        {favorites.map((hero) => (
          <div key={hero.id} data-testid={hero.id}>
            {hero.name}
          </div>
        ))}
      </div>
      <button
        data-testid="toggle-favorite-button"
        onClick={() => toggleFavorite(mockHero)}
      >
        Toggle Favorite
      </button>
      <div data-testid="is-favorite-status">
        {isFavorite(mockHero) ? "Is Favorite" : "Not Favorite"}
      </div>
    </div>
  );
};

const RenderContextTest = () => {
  return (
    <FavoriteHeroProvider>
      <TestComponent />
    </FavoriteHeroProvider>
  );
};

describe("FavoriteHeroContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("should initialize with default values ", () => {
    render(<RenderContextTest />);

    expect(screen.getByTestId("favorite-count").textContent).toBe("0");
    expect(screen.getByTestId("favorite-list").children.length).toBe(0);
  });

  test("Should add hero to favorites when toggleFavorite is called with new Hero", () => {
    render(<RenderContextTest />);

    const button = screen.getByTestId("toggle-favorite-button");

    fireEvent.click(button);

    expect(screen.getByTestId("favorite-count").textContent).toBe("1");
    expect(screen.getByTestId("is-favorite-status").textContent).toBe(
      "Is Favorite"
    );
    expect(screen.getByTestId("hero-1").textContent).toBe("Mock Hero");
    expect(localStorage.getItem("favoriteHeroes")).toBe(
      JSON.stringify([mockHero])
    );
  });

  test("Should remove hero to favorites when toggleFavorite is called with new Hero", () => {
    localStorage.setItem("favoriteHeroes", JSON.stringify([mockHero]));

    render(<RenderContextTest />);

    const button = screen.getByTestId("toggle-favorite-button");

    fireEvent.click(button);

    expect(screen.getByTestId("favorite-count").textContent).toBe("0");
    expect(screen.getByTestId("is-favorite-status").textContent).toBe(
      "Not Favorite"
    );
    expect(screen.getByTestId("favorite-list").children.length).toBe(0);
    expect(localStorage.getItem("favoriteHeroes")).toBe(JSON.stringify([]));
  });
});
