import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/forms/text-field";
import { SubscribeButton } from "@/components/forms/subscribe-button";
import { IconField } from "@/components/forms/icon-field";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
    IconField,
  },
  formComponents: {
    SubscribeButton,
  },
  fieldContext,
  formContext,
});
