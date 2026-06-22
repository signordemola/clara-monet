"use client"

import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import { useSignContract } from "@/hooks/use-booking"
import { zodResolver } from "@/lib/forms/zod-resolver"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldLabel } from "@/components/ui/field"

const ContractSignFormSchema = z.object({
  typedName: z.string().min(2, "Please type your full name"),
  gdprConsent: z.boolean().refine((v) => v === true, {
    message: "You must consent to data storage",
  }),
  modelRelease: z.boolean(),
  termsAgreed: z.boolean().refine((v) => v === true, {
    message: "You must agree to the terms",
  }),
})

type ContractSignValues = z.infer<typeof ContractSignFormSchema>

export const ContractSignForm = ({
  bookingToken,
}: {
  bookingToken: string
}) => {
  const sign = useSignContract()
  const form = useForm<ContractSignValues>({
    resolver: zodResolver(ContractSignFormSchema),
    defaultValues: {
      typedName: "",
      gdprConsent: false,
      modelRelease: false,
      termsAgreed: false,
    },
  })

  const gdprConsent = useWatch({ control: form.control, name: "gdprConsent" })
  const modelRelease = useWatch({ control: form.control, name: "modelRelease" })
  const termsAgreed = useWatch({ control: form.control, name: "termsAgreed" })

  const onSubmit = form.handleSubmit((values) => {
    sign.mutate({ bookingToken, ...values })
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <Field>
        <FieldLabel htmlFor="typedName">Type your full name</FieldLabel>
        <Input
          id="typedName"
          placeholder="This is your electronic signature"
          {...form.register("typedName")}
        />
        {form.formState.errors.typedName && (
          <p className="text-xs text-destructive">
            {form.formState.errors.typedName.message}
          </p>
        )}
      </Field>

      <label htmlFor="gdprConsent" className="flex items-start gap-3 text-sm">
        <Checkbox
          id="gdprConsent"
          checked={gdprConsent}
          onCheckedChange={(v) => form.setValue("gdprConsent", v === true)}
        />
        <span>
          I consent to my data being stored for the purpose of this booking.
          Clara may contact me about this session.
        </span>
      </label>
      {form.formState.errors.gdprConsent && (
        <p className="text-xs text-destructive">
          {form.formState.errors.gdprConsent.message}
        </p>
      )}

      <label htmlFor="modelRelease" className="flex items-start gap-3 text-sm">
        <Checkbox
          id="modelRelease"
          checked={modelRelease}
          onCheckedChange={(v) => form.setValue("modelRelease", v === true)}
        />
        <span>
          I am happy for images to be used in Clara&apos;s portfolio and social
          media.
        </span>
      </label>

      <label htmlFor="termsAgreed" className="flex items-start gap-3 text-sm">
        <Checkbox
          id="termsAgreed"
          checked={termsAgreed}
          onCheckedChange={(v) => form.setValue("termsAgreed", v === true)}
        />
        <span>I have read and agree to the terms of this agreement.</span>
      </label>
      {form.formState.errors.termsAgreed && (
        <p className="text-xs text-destructive">
          {form.formState.errors.termsAgreed.message}
        </p>
      )}

      <Button type="submit" disabled={sign.isPending}>
        {sign.isPending ? "Signing…" : "Sign and continue to payment"}
      </Button>
    </form>
  )
}
