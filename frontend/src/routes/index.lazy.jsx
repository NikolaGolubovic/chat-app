import { createLazyFileRoute, Link } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div>
      <p>Hello</p>
      <Link to="/login">Login</Link>
    </div>
  );
}
