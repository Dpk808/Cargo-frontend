import { Controller, useFormContext } from "react-hook-form";
import { FormItem } from "./FormItem";
import Label from "../ui/Label";
import { FormMessage } from "./FormMessage";

interface FormFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  children: (field: any) => React.ReactElement;
  className?: string;
}

export function FormField({
  name,
  label,
  required,
  children,
  className,
}: FormFieldProps) {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <FormItem className={className}>
      {label && (
        <div className="flex items-center gap-2">
          <Label htmlFor={name} required={required}>
            {label}
          </Label>
          <FormMessage message={error} />
        </div>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => children(field)}
      />
    </FormItem>
  );
}