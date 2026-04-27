'use client'

import { ButtonRow, Eyebrow, GoldButton, Lead, MicroNote } from './ui'

export function StepHook({ onNext }: { onNext: () => void }) {
  return (
    <div className="animate-[fadeUp_0.6s_ease_both]">
      <Eyebrow>A welcome from our chef</Eyebrow>

      <h1 className="font-display mb-5 text-center text-[clamp(2.4rem,6vw,4rem)] leading-[1.05] font-light tracking-[0.02em]">
        A Complimentary{' '}
        <span className="text-ember-gold italic">Appetizer</span>
        <br />
        On Your First Visit
      </h1>

      <Lead>
        Reserve your table tonight and our chef will send out his signature
        appetizer — on the house. Our way of saying welcome to Ember &amp; Oak.
      </Lead>

      <div className="offer-corners border-ember-gold mx-auto mb-10 max-w-[540px] border bg-[rgba(8,7,5,0.7)] px-8 py-9 text-center backdrop-blur-md">
        <div className="text-ember-gold mb-4 text-[0.65rem] tracking-[0.24em] uppercase">
          Limited time · This week only
        </div>
        <div className="font-display mb-2 text-[1.8rem] leading-[1.2] font-normal">
          Chef&apos;s{' '}
          <span className="text-ember-gold-2 italic">Welcome Plate</span>
        </div>
        <div className="text-[0.85rem] leading-[1.6] text-[rgba(245,240,232,0.55)]">
          Wood-fired flatbread, house-cured charcuterie, or seasonal crudo —
          chef&apos;s choice. Valid for parties of 2 or more on your first
          reservation.
        </div>
      </div>

      <div className="mb-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
        <div className="flex items-center gap-2 text-[0.72rem] tracking-[0.12em] text-[rgba(245,240,232,0.55)] uppercase">
          <span className="text-ember-gold text-[0.85rem] tracking-[0.05em]">
            ★★★★★
          </span>{' '}
          4.9 · 380+ Reviews
        </div>
        <div className="flex items-center gap-2 text-[0.72rem] tracking-[0.12em] text-[rgba(245,240,232,0.55)] uppercase">
          ⏱ Limited Tables
        </div>
        <div className="flex items-center gap-2 text-[0.72rem] tracking-[0.12em] text-[rgba(245,240,232,0.55)] uppercase">
          ✓ No Card Required
        </div>
      </div>

      <ButtonRow>
        <GoldButton onClick={onNext}>
          Claim my appetizer
          <span className="text-base leading-none">→</span>
        </GoldButton>
      </ButtonRow>

      <MicroNote>
        Takes less than 60 seconds · We hold your table for 15 minutes
      </MicroNote>
    </div>
  )
}
