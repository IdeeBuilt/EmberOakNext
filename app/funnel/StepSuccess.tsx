'use client'

import Link from 'next/link'
import { ButtonRow, Eyebrow, GoldButton, Lead, MicroNote } from './ui'
import type { FunnelFormState } from './Funnel'

function formatLongDate(iso: string) {
  if (!iso) return ''
  return new Date(iso + 'T00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

function buildIcs(state: FunnelFormState) {
  const [hStr, ampm] = state.time.split(' ')
  const [hRaw, mRaw] = hStr.split(':').map(Number)
  let h = hRaw
  if (ampm === 'PM' && h !== 12) h += 12
  if (ampm === 'AM' && h === 12) h = 0
  const start = new Date(state.date + 'T00:00')
  start.setHours(h, mRaw, 0, 0)
  const end = new Date(start.getTime() + 90 * 60 * 1000)
  const fmt = (d: Date) => d.toISOString().replace(/[-:]|\.\d{3}/g, '')
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    'SUMMARY:Dinner at Ember & Oak',
    `DESCRIPTION:Reservation for ${state.party} · Code EMBER-WELCOME`,
    'LOCATION:Ember & Oak, 1247 Oakwood Lane',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export function StepSuccess({ state }: { state: FunnelFormState }) {
  const handleAddToCalendar = () => {
    const ics = buildIcs(state)
    const blob = new Blob([ics], { type: 'text/calendar' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'ember-and-oak-reservation.ics'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const longDate = formatLongDate(state.date)

  return (
    <div className="animate-[fadeUp_0.6s_ease_both]">
      <div className="border-ember-gold text-ember-gold mx-auto mb-7 flex h-[84px] w-[84px] items-center justify-center rounded-full border bg-[rgba(201,162,83,0.08)] text-3xl">
        ✓
      </div>

      <Eyebrow>Reservation confirmed</Eyebrow>

      <h2 className="font-display mb-4 text-center text-[clamp(1.8rem,4vw,2.6rem)] leading-[1.05] font-light tracking-[0.02em]">
        You&apos;re all set, {state.first}
      </h2>

      <Lead>
        We&apos;ve held your table for {state.party} on {longDate} at{' '}
        {state.time}. Confirmation sent to {state.email}.
      </Lead>

      <div className="border-ember-gold mx-auto my-8 max-w-[420px] border border-dashed bg-[rgba(8,7,5,0.7)] px-6 py-7 text-center">
        <div className="text-ember-gold mb-2 text-[0.65rem] tracking-[0.24em] uppercase">
          Your Appetizer Code
        </div>
        <div className="font-display text-3xl font-normal tracking-[0.2em]">
          EMBER<span className="text-ember-gold">·</span>WELCOME
        </div>
      </div>

      <ButtonRow>
        <Link
          href="/"
          className="border-ember-border hover:border-ember-gold hover:text-ember-gold inline-flex items-center justify-center gap-3 rounded-[1px] border bg-transparent px-8 py-4 text-[0.74rem] font-medium tracking-[0.18em] text-ember-cream uppercase transition-all"
        >
          ← Back to home
        </Link>
        <GoldButton onClick={handleAddToCalendar}>
          Add to calendar
          <span className="text-base leading-none">→</span>
        </GoldButton>
      </ButtonRow>

      <MicroNote>
        Can&apos;t make it? Reply to your confirmation email and we&apos;ll
        reschedule.
      </MicroNote>
    </div>
  )
}
