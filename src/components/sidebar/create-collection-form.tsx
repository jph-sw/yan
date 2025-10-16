import { useAppForm } from "@/utils/form";
import z from "zod";
import { Button } from "../ui/button";
import { createCollection } from "@/utils/data/collections";
import { useQueryClient } from "@tanstack/react-query";

export function CreateCollectionForm({
  closeDialog,
}: {
  closeDialog: () => void;
}) {
  const queryClient = useQueryClient();

  const form = useAppForm({
    defaultValues: {
      name: "",
      icon: "",
    },
    validators: {
      onChange: z.object({
        name: z.string().min(1, "Name is required"),
        icon: z.string(),
      }),
    },
    onSubmit: async ({ value }) => {
      console.log("submitting", value);
      await createCollection({ data: { name: value.name, icon: value.icon } });
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      closeDialog();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.AppField
        name="name"
        children={(field) => <field.TextField label="Name" />}
        validators={{
          onChange: z
            .string()
            .min(1, "Name is required")
            .max(100, "Name is too long"),
        }}
      />
      <form.AppField
        name="icon"
        children={(field) => <field.IconField label="Icon" />}
      />
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <>
            <Button className="mt-4" type="submit" disabled={!canSubmit}>
              {isSubmitting ? "..." : "Submit"}
            </Button>
          </>
        )}
      />
    </form>
  );
}
