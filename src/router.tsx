import { createBrowserRouter, type RouteObject } from "react-router";

import { MainLayout } from "~/layouts";
import HomePage from "~/pages/Home";
import NotFoundPage from "~/pages/NotFound";

// Route configuration
const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
];

// Create and export router
export const router = createBrowserRouter(routes);
