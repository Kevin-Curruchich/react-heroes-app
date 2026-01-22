import { createHashRouter, Navigate } from "react-router";
import { HomePage } from "../heroes/pages/home/HomePage";
import { HeroPage } from "../heroes/pages/hero/HeroPage";
// import { SearchPage } from "../heroes/pages/search/SearchPage";
import { AdminPage } from "../admin/pages/AdminPage";
import { HeroesLayout } from "../heroes/layouts/HeroesLayout";
import { AdminLayout } from "../heroes/layouts/AdminLayout";
import { lazy } from "react";

const SearchPage = lazy(() => import("../heroes/pages/search/SearchPage"));

// export const appRoute = createBrowserRouter([
export const appRoute = createHashRouter([
  {
    path: "/",
    element: <HeroesLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "heroes/:idSlug",
        element: <HeroPage />,
      },
      {
        path: "search",
        element: <SearchPage />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminPage />,
      },
    ],
  },
]);
