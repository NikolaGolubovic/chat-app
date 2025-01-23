import { useState, Fragment } from "react";
import { createRootRoute, createRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AppContext } from "../context/context";

export const Route = createRootRoute({
  component: () => {
    const appHook = useState([]);
    return (
      <Fragment>
        {/* <AppContext value={appHook}> */}
        <div>
          <Outlet />
        </div>
        {/* </AppContext> */}
        <TanStackRouterDevtools />
        <ReactQueryDevtools />
      </Fragment>
    );
  },
});
