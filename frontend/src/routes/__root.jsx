import { useState, Fragment } from "react";
import { createRootRoute, createRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const Route = createRootRoute({
  component: () => {
    const appHook = useState([]);
    return (
      <Fragment>
        <div>
          <Outlet />
        </div>
        <TanStackRouterDevtools />
        <ReactQueryDevtools />
      </Fragment>
    );
  },
});
