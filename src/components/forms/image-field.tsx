import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useFieldContext } from "@/utils/form";

export function ImageField({
  label,
  disabled,
}: {
  label: string;
  disabled?: boolean;
}) {
  const field = useFieldContext<string>();

  const updateHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        field.handleChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Label className="flex flex-col items-start gap-2 mb-4">
      {label}
      <div className="flex gap-4 items-center">
        {field.state.value && (
          <img
            src={field.state.value}
            alt="Preview"
            className="mt-2 rounded-full max-w-[100px] max-h-[100px] border"
          />
        )}
        <Input
          id="profile-image-upload"
          type="file"
          accept="image/*"
          onChange={updateHandler}
          disabled={disabled}
        />
      </div>
      {!field.state.meta.isValid && (
        <p className="text-sm text-red-600">
          {field.state.meta.errors.map((error) => error?.message).join(", ")}
        </p>
      )}
    </Label>
  );
}
