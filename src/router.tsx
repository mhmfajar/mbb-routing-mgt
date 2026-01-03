import { createBrowserRouter, type RouteObject } from "react-router";

import { MainLayout } from "~/layouts";
import { Home as HomePage } from "~/pages/home";
import { NotFound as NotFoundPage } from "~/pages/not-found";

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
