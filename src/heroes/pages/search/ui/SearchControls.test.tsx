import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { SearchControls } from "./SearchControls";
const queryClient = new QueryClient();

if (typeof window.ResizeObserver === "undefined") {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserver;
}

const renderSearchPage = (initialEntries: string[] = ["/"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <QueryClientProvider client={queryClient}>
        <SearchControls />
      </QueryClientProvider>
    </MemoryRouter>,
  );
};

describe("SearchControls", () => {
  test("should render SearchControls with default values", () => {
    const { container } = renderSearchPage();

    expect(container).toMatchSnapshot();
    // screen.debug();
  });

  test('Should set input value from query param "q"', () => {
    renderSearchPage(["/?q=batman"]);

    const input = screen.getByPlaceholderText(
      "Search heroes, villains, powers, teams...",
    ) as HTMLInputElement;

    expect(input.value).toBe("batman");
  });

  test("Should change param when input is change and enter is pressed", () => {
    renderSearchPage(["/?q=batman"]);

    const input = screen.getByPlaceholderText(
      "Search heroes, villains, powers, teams...",
    );

    expect(input.getAttribute("value")).toBe("batman");

    fireEvent.change(input, { target: { value: "superman" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    expect(input.getAttribute("value")).toBe("superman");
  });

  test("Should change params strength when sliders is changed", () => {
    renderSearchPage(["/?q=batman&active-accordion=advanced-filters"]);

    const slider = screen.getByRole("slider");

    expect(slider).toBeDefined();
    expect(slider.getAttribute("aria-valuenow")).toBe("0");

    fireEvent.keyDown(slider, { key: "ArrowRight" });

    expect(slider.getAttribute("aria-valuenow")).toBe("1");
  });

  test("Sholud accordiin be open when active-accordion param is set", () => {
    renderSearchPage(["/?q=batman&active-accordion=advanced-filters"]);

    const accordion = screen.getByTestId("advanced-filters-accordion");
    const accordionItem = accordion.querySelector("div");

    expect(accordion).toBeDefined();
    expect(accordionItem?.getAttribute("data-state")).toBe("open");
  });
});
