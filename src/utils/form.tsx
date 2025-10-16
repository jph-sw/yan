import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/forms/text-field";
import { SubscribeButton } from "@/components/forms/subscribe-button";
import { ImageField } from "@/components/forms/image-field";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    ImageField,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
});
