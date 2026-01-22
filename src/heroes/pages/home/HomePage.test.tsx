import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { HomePage } from "./HomePage";
import { MemoryRouter } from "react-router";
import { usePaginationHero } from "@/heroes/hooks/usePaginationHero";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FavoriteHeroProvider } from "@/heroes/context/FavoriteHeroContext";

vi.mock("@/heroes/hooks/usePaginationHero");

const mockUsePaginatedHero = vi.mocked(usePaginationHero);

mockUsePaginatedHero.mockReturnValue({
  data: {
    total: 100,
    pages: 20,
    heroes: [],
  },
  isLoading: false,
  isError: false,
  error: null,
  isPending: false,
  isLoadingError: false,
  isRefetchError: false,
  isSuccess: true,
  status: "success",
  fetchStatus: "idle",
} as unknown as ReturnType<typeof usePaginationHero>);

const queryClient = new QueryClient();

const renderHomePage = (initialEntries: string[] = ["/?"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <FavoriteHeroProvider>
        <QueryClientProvider client={queryClient}>
          <HomePage />
        </QueryClientProvider>
      </FavoriteHeroProvider>
    </MemoryRouter>,
  );
};

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("Shoul render HomePage with default values", () => {
    const { container } = renderHomePage();

    expect(container).toMatchSnapshot();
  });

  test("Should call usePaginatedHero with default values", () => {
    renderHomePage();

    expect(mockUsePaginatedHero).toHaveBeenCalledWith(1, 5, "all");
  });

  test("Should call usePaginatedHero with custom values", () => {
    renderHomePage(["/?page=2&limit=10&category=villains"]);

    expect(mockUsePaginatedHero).toHaveBeenCalledWith(2, 10, "villains");
  });

  test("Should called usePaginateHero with default page and same limit on tab", () => {
    renderHomePage(["/?tab=favorites&page2&limit=10"]);

    const [, , , villainsTab] = screen.getAllByRole("tab");

    fireEvent.click(villainsTab);

    expect(mockUsePaginatedHero).toHaveBeenCalledWith(1, 10, "villain");
  });
});
