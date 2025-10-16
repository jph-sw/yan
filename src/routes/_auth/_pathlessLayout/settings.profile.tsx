import { EditProfileForm } from "@/components/forms/edit-profile-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthQueries } from "@/utils/data/auth-queries";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/_pathlessLayout/settings/profile")(
  {
    component: RouteComponent,
    loader: async ({ context }) => {
      const userSession = await context.queryClient.fetchQuery(
        useAuthQueries.user()
      );

      return {
        user: userSession?.user,
      };
    },
  }
);

function RouteComponent() {
  const { user } = Route.useLoaderData();

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <EditProfileForm user={user!} />
        </CardContent>
      </Card>
    </div>
  );
}
