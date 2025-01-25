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
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/");
        if (response.ok) {
          const data = await response.json();
          console.log(data.user);
        } else {
          console.error("Failed to fetch user");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);
  return (
    <div>
      <button onClick={helloToServer}>Hello to Server</button>
      <Link to="/login">Login</Link>
    </div>
  );
}
