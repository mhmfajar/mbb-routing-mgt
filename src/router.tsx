import { createBrowserRouter, type RouteObject } from "react-router";

import { MainLayout } from "~/layouts";
import HomePage from "~/pages/Home";

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
    ],
  },
];

// Create and export router
export const router = createBrowserRouter(routes);
