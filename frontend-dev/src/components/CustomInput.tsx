import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface CustomInputProps extends React.ComponentProps<"input"> {
  label: string
  name: string
  error?: string
  axiosError?: boolean
  classNameWrapper?: string
}

export const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ label, name, error, axiosError, className, classNameWrapper, ...props }, ref) => {
    const isError = !!error || axiosError

    return (
      <div className={cn("grid gap-1.5", classNameWrapper)}>
        <Label
          htmlFor={name}
          className={cn(isError && "text-destructive")}
        >
          {label}
        </Label>
        <Input
          id={name}
          name={name}
          ref={ref}
          aria-invalid={isError}
          className={cn(
            isError &&
              "border-destructive ring-destructive/50 focus-visible:ring-destructive",
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    )
  }
)

CustomInput.displayName = "CustomInput"