import { MemoryRouter } from "react-router";
import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import CustomPagination from "./CustomPagination";
import type { PropsWithChildren } from "react";

vi.mock("../ui/button", () => ({
  Button: ({ children, ...props }: PropsWithChildren) => (
    <button {...props}>{children}</button>
  ),
}));

const renderWithRouter = (
  component: React.ReactElement,
  initialEntries?: string[],
) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>{component}</MemoryRouter>,
  );
};

describe("CustomPagination", () => {
  test("Should render component with default values", () => {
    renderWithRouter(<CustomPagination totalPages={10} />);

    expect(screen.getByText("Previous")).toBeDefined();
    expect(screen.getByText("Next")).toBeDefined();

    expect(screen.getByText("1")).toBeDefined();
    expect(screen.getByText("10")).toBeDefined();
  });

  test("Should disabled previous button when page is 1", () => {
    renderWithRouter(<CustomPagination totalPages={10} />);

    const previousButton = screen.getByText("Previous");
    expect(previousButton.getAttributeNames()).toContain("disabled");
  });

  test("Should disabled next button when we are in the last page", () => {
    renderWithRouter(<CustomPagination totalPages={10} />, ["/?page=10"]);

    const nextButton = screen.getByText("Next");
    expect(nextButton.getAttributeNames()).toContain("disabled");
  });

  test("Should disabled button 3 when we are in page 3", () => {
    renderWithRouter(<CustomPagination totalPages={10} />, ["/?page=3"]);

    const buttonThree = screen.getByText("3");
    expect(buttonThree.getAttribute("variant")).toBe("default");
  });

  test("Should change page when clikc on numbet button", () => {
    renderWithRouter(<CustomPagination totalPages={10} />, ["/?page=3"]);

    const buttonThree = screen.getByText("3");
    expect(buttonThree.getAttribute("variant")).toBe("default");

    const buttonFive = screen.getByText("5");
    fireEvent.click(buttonFive);

    expect(buttonFive.getAttribute("variant")).toBe("default");
    expect(buttonThree.getAttribute("variant")).toBe("outline");
  });
});
