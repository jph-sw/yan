import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { ImageField } from "@/components/forms/image-field";
import { SubscribeButton } from "@/components/forms/subscribe-button";
import { TextField } from "@/components/forms/text-field";

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
