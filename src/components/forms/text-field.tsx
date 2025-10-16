import { StandardSchemaV1Issue } from "@tanstack/react-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useFieldContext } from "@/utils/form";

export function TextField({
  label,
  disabled,
}: {
  label: string;
  disabled?: boolean;
}) {
  const field = useFieldContext<string>();

  return (
    <Label className="flex flex-col items-start">
      {label}
      <Input
        disabled={disabled}
        type="text"
        className="mt-1"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {!field.state.meta.isValid && (
        <p className="text-sm text-red-600">
          {field.state.meta.errors.map((error) => error?.message)}
        </p>
      )}
    </Label>
  );
}
