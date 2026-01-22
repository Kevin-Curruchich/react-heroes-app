import { useQuery } from "@tanstack/react-query";
import { getHeroesByPageAction } from "../actions/get-herores-by-page.action";

export const usePaginationHero = (
  page: number,
  limit: number,
  category: string = "all"
) => {
  return useQuery({
    queryKey: ["heroes", category, { page, limit }],
    queryFn: () => getHeroesByPageAction(+page, +limit, category),
    staleTime: 1000 * 60 * 5,
  });
};
