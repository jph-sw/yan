import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "@/utils/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isSignIn, setIsSignIn] = useState(true);

  const navigate = Route.useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            {isSignIn ? "Welcome back" : "Create an account"}
          </h2>
          <p className="text-muted-foreground mt-2">
            {isSignIn
              ? "Enter your credentials to access your account"
              : "Sign up to get started with doitwrite"}
          </p>
        </div>

        {isSignIn ? (
          <div className="space-y-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();

                authClient.signIn.email({
                  email: (e.target as any).email.value,
                  password: (e.target as any).password.value,
                });
                navigate({ to: "/home" });
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  name="email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  name="password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
            <div className="text-center text-sm">
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Button
                  variant="link"
                  className="text-primary"
                  onClick={() => setIsSignIn(false)}
                >
                  Sign Up
                </Button>
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();

                authClient.signUp.email({
                  name: (e.target as any).name.value,
                  email: (e.target as any).email.value,
                  password: (e.target as any).password.value,
                });
                navigate({ to: "/home" });
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="John Doe" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  name="email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  name="password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </form>
            <div className="text-center text-sm">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Button
                  variant="link"
                  className="text-primary"
                  onClick={() => setIsSignIn(true)}
                >
                  Sign In
                </Button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
