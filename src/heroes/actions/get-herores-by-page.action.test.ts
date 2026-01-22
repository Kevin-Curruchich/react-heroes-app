import { beforeEach, describe, expect, test } from "vitest";
import AxiosMockAdapter from "axios-mock-adapter";
import { heroApi } from "../api/hero.api";
import { getHeroesByPageAction } from "./get-herores-by-page.action";

const VITE_API_URL = import.meta.env.VITE_API_URL;

describe("GetHeroesByPageAction", () => {
  const heroesApiMock = new AxiosMockAdapter(heroApi);

  beforeEach(() => {
    heroesApiMock.reset();
  });

  test("Should return default heroes", async () => {
    heroesApiMock.onGet("/").reply(200, {
      total: 10,
      pages: 2,
      heroes: [
        {
          id: "1",
          image: "1.jpg",
        },
      ],
    });

    const response = await getHeroesByPageAction(1, 5, "all");
    expect(response).toStrictEqual({
      total: 10,
      pages: 2,
      heroes: [
        {
          id: "1",
          image: `${VITE_API_URL}/images/1.jpeg`,
        },
      ],
    });
  });

  test("Should return the correct heroes when page is not a number", async () => {
    const responseObject = {
      total: 10,
      pages: 2,
      heroes: [],
    };

    heroesApiMock.onGet("/").reply(200, responseObject);
    heroesApiMock.resetHistory();

    const response = await getHeroesByPageAction(
      "abc" as unknown as number,
      5,
      "all"
    );

    const request = heroesApiMock.history.get[0];

    expect(response).toBeDefined();
    expect(request.params).toStrictEqual({
      offset: 0,
      limit: 5,
      category: "all",
    });
  });

  test("Should return the correct heroes when page is number", async () => {
    const responseObject = {
      total: 10,
      pages: 2,
      heroes: [],
    };

    heroesApiMock.onGet("/").reply(200, responseObject);
    heroesApiMock.resetHistory();

    const response = await getHeroesByPageAction(2, 5, "all");

    const request = heroesApiMock.history.get[0];

    expect(response).toBeDefined();
    expect(request.params).toStrictEqual({
      offset: 5,
      limit: 5,
      category: "all",
    });
  });
});
