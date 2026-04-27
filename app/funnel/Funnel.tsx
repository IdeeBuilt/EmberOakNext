'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { reservationFormSchema } from '@/lib/reservation'
import { BgVideo, Footer, Progress, TopBar } from './ui'
import { StepHook } from './StepHook'
import { StepDateTime } from './StepDateTime'
import { StepContact } from './StepContact'
import { StepConfirm } from './StepConfirm'
import { StepSuccess } from './StepSuccess'

export type FunnelFormState = {
  party: string
  date: string
  time: string
  occasion: string
  email: string
  phone: string
  first: string
  last: string
  notes: string
}

export type UpdateField = <K extends keyof FunnelFormState>(
  key: K,
  value: FunnelFormState[K],
) => void

type FunnelStep = 1 | 2 | 3 | 4 | 5

function tomorrowISO() {
  const t = new Date()
  t.setDate(t.getDate() + 1)
  return t.toISOString().slice(0, 10)
}

export function Funnel() {
  const [step, setStep] = useState<FunnelStep>(1)
  const [state, setState] = useState<FunnelFormState>(() => ({
    party: '',
    date: tomorrowISO(),
    time: '',
    occasion: '',
    email: '',
    phone: '',
    first: '',
    last: '',
    notes: '',
  }))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update: UpdateField = (key, value) =>
    setState((prev) => ({ ...prev, [key]: value }))

  const goTo = (n: FunnelStep) => {
    setStep(n)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const submit = async () => {
    setError(null)
    const payload = {
      first_name: state.first.trim(),
      last_name: state.last.trim(),
      email: state.email.trim().toLowerCase(),
      phone: state.phone.trim(),
      party_size: state.party,
      reservation_date: state.date,
      reservation_time: state.time,
      occasion: state.occasion || null,
      notes: state.notes.trim() || null,
    }

    const parsed = reservationFormSchema.safeParse(payload)
    if (!parsed.success) {
      setError('Please double-check your details and try again.')
      return
    }

    setSubmitting(true)
    const supabase = createClient()
    const { error: dbError } = await supabase
      .from('reservations')
      .insert(parsed.data)

    if (dbError) {
      console.error('Reservation insert failed:', dbError)
      setSubmitting(false)
      setError(
        'Something went wrong saving your reservation. Please call us at (555) 000-0000 or try again.',
      )
      return
    }

    setSubmitting(false)
    goTo(5)
  }

  return (
    <>
      <BgVideo />
      <div className="relative z-10 flex min-h-svh flex-col">
        <TopBar />
        <Progress step={step} />

        <main className="flex flex-1 items-center justify-center px-8 py-12 max-md:px-5 max-md:py-8">
          <section className="w-full max-w-[760px]">
            {step === 1 && <StepHook onNext={() => goTo(2)} />}
            {step === 2 && (
              <StepDateTime
                state={state}
                update={update}
                onNext={() => goTo(3)}
                onBack={() => goTo(1)}
              />
            )}
            {step === 3 && (
              <StepContact
                state={state}
                update={update}
                onNext={() => goTo(4)}
                onBack={() => goTo(2)}
              />
            )}
            {step === 4 && (
              <StepConfirm
                state={state}
                update={update}
                onSubmit={submit}
                onBack={() => goTo(3)}
                submitting={submitting}
                error={error}
              />
            )}
            {step === 5 && <StepSuccess state={state} />}
          </section>
        </main>

        <Footer />
      </div>
    </>
  )
}
