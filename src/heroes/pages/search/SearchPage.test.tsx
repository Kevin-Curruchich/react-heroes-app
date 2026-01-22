import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { searchHeroesAction } from "@/heroes/actions/search-heroes.action";
import SearchPage from "./SearchPage";
import type { Hero } from "@/heroes/types/hero.interface";

vi.mock("@/heroes/actions/search-heroes.action");

const mockSearchHeroAction = vi.mocked(searchHeroesAction);

vi.mock("@/components/custom/CustomJumbotron", () => ({
  CustomJumbotron: () => (
    <div data-testid="custom-jumbotron"> CustomJumbotron Component</div>
  ),
}));

// vi.mock("./ui/SearchControls", () => ({
//   SearchControls: () => (
//     <div data-testid="search-controls"> SearchControls Component</div>
//   ),
// }));

vi.mock("@/heroes/components/HeroGrid", () => ({
  HeroGrid: ({ heroes }: { heroes: Hero[] }) => (
    <div data-testid="hero-grid">
      {heroes.map((hero) => (
        <div key={hero.id} data-testid="hero-item">
          {hero.name}
        </div>
      ))}
    </div>
  ),
}));

const queryClient = new QueryClient();

const renderSearchPage = (initialEntries: string[] = ["/"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <QueryClientProvider client={queryClient}>
        <SearchPage />
      </QueryClientProvider>
    </MemoryRouter>,
  );
};

describe("SearchPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("Should render correctly", () => {
    const { container } = renderSearchPage();

    expect(mockSearchHeroAction).toHaveBeenCalledWith({
      name: undefined,
      strength: undefined,
    });

    expect(container).toMatchSnapshot();
  });

  test("Should call search action with name parameter", () => {
    renderSearchPage(["/search?q=batman"]);

    expect(mockSearchHeroAction).toHaveBeenCalledWith({
      name: "batman",
      strength: undefined,
    });
  });

  test("Should call search action with strength", () => {
    renderSearchPage(["/search?strength=5"]);

    expect(mockSearchHeroAction).toHaveBeenCalledWith({
      name: undefined,
      strength: "5",
    });
  });

  test("Should call search action with name strength & name", () => {
    renderSearchPage(["/search?strength=5&q=batman"]);

    expect(mockSearchHeroAction).toHaveBeenCalledWith({
      name: "batman",
      strength: "5",
    });
  });

  test("Should render HeroGrid with search results", async () => {
    const mockHeroes: Hero[] = [
      {
        id: "1",
        name: "Batman",
      } as unknown as Hero,
      {
        id: "2",
        name: "Superman",
      } as unknown as Hero,
    ];

    mockSearchHeroAction.mockResolvedValueOnce(mockHeroes);

    renderSearchPage();

    await waitFor(() => {
      expect(screen.getByTestId("hero-grid")).toBeDefined();
      expect(screen.getByText("Batman")).toBeDefined();
      expect(screen.getByText("Superman")).toBeDefined();
    });
  });
});
