import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useAuthQueries } from "@/utils/data/auth-queries";
import { Link, Outlet } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { SettingsIcon, UserIcon, UsersIcon } from "lucide-react";

export const Route = createFileRoute("/_auth/_pathlessLayout/settings")({
  component: RouteComponent,
  loader: async ({ context }) => {
    const userSession = await context.queryClient.fetchQuery(
      useAuthQueries.user()
    );

    return {
      user: userSession?.user,
    };
  },
});

function RouteComponent() {
  const { user } = Route.useLoaderData();

  const items = [
    { name: "Profile", to: "/settings/profile", icon: UserIcon },
    ...(user?.role === "admin"
      ? [
          { name: "General", to: "/settings/general", icon: SettingsIcon },
          { name: "Users", to: "/settings/users", icon: UsersIcon },
        ]
      : []),
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-semibold mb-4">Settings</h1>
      <div className="w-full flex">
        <div className="flex flex-col gap-2 w-1/5">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <SidebarMenuButton asChild key={item.name}>
                <Link to={item.to}>
                  <Icon />
                  {item.name}
                </Link>
              </SidebarMenuButton>
            );
          })}
        </div>
        <div className="w-4/5 ps-4">{<Outlet />}</div>
      </div>
    </div>
  );
}
