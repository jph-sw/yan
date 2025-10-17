import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

export const Route = createFileRoute("/error")({
  component: RouteComponent,
  validateSearch: z.object({
    code: z.string().min(1, "code is required"),
  }),
});

const erros: { code: string; message: string }[] = [
  {
    code: "no_role",
    message:
      "This user is not member of required discord server or does not have the required role",
  },
];

function RouteComponent() {
  const { code } = Route.useSearch();

  return (
    <div className="w-full h-dvh flex justify-center pt-50">
      <Card className="h-30 border-red-600 bg-red-500">
        <CardHeader>
          <CardTitle>An error has occured</CardTitle>
        </CardHeader>
        <CardContent>
          {erros.filter((error) => error.code === code)[0].message}
        </CardContent>
      </Card>
    </div>
  );
}
