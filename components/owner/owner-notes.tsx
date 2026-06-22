"use client"

import { useState, useCallback } from "react"
import { useUpdateOwnerNotes } from "@/hooks/use-jobs"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldLabel } from "@/components/ui/field"

export const OwnerNotes = ({
  jobId,
  notes,
}: {
  jobId: string
  notes: string | null
}) => {
  const [value, setValue] = useState(notes ?? "")
  const update = useUpdateOwnerNotes()

  const save = useCallback(() => {
    if (value !== (notes ?? "")) {
      update.mutate({ jobId, notes: value })
    }
  }, [value, notes, jobId, update])

  return (
    <Field>
      <FieldLabel htmlFor="ownerNotes">Owner notes</FieldLabel>
      <Textarea
        id="ownerNotes"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        placeholder="Internal notes — never shown to the client"
        rows={4}
      />
    </Field>
  )
}
