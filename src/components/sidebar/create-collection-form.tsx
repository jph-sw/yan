import { useAppForm } from "@/utils/form";
import z from "zod";
import { Button } from "../ui/button";
import { createCollection } from "@/utils/data/collections";

export function CreateCollectionForm() {
  const form = useAppForm({
    defaultValues: {
      name: "",
    },
    validators: {
      onChange: z.object({
        name: z.string().min(1, "Name is required"),
      }),
    },
    onSubmit: async ({ value }) => {
      await createCollection({ data: { name: value.name } });
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
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <>
            <Button className="mt-2" type="submit" disabled={!canSubmit}>
              {isSubmitting ? "..." : "Submit"}
            </Button>
          </>
        )}
      />
    </form>
  );
}
