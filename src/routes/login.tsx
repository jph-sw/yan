import { createFileRoute } from "@tanstack/react-router";
import { authClient } from "@/utils/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card>
        <CardContent>
          <Button
            onClick={() => authClient.signIn.social({ provider: "discord" })}
          >
            Sign in
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
