import { useAppForm } from "@/utils/form";
import { User } from "better-auth";
import { Button } from "../ui/button";
import { authClient } from "@/utils/auth-client";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { CircleQuestionMarkIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export function EditProfileForm({ user }: { user: User }) {
  const queryClient = useQueryClient();

  const form = useAppForm({
    defaultValues: user,
    onSubmit: async (values) => {
      await authClient.updateUser({
        name: values.value.name,
      });

      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
    },
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <div className="grid grid-cols-2 gap-4">
        <form.AppField
          name="name"
          children={(field) => <field.TextField label="Name" />}
        />
        <Label className="flex flex-col items-start">
          <span className="flex items-center">
            Email
            <Tooltip>
              <TooltipTrigger>
                <CircleQuestionMarkIcon className="h-3 w-3 ms-1" />
              </TooltipTrigger>
              <TooltipContent>
                Email cannot be changed at this time.
              </TooltipContent>
            </Tooltip>
          </span>
          <Input
            disabled
            type="text"
            defaultValue={user.email}
            className="mt-1"
          />
        </Label>
      </div>
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <>
            <Button className="mt-4" type="submit" disabled={!canSubmit}>
              {isSubmitting ? "..." : "Update Profile"}
            </Button>
          </>
        )}
      />
    </form>
  );
}
