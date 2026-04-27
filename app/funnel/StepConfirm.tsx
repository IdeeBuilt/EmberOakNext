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
  Textarea,
} from './ui'
import type { FunnelFormState, UpdateField } from './Funnel'

function formatDate(iso: string) {
  if (!iso) return '—'
  return new Date(iso + 'T00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function StepConfirm({
  state,
  update,
  onSubmit,
  onBack,
  submitting,
  error,
}: {
  state: FunnelFormState
  update: UpdateField
  onSubmit: () => void
  onBack: () => void
  submitting: boolean
  error: string | null
}) {
  const canSubmit =
    !!state.first.trim() && !!state.last.trim() && !submitting

  return (
    <div className="animate-[fadeUp_0.6s_ease_both]">
      <Eyebrow>Step 3 of 3 · Almost there</Eyebrow>
      <H2>One last thing</H2>
      <Lead>
        Tell us your name and any preferences so our team can welcome you
        properly.
      </Lead>

      <FormGrid cols={2}>
        <Field label="First Name">
          <TextInput
            type="text"
            placeholder="Jane"
            value={state.first}
            onChange={(e) => update('first', e.target.value)}
            required
          />
        </Field>
        <Field label="Last Name">
          <TextInput
            type="text"
            placeholder="Smith"
            value={state.last}
            onChange={(e) => update('last', e.target.value)}
            required
          />
        </Field>
      </FormGrid>

      <FormGrid>
        <Field label="Special Requests (optional)">
          <Textarea
            placeholder="Dietary restrictions, seating preferences, allergies…"
            value={state.notes}
            onChange={(e) => update('notes', e.target.value)}
          />
        </Field>
      </FormGrid>

      <div className="border-ember-border mx-auto mb-7 max-w-[460px] border bg-[rgba(8,7,5,0.55)] px-6 py-5">
        <SummaryRow label="Date" value={formatDate(state.date)} />
        <SummaryRow label="Time" value={state.time || '—'} />
        <SummaryRow
          label="Party"
          value={state.party ? `${state.party} guests` : '—'}
        />
        {state.occasion && (
          <SummaryRow label="Occasion" value={state.occasion} />
        )}
        <SummaryRow label="Includes" value="Chef's Welcome Plate" />
      </div>

      <ButtonRow>
        <GhostButton onClick={onBack} disabled={submitting}>
          ← Back
        </GhostButton>
        <GoldButton disabled={!canSubmit} onClick={onSubmit}>
          {submitting ? (
            'Submitting…'
          ) : (
            <>
              Confirm reservation
              <span className="text-base leading-none">→</span>
            </>
          )}
        </GoldButton>
      </ButtonRow>

      {error ? (
        <MicroNote tone="error">{error}</MicroNote>
      ) : (
        <MicroNote>
          By confirming, you agree to our 15-minute hold policy
        </MicroNote>
      )}
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[rgba(201,162,83,0.12)] py-2 text-[0.85rem] last:border-b-0">
      <span className="text-[0.65rem] tracking-[0.18em] text-[rgba(245,240,232,0.55)] uppercase">
        {label}
      </span>
      <span className="text-ember-gold-2 font-normal">{value}</span>
    </div>
  )
}
