"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { useLogin } from "@/hooks/use-owner-auth"
import { zodResolver } from "@/lib/forms/zod-resolver"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"

const LoginFormSchema = z.object({
  password: z.string().min(1, "Password is required"),
})
type LoginFormValues = z.infer<typeof LoginFormSchema>

export const LoginForm = () => {
  const router = useRouter()
  const login = useLogin()
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: { password: "" },
  })

  useEffect(() => {
    if (login.error) {
      form.setError("root", { message: login.error.message })
    }
  }, [login.error, form])

  const onSubmit = form.handleSubmit((values) => {
    login.mutate(values, {
      onSuccess: () => router.push("/owner/dashboard"),
    })
  })

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm" noValidate>
      <h2 className="font-display text-2xl font-light tracking-tight">
        Sign in
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Enter the studio password.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={!!form.formState.errors.password}
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="text-xs text-destructive">
              {form.formState.errors.password.message}
            </p>
          )}
        </Field>

        {form.formState.errors.root && (
          <p
            role="alert"
            className="border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive"
          >
            {form.formState.errors.root.message}
          </p>
        )}

        <Button type="submit" disabled={login.isPending} className="min-h-11">
          {login.isPending ? "Signing in…" : "Sign in"}
        </Button>
      </div>
    </form>
  )
}
