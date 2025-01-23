import { createLazyFileRoute, createRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import Cookies from "js-cookie";

export const Route = createLazyFileRoute("/login")({
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const handleLogin = async () => {
    const response = await fetch("/api/auth/google/callback", {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      navigate({
        to: "/",
      });
    } else {
      console.error("Login failed");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "GET",
        credentials: "include", // Include cookies in the request
      });
      if (response.ok) {
        // Redirect to the login page or home page after successful logout
        console.log(".......");
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
