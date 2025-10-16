import { StandardSchemaV1Issue } from "@tanstack/react-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useFieldContext } from "@/utils/form";
import { IconName, IconPicker } from "../ui/icon-picker";

export function IconField({ label }: { label: string }) {
  const field = useFieldContext<string>();

  return (
    <Label className="flex flex-col items-start mt-2">
      {label}
      <IconPicker
        value={field.state.value as IconName}
        onValueChange={(icon) => field.handleChange(icon)}
        className="mt-1"
        categorized={false}
        defaultValue="folder"
      />
      {!field.state.meta.isValid && (
        <p className="text-sm text-red-600">
          {field.state.meta.errors.map((error) => error?.message)}
        </p>
      )}
    </Label>
  );
}
