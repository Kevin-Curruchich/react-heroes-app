import { heroApi } from "../api/hero.api";
import type { HeroesResponse } from "../types/get-heroes.response";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getHeroesByPageAction = async (
  page: number,
  limit: number = 5,
  category: string,
): Promise<HeroesResponse> => {
  if (isNaN(page) || page < 1) {
    page = 1;
  }

  if (isNaN(limit) || limit < 1) {
    limit = 5;
  }

  const { data } = await heroApi.get<HeroesResponse>("/", {
    params: {
      limit,
      offset: (page - 1) * limit,
      category: category,
    },
  });

  const heroes = data.heroes.map((hero) => ({
    ...hero,
    image: `${BASE_URL}/images/${hero.id}.jpeg`,
  }));

  return {
    ...data,
    heroes,
  };
};
