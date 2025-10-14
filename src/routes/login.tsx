import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "@/utils/auth-client";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div>
      {isSignIn ? (
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();

              authClient.signIn.email({
                email: (e.target as any).email.value,
                password: (e.target as any).password.value,
              });
            }}
          >
            <input type="email" placeholder="Email" name="email" />
            <input type="password" placeholder="Password" name="password" />
            <button type="submit">Sign In</button>
            <p>
              Don't have an account?{" "}
              <button type="button" onClick={() => setIsSignIn(false)}>
                Sign Up
              </button>
            </p>
          </form>
        </div>
      ) : (
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();

              authClient.signUp.email({
                name: (e.target as any).name.value,
                email: (e.target as any).email.value,
                password: (e.target as any).password.value,
              });
            }}
          >
            <input placeholder="Name" name="name" />
            <input type="email" placeholder="Email" name="email" />
            <input type="password" placeholder="Password" name="password" />
            <button type="submit">Sign Up</button>
            <p>
              Already have an account?{" "}
              <button type="button" onClick={() => setIsSignIn(true)}>
                Sign In
              </button>
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
