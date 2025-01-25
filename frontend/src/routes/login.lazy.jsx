import { createLazyFileRoute, createRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

export const Route = createLazyFileRoute("/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      window.location.href = "http://localhost:3000/auth/google";
      const notify = () => toast.info("This is a toast notification !");
      notify();
      navigate({
        to: "/",
      });
    } catch (error) {
      const notify = () => toast.error("This is a toast notification !");
      notify();
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        Cookies.remove("jwt");
        Cookies.remove("connect.sid");
        navigate({
          to: "/",
        });
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div>
      <button onClick={handleLogin}>Login with Google</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
