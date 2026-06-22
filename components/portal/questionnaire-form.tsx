"use client"

import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import { useSubmitQuestionnaire } from "@/hooks/use-portal"
import { zodResolver } from "@/lib/forms/zod-resolver"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldLabel } from "@/components/ui/field"

const QuestionnaireFormSchema = z.object({
  sessionGoal: z.string().min(1),
  participants: z.string().min(1),
  locationPref: z.string().min(1),
  mood: z.string().min(1),
  outfitPlans: z.string().min(1),
  moodBoardUrl: z.string().optional(),
  avoidsNotes: z.string().optional(),
  imageUsage: z.string().min(1),
  additionalNotes: z.string().optional(),
  modelRelease: z.boolean(),
})

type QuestionnaireFormValues = z.infer<typeof QuestionnaireFormSchema>

export const QuestionnaireForm = ({
  sessionToken,
}: {
  sessionToken: string
}) => {
  const submit = useSubmitQuestionnaire()
  const form = useForm<QuestionnaireFormValues>({
    resolver: zodResolver(QuestionnaireFormSchema),
    defaultValues: {
      sessionGoal: "",
      participants: "",
      locationPref: "",
      mood: "",
      outfitPlans: "",
      moodBoardUrl: "",
      avoidsNotes: "",
      imageUsage: "",
      additionalNotes: "",
      modelRelease: false,
    },
  })

  const modelRelease = useWatch({
    control: form.control,
    name: "modelRelease",
  })

  const onSubmit = form.handleSubmit((values) => {
    submit.mutate({ sessionToken, ...values })
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <Field>
        <FieldLabel htmlFor="sessionGoal">
          What is the main goal of this session?
        </FieldLabel>
        <Textarea
          id="sessionGoal"
          placeholder="e.g. LinkedIn photos, family memories, press kit..."
          {...form.register("sessionGoal")}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="participants">
          Who will be photographed?
        </FieldLabel>
        <Input
          id="participants"
          placeholder="Names and ages if children are involved"
          {...form.register("participants")}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="locationPref">Location preference</FieldLabel>
        <Input
          id="locationPref"
          placeholder="e.g. Victoria Park, my office in Shoreditch"
          {...form.register("locationPref")}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="mood">
          What mood or style are you hoping for?
        </FieldLabel>
        <Input
          id="mood"
          placeholder="e.g. warm and natural, polished and professional"
          {...form.register("mood")}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="outfitPlans">Outfit plans</FieldLabel>
        <Textarea
          id="outfitPlans"
          placeholder="e.g. navy suit, neutral tones, one outfit change"
          {...form.register("outfitPlans")}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="moodBoardUrl">
          Mood board link (optional)
        </FieldLabel>
        <Input
          id="moodBoardUrl"
          type="url"
          placeholder="https://..."
          {...form.register("moodBoardUrl")}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="avoidsNotes">
          Anything you would prefer to avoid? (optional)
        </FieldLabel>
        <Textarea
          id="avoidsNotes"
          placeholder="Angles, colours, backgrounds..."
          {...form.register("avoidsNotes")}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="imageUsage">
          How do you plan to use the images?
        </FieldLabel>
        <Input
          id="imageUsage"
          placeholder="e.g. website, social media, personal prints"
          {...form.register("imageUsage")}
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="additionalNotes">
          Anything else I should know? (optional)
        </FieldLabel>
        <Textarea
          id="additionalNotes"
          placeholder="Accessibility needs, timing constraints..."
          {...form.register("additionalNotes")}
        />
      </Field>

      <label htmlFor="modelRelease" className="flex items-start gap-3 text-sm">
        <Checkbox
          id="modelRelease"
          checked={modelRelease}
          onCheckedChange={(v) => form.setValue("modelRelease", v === true)}
        />
        <span>
          I consent to Clara Monét Photography using selected images from this
          session on her website, social media, and printed portfolio. I
          understand I can withdraw this consent at any time by emailing{" "}
          <span className="font-medium">hello@claramonet.co.uk</span>.
        </span>
      </label>

      <Button type="submit" disabled={submit.isPending}>
        {submit.isPending ? "Submitting…" : "Submit questionnaire"}
      </Button>
    </form>
  )
}
