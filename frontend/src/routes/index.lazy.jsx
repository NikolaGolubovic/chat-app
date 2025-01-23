import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const helloToServer = async () => {
    await fetch("/api/", {
      method: "GET",
    })
      .then(async (response) => {
        const data = await response.text();
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  return (
    <div>
      <button onClick={helloToServer}>Hello to Server</button>
      <Link to="/login">Login</Link>
    </div>
  );
}
