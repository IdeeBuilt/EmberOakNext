'use client'

import {
  ButtonRow,
  Eyebrow,
  Field,
  FormGrid,
  GhostButton,
  GoldButton,
  H2,
  Lead,
  MicroNote,
  TextInput,
} from './ui'
import type { FunnelFormState, UpdateField } from './Funnel'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function StepContact({
  state,
  update,
  onNext,
  onBack,
}: {
  state: FunnelFormState
  update: UpdateField
  onNext: () => void
  onBack: () => void
}) {
  const emailOk = EMAIL_RE.test(state.email.trim())
  const phoneOk = state.phone.replace(/\D/g, '').length >= 7
  const canProceed = emailOk && phoneOk

  return (
    <div className="animate-[fadeUp_0.6s_ease_both]">
      <Eyebrow>Step 2 of 3</Eyebrow>
      <H2>Where should we send your confirmation?</H2>
      <Lead>
        We&apos;ll email your reservation details and your appetizer code. We
        never share your information.
      </Lead>

      <FormGrid>
        <Field label="Email">
          <TextInput
            type="email"
            placeholder="jane@email.com"
            value={state.email}
            onChange={(e) => update('email', e.target.value)}
            required
          />
        </Field>
        <Field label="Mobile (for table-ready text)">
          <TextInput
            type="tel"
            placeholder="(555) 000-0000"
            value={state.phone}
            onChange={(e) => update('phone', e.target.value)}
            required
          />
        </Field>
      </FormGrid>

      <ButtonRow>
        <GhostButton onClick={onBack}>← Back</GhostButton>
        <GoldButton disabled={!canProceed} onClick={onNext}>
          Continue
          <span className="text-base leading-none">→</span>
        </GoldButton>
      </ButtonRow>

      <MicroNote>🔒 Secure · No spam · One confirmation email only</MicroNote>
    </div>
  )
}
