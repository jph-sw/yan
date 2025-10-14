import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/_pathlessLayout/home')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/_pathlessLayout/home"!</div>
}
