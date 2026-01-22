import { describe, expect, test, vi } from "vitest";
import { appRoute } from "./app.router";
import { render, screen } from "@testing-library/react";
import {
  createMemoryRouter,
  Outlet,
  RouterProvider,
  useParams,
} from "react-router";

vi.mock("@/heroes/pages/home/HomePage", () => ({
  HomePage: () => <div data-testid="home-page">Hero Page Mock</div>,
}));

vi.mock("@/heroes/pages/hero/HeroPage", () => ({
  HeroPage: () => {
    const { idSlug = "" } = useParams();

    return (
      <div data-testid="hero-page">
        <h1>Hero Page Mock</h1>
        <span data-testid="hero-id-slug">{idSlug}</span>
      </div>
    );
  },
}));

vi.mock("@/heroes/pages/search/SearchPage", () => ({
  default: () => <div data-testid="search-page">Search Page</div>,
}));

vi.mock("@/heroes/layouts/HeroesLayout", () => ({
  HeroesLayout: () => (
    <div>
      <h1>Heroes Layout Mock</h1>
      <Outlet />
    </div>
  ),
}));

describe("App Router", () => {
  test("Should be configured as expected", () => {
    expect(appRoute.routes).toMatchSnapshot();
  });

  test("Should render home page at root path", () => {
    const router = createMemoryRouter(appRoute.routes, {
      initialEntries: ["/"],
    });

    render(<RouterProvider router={router} />);

    const homePage = screen.getByTestId("home-page");
    expect(homePage).toBeDefined();
  });

  test("Should render hero page at /heroes/superman", () => {
    const router = createMemoryRouter(appRoute.routes, {
      initialEntries: ["/heroes/superman"],
    });

    render(<RouterProvider router={router} />);

    const homePage = screen.getByTestId("hero-page");
    expect(homePage).toBeDefined();

    const idSlug = screen.getByTestId("hero-id-slug");
    expect(idSlug.textContent).toBe("superman");
  });

  test("Should render search page at /search", async () => {
    const router = createMemoryRouter(appRoute.routes, {
      initialEntries: ["/search"],
    });

    render(<RouterProvider router={router} />);

    expect(await screen.findByText("Search Page")).toBeDefined();
    expect(screen.getByTestId("search-page")).toBeDefined();
  });

  test("Should render to home page for unknow routes", async () => {
    const router = createMemoryRouter(appRoute.routes, {
      initialEntries: ["/search-testing"],
    });

    render(<RouterProvider router={router} />);

    const homePage = screen.getByTestId("home-page");
    expect(homePage).toBeDefined();
  });
});
