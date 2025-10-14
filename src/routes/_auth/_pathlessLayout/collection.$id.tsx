import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_pathlessLayout/collection/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/collection/$id"!</div>;
}
