"use client"

import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import { useEffect } from "react"
import { toast } from "sonner"
import { zodResolver } from "@/lib/forms/zod-resolver"
import { useApproveInquiry, useDeclineInquiry } from "@/hooks/use-inquiries"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Badge } from "@/components/ui/badge"

const ApproveFormSchema = z.object({
  sessionTypeId: z.string().min(1, "Pick a session"),
  sessionDate: z.string().optional(),
  sessionLocation: z.string().optional(),
  ownerMessage: z.string().optional(),
})
type ApproveFormValues = z.infer<typeof ApproveFormSchema>

const DeclineFormSchema = z.object({
  declineReason: z.string().optional(),
})
type DeclineFormValues = z.infer<typeof DeclineFormSchema>

type SessionTypeOption = {
  id: string
  name: string
  duration: number
  price: number
}

type InquiryActionsProps = {
  inquiryId: string
  status: "NEW" | "REVIEWED" | "APPROVED" | "BOOKED" | "DECLINED"
  sessionTypeOptions: SessionTypeOption[]
  defaultSessionTypeId?: string
  defaultDate?: string
}

export const InquiryActions = ({
  inquiryId,
  status,
  sessionTypeOptions,
  defaultSessionTypeId,
  defaultDate,
}: InquiryActionsProps) => {
  if (status !== "NEW") {
    return (
      <div className="flex items-center gap-3 border border-hairline bg-paper-warm p-5">
        <span className="text-[10px] font-medium tracking-[0.24em] text-ink/60 uppercase">
          Status
        </span>
        <Badge variant="secondary">{status.toLowerCase()}</Badge>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <ApproveCard
        inquiryId={inquiryId}
        sessionTypeOptions={sessionTypeOptions}
        defaultSessionTypeId={defaultSessionTypeId}
        defaultDate={defaultDate}
      />
      <DeclineCard inquiryId={inquiryId} />
    </div>
  )
}

type ApproveCardProps = {
  inquiryId: string
  sessionTypeOptions: SessionTypeOption[]
  defaultSessionTypeId?: string
  defaultDate?: string
}

const ApproveCard = ({
  inquiryId,
  sessionTypeOptions,
  defaultSessionTypeId,
  defaultDate,
}: ApproveCardProps) => {
  const approve = useApproveInquiry()
  const form = useForm<ApproveFormValues>({
    resolver: zodResolver(ApproveFormSchema),
    defaultValues: {
      sessionTypeId: defaultSessionTypeId ?? sessionTypeOptions[0]?.id ?? "",
      sessionDate: defaultDate ?? "",
      sessionLocation: "",
      ownerMessage: "",
    },
  })
  const sessionTypeId = useWatch({
    control: form.control,
    name: "sessionTypeId",
  })

  useEffect(() => {
    if (approve.error) {
      toast.error(approve.error.message)
    }
  }, [approve.error])

  const onSubmit = form.handleSubmit((values) => {
    approve.mutate({
      inquiryId,
      sessionTypeId: values.sessionTypeId,
      sessionDate: values.sessionDate || undefined,
      sessionLocation: values.sessionLocation || undefined,
      ownerMessage: values.ownerMessage || undefined,
    })
  })

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 border border-hairline bg-card p-5"
    >
      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-lg font-light tracking-tight">
          Approve & send booking link
        </h3>
        <span className="text-[10px] font-medium tracking-[0.24em] text-clay uppercase">
          Approve
        </span>
      </div>

      <Field>
        <FieldLabel>Session</FieldLabel>
        <Select
          value={sessionTypeId ?? ""}
          onValueChange={(v) => v && form.setValue("sessionTypeId", v)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a session" />
          </SelectTrigger>
          <SelectContent>
            {sessionTypeOptions.map((opt) => (
              <SelectItem key={opt.id} value={opt.id}>
                {opt.name} · {opt.duration} min
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.sessionTypeId && (
          <p className="text-xs text-destructive">
            {form.formState.errors.sessionTypeId.message}
          </p>
        )}
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field>
          <FieldLabel>Date</FieldLabel>
          <Input type="datetime-local" {...form.register("sessionDate")} />
        </Field>
        <Field>
          <FieldLabel>Location</FieldLabel>
          <Input
            placeholder="Hackney studio"
            {...form.register("sessionLocation")}
          />
        </Field>
      </div>

      <Field>
        <FieldLabel>Message to client</FieldLabel>
        <Textarea
          rows={3}
          placeholder="Looking forward to this one — I've got a few ideas for the lake path."
          {...form.register("ownerMessage")}
        />
        <FieldDescription>Included in the booking email.</FieldDescription>
      </Field>

      <div className="flex items-center justify-end gap-3">
        <Button type="submit" disabled={approve.isPending} className="min-h-11">
          {approve.isPending ? "Sending…" : "Approve & send link"}
        </Button>
      </div>
    </form>
  )
}

type DeclineCardProps = {
  inquiryId: string
}

const DeclineCard = ({ inquiryId }: DeclineCardProps) => {
  const decline = useDeclineInquiry()
  const form = useForm<DeclineFormValues>({
    resolver: zodResolver(DeclineFormSchema),
    defaultValues: { declineReason: "" },
  })

  useEffect(() => {
    if (decline.error) {
      toast.error(decline.error.message)
    }
  }, [decline.error])

  const onSubmit = form.handleSubmit((values) => {
    decline.mutate({
      inquiryId,
      declineReason: values.declineReason || undefined,
    })
  })

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 border border-hairline bg-card p-5"
    >
      <div className="flex items-baseline justify-between">
        <h3 className="font-display text-lg font-light tracking-tight">
          Decline
        </h3>
        <span className="text-[10px] font-medium tracking-[0.24em] text-ink/60 uppercase">
          Decline
        </span>
      </div>

      <Field>
        <FieldLabel>Reason (optional)</FieldLabel>
        <Textarea
          rows={4}
          placeholder="Fully booked for that window. Happy to recommend a colleague."
          {...form.register("declineReason")}
        />
        <FieldDescription>
          Saved against the inquiry. No email is sent.
        </FieldDescription>
      </Field>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="submit"
          variant="outline"
          disabled={decline.isPending}
          className="min-h-11"
        >
          {decline.isPending ? "Declining…" : "Decline inquiry"}
        </Button>
      </div>
    </form>
  )
}
