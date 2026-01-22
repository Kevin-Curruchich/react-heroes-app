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
    const mockSummaryData = {
      totalHeroes: 150,
      strongesthero: {
        id: "hero_001",
        name: "MightyMax",
      },
      smartesthero: {
        id: "hero_002",
        name: "BrainyBeth",
      },
      heroCount: 18,
      villainCount: 7,
    };

    mockGetSummaryAction.mockResolvedValue(
      mockSummaryData as SummaryInformationResponse
    );

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
