import type { PropsWithChildren } from "react";
import { describe, expect, test, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useHeroSummary } from "./useHeroSummary";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getSummaryAction } from "../actions/get-summary-action";
import type { SummaryInformationResponse } from "../types/summary-information.response";

vi.mock("../actions/get-summary-action", () => ({
  getSummaryAction: vi.fn(),
}));

const mockGetSummaryAction = vi.mocked(getSummaryAction);

const tanStackCustomProvider = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useHeroSummary", () => {
  test("Should return the initial state (isLoading)", () => {
    const { result } = renderHook(() => useHeroSummary(), {
      wrapper: tanStackCustomProvider(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();
  });

  test("Should return success state with data when API call success", async () => {
    const mockSummaryData: SummaryInformationResponse = {
      totalHeroes: 150,
      strongestHero: {
        id: "hero_001",
        name: "MightyMax",
        slug: "mighty-max",
        alias: "MightyMax",
        powers: ["Super Strength"],
        description: "The strongest hero",
        strength: 10,
        intelligence: 5,
        speed: 5,
        durability: 10,
        team: "Heroes United",
        image: "mighty.jpg",
        firstAppearance: "2020",
        status: "Active",
        category: "Hero",
        universe: "Test Universe",
      },
      smartestHero: {
        id: "hero_002",
        name: "BrainyBeth",
        slug: "brainy-beth",
        alias: "BrainyBeth",
        powers: ["Genius Intellect"],
        description: "The smartest hero",
        strength: 3,
        intelligence: 10,
        speed: 5,
        durability: 5,
        team: "Heroes United",
        image: "brainy.jpg",
        firstAppearance: "2020",
        status: "Active",
        category: "Hero",
        universe: "Test Universe",
      },
      heroCount: 18,
      villainCount: 7,
    };

    mockGetSummaryAction.mockResolvedValue(mockSummaryData);

    const { result } = renderHook(() => useHeroSummary(), {
      wrapper: tanStackCustomProvider(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toStrictEqual(mockSummaryData);
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.data).toBeDefined();
    expect(result.current.error).toBeNull();
  });

  test("should return error state when API call fails", async () => {
    const mockError = new Error("Failed to fetch summary data");

    mockGetSummaryAction.mockRejectedValue(mockError);

    const { result } = renderHook(() => useHeroSummary(), {
      wrapper: tanStackCustomProvider(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.error).toBe(mockError);
  });
});
