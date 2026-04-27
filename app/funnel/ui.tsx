'use client'

import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

export function BgVideo() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 object-cover [filter:brightness(0.22)_sepia(0.25)_saturate(0.9)]"
      >
        <source src="/video_compressed.mp4" type="video/mp4" />
      </video>
      <div className="bg-vignette absolute inset-0" />
    </div>
  )
}

export function TopBar() {
  return (
    <header className="flex items-center justify-between border-b border-[rgba(201,162,83,0.12)] bg-[rgba(8,7,5,0.6)] px-12 py-6 backdrop-blur-md max-md:px-6">
      <div className="font-display text-[1.4rem] font-normal tracking-[0.18em] uppercase">
        Ember <span className="text-ember-gold">&</span> Oak
      </div>
      <div className="font-display text-[0.85rem] tracking-[0.08em] text-ember-gold italic max-md:hidden">
        Modern American Grill
      </div>
    </header>
  )
}

const PROGRESS_LABELS = ['Offer', 'Reservation', 'Contact', 'Confirm']

export function Progress({ step }: { step: number }) {
  const upto = step === 5 ? 4 : step
  return (
    <div className="px-12 pt-6 max-md:px-6">
      <div className="mx-auto flex max-w-[720px] gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="relative h-[2px] flex-1 overflow-hidden bg-[rgba(201,162,83,0.18)]"
          >
            <div
              className="bg-ember-gold absolute inset-0 origin-left transition-transform duration-500"
              style={{ transform: `scaleX(${i <= upto ? 1 : 0})` }}
            />
          </div>
        ))}
      </div>
      <div className="mx-auto mt-3 flex max-w-[720px] gap-2">
        {PROGRESS_LABELS.map((label, idx) => (
          <div
            key={label}
            className={`flex-1 text-center text-[0.62rem] tracking-[0.18em] uppercase transition-colors ${
              idx + 1 <= upto ? 'text-ember-gold' : 'text-ember-muted'
            }`}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-[rgba(201,162,83,0.1)] bg-[rgba(8,7,5,0.6)] px-8 py-6 text-center text-[0.7rem] tracking-[0.12em] text-[rgba(245,240,232,0.35)] backdrop-blur-md">
      Ember &amp; Oak · 1247 Oakwood Lane ·{' '}
      <a
        href="tel:+15550000000"
        className="text-ember-gold hover:text-ember-gold-2"
      >
        (555) 000-0000
      </a>
    </footer>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="font-display text-ember-gold mb-3 block text-center text-base tracking-[0.1em] italic">
      {children}
    </span>
  )
}

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display mb-4 text-center text-[clamp(1.8rem,4vw,2.6rem)] leading-[1.05] font-light tracking-[0.02em]">
      {children}
    </h2>
  )
}

export function Lead({ children }: { children: ReactNode }) {
  return (
    <p className="mx-auto mb-10 max-w-[520px] text-center text-base leading-[1.7] text-[rgba(245,240,232,0.7)]">
      {children}
    </p>
  )
}

export function MicroNote({
  children,
  tone = 'default',
}: {
  children: ReactNode
  tone?: 'default' | 'error'
}) {
  const color = tone === 'error' ? 'text-[#e87575]' : 'text-[rgba(245,240,232,0.4)]'
  return (
    <p
      className={`mt-6 text-center text-[0.7rem] tracking-[0.05em] italic ${color}`}
    >
      {children}
    </p>
  )
}

export function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[0.62rem] tracking-[0.2em] text-[rgba(245,240,232,0.55)] uppercase">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputClasses =
  'w-full rounded-[1px] border border-ember-border bg-[rgba(8,7,5,0.55)] px-4 py-[0.95rem] text-[0.95rem] font-light text-ember-cream font-sans placeholder:text-[rgba(245,240,232,0.25)] outline-none transition-colors focus:border-ember-gold focus:bg-[rgba(8,7,5,0.85)]'

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={inputClasses} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={inputClasses} />
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea {...props} className={`${inputClasses} min-h-[100px] resize-y`} />
  )
}

export function Pill({
  value,
  selected,
  onSelect,
  children,
}: {
  value: string
  selected: boolean
  onSelect: (value: string) => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`min-w-[60px] flex-1 rounded-[1px] border px-4 py-[0.85rem] text-center text-[0.85rem] font-normal tracking-[0.05em] transition-all ${
        selected
          ? 'border-ember-gold bg-[rgba(201,162,83,0.12)] text-ember-gold-2'
          : 'border-ember-border bg-[rgba(8,7,5,0.55)] text-ember-cream hover:border-ember-gold-2 hover:text-ember-gold-2'
      }`}
    >
      {children}
    </button>
  )
}

export function PillGroup({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>
}

export function ButtonRow({ children }: { children: ReactNode }) {
  return (
    <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
      {children}
    </div>
  )
}

const ghostBtn =
  'cursor-pointer border-none bg-transparent px-4 py-2 text-[0.7rem] tracking-[0.16em] uppercase text-[rgba(245,240,232,0.55)] transition-colors hover:text-ember-gold disabled:cursor-not-allowed disabled:opacity-40'

export function GhostButton({
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" {...props} className={`${ghostBtn} ${className}`} />
}

const goldBtn =
  'inline-flex items-center justify-center gap-3 rounded-[1px] border border-ember-gold bg-ember-gold px-10 py-[1.1rem] text-[0.74rem] font-semibold tracking-[0.18em] uppercase text-ember-black whitespace-nowrap transition-all hover:bg-ember-gold-2 hover:border-ember-gold-2 hover:-translate-y-px hover:shadow-[0_12px_30px_-10px_rgba(201,162,83,0.45)] disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none'

export function GoldButton({
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={`${goldBtn} ${className}`} />
}

export function FormGrid({
  children,
  cols = 1,
  className = '',
}: {
  children: ReactNode
  cols?: 1 | 2
  className?: string
}) {
  const gridCols =
    cols === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
  return (
    <div className={`mb-7 grid gap-4 ${gridCols} ${className}`}>{children}</div>
  )
}
