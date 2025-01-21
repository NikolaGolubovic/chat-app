import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/login")({
  component: Login,
});

function Login() {
  const handleLogin = () => {
    window.location.href = "http://localhost:3000/auth/google"; // Adjust the URL to your backend endpoint
  };

  return <button onClick={handleLogin}>Login with Google</button>;
}
