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
  Pill,
  PillGroup,
  Select,
  TextInput,
} from './ui'
import type { FunnelFormState, UpdateField } from './Funnel'

const PARTY_OPTIONS = ['2', '3', '4', '5', '6', '7+']
const TIME_OPTIONS = [
  '5:30 PM',
  '6:00 PM',
  '6:30 PM',
  '7:00 PM',
  '7:30 PM',
  '8:00 PM',
  '8:30 PM',
  '9:00 PM',
]

const todayISO = () => new Date().toISOString().slice(0, 10)

export function StepDateTime({
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
  const canProceed = !!(state.party && state.date && state.time)

  return (
    <div className="animate-[fadeUp_0.6s_ease_both]">
      <Eyebrow>Step 1 of 3</Eyebrow>
      <H2>When would you like to dine?</H2>
      <Lead>
        Pick a date, party size, and time. Most of our prime tables go quickly —
        choose what works best for you.
      </Lead>

      <FormGrid>
        <Field label="Party Size">
          <PillGroup>
            {PARTY_OPTIONS.map((size) => (
              <Pill
                key={size}
                value={size}
                selected={state.party === size}
                onSelect={(v) => update('party', v)}
              >
                {size}
              </Pill>
            ))}
          </PillGroup>
        </Field>
      </FormGrid>

      <FormGrid cols={2}>
        <Field label="Date">
          <TextInput
            type="date"
            value={state.date}
            min={todayISO()}
            onChange={(e) => update('date', e.target.value)}
            required
          />
        </Field>
        <Field label="Occasion (optional)">
          <Select
            value={state.occasion}
            onChange={(e) => update('occasion', e.target.value)}
          >
            <option value="">— None —</option>
            <option>Date Night</option>
            <option>Birthday</option>
            <option>Anniversary</option>
            <option>Business Dinner</option>
            <option>Celebration</option>
          </Select>
        </Field>
      </FormGrid>

      <FormGrid>
        <Field label="Preferred Time">
          <PillGroup>
            {TIME_OPTIONS.map((t) => (
              <Pill
                key={t}
                value={t}
                selected={state.time === t}
                onSelect={(v) => update('time', v)}
              >
                {t.replace(' PM', '').replace(' AM', '')}
              </Pill>
            ))}
          </PillGroup>
        </Field>
      </FormGrid>

      <ButtonRow>
        <GhostButton onClick={onBack}>← Back</GhostButton>
        <GoldButton disabled={!canProceed} onClick={onNext}>
          Continue
          <span className="text-base leading-none">→</span>
        </GoldButton>
      </ButtonRow>

      <MicroNote>Your table is being held while you finish</MicroNote>
    </div>
  )
}
