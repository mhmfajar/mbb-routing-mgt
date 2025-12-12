import { lazy, Suspense, type ReactNode } from "react";
import { createBrowserRouter, type RouteObject } from "react-router";

import { MainLayout } from "~/layouts";

// Lazy load pages for code splitting
const HomePage = lazy(() => import("~/pages/Home"));
const AboutPage = lazy(() => import("~/pages/About"));
const NotFoundPage = lazy(() => import("~/pages/NotFound"));

// Suspense wrapper for lazy loaded components
const withSuspense = (
  component: ReactNode,
  fallback: ReactNode = <div>Loading...</div>
) => <Suspense fallback={fallback}>{component}</Suspense>;

// Route configuration
const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: withSuspense(<HomePage />),
      },
      {
        path: "about",
        element: withSuspense(<AboutPage />),
      },
      {
        path: "*",
        element: withSuspense(<NotFoundPage />),
      },
    ],
  },
];

// Create and export router
export const router = createBrowserRouter(routes);
