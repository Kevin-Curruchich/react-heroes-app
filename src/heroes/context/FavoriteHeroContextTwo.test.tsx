import { beforeEach, describe, expect, test, vi } from "vitest";
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
  power: "Mock Power",
} as Hero;

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

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
    vi.clearAllMocks();
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
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "favoriteHeroes",
      JSON.stringify([mockHero])
    );
  });

  test("Should remove hero to favorites when toggleFavorite is called with new Hero", () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify([mockHero]));

    render(<RenderContextTest />);

    const button = screen.getByTestId("toggle-favorite-button");

    fireEvent.click(button);

    expect(screen.getByTestId("favorite-count").textContent).toBe("0");
    expect(screen.getByTestId("is-favorite-status").textContent).toBe(
      "Not Favorite"
    );
    expect(screen.getByTestId("favorite-list").children.length).toBe(0);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "favoriteHeroes",
      JSON.stringify([])
    );
  });
});
