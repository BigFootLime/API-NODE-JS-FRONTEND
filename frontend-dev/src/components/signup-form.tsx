import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, RegisterSchema } from "@/lib/schema/register.schema"
import { useRegister } from "@/hooks/useRegister"
import { CustomInput } from "./CustomInput"

export default function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  })

  const { mutate: registerUser, isLoading } = useRegister(() => reset())

  const onSubmit = (data: RegisterSchema) => {
    registerUser(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Fill the form below to register in CRP Vault
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <CustomInput label="Username" id="username" {...register("username")} error={errors.username?.message}/>
        </div>
        <div className="grid gap-2">
        <CustomInput label="FirstName" id="name" {...register("name")} error={errors.name?.message}/>
        </div>
        <div className="grid gap-2">
        <CustomInput label="Surname" id="surname" {...register("surname")} error={errors.surname?.message}/>
        </div>
        <div className="grid gap-2">
        <CustomInput label="age" type="number" id="age" {...register("age")} error={errors.age?.message}/>
        </div>
        <div className="grid gap-2">
        <CustomInput label="Email" id="email" {...register("email")} error={errors.email?.message}/>
        </div>
        <div className="grid gap-2">
        <CustomInput label="Password" type="password" id="password" {...register("password")} error={errors.password?.message}/>
        </div>
        <div className="grid gap-2">
        <CustomInput label="Departement" id="department" {...register("department")} error={errors.department?.message}/>
        </div>
        <div className="grid gap-2">
        <CustomInput label="Phone" id="phone" {...register("phone")} error={errors.phone?.message}/>
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create account"}
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{' '}
        <a href="/login" className="underline underline-offset-4">
          Log in
        </a>
      </div>
    </form>
  )
}
