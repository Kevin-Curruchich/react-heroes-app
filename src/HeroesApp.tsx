import { RouterProvider } from "react-router";
import { appRoute } from "./router/app.router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { FavoriteHeroProvider } from "./heroes/context/FavoriteHeroContext";

const queryClient = new QueryClient();

export const HeroesApp = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <FavoriteHeroProvider>
          <RouterProvider router={appRoute} />
          <ReactQueryDevtools initialIsOpen={false} />
        </FavoriteHeroProvider>
      </QueryClientProvider>
    </>
  );
};
