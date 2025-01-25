import { useState, Fragment } from "react";
import { createRootRoute, createRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer, toast } from "react-toastify";
import { AppContext } from "../context/context";

export const Route = createRootRoute({
  component: () => {
    const appHook = useState([]);
    const notify = () => toast.error("This is a toast notification !");
    return (
      <Fragment>
        <AppContext.Provider value={appHook}>
          <div>
            <button onClick={notify}>Notify!</button>
            <Outlet />
            <ToastContainer position="top-left" />
          </div>
        </AppContext.Provider>
        <TanStackRouterDevtools />
        <ReactQueryDevtools />
      </Fragment>
    );
  },
});
