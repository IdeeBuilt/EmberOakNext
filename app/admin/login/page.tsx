'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectedFrom = searchParams.get('redirectedFrom') ?? '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (authError) {
      setError(authError.message)
      setSubmitting(false)
      return
    }

    router.push(redirectedFrom)
    router.refresh()
  }

  return (
    <div
      className="flex min-h-svh items-center justify-center px-8 py-12"
      style={{
        background:
          'radial-gradient(ellipse at top, rgba(201,162,83,0.06), transparent 60%), #080705',
      }}
    >
      <div className="border-ember-border bg-ember-dark relative w-full max-w-[420px] border px-10 py-10">
        <div className="font-display mb-1 text-center text-[1.8rem] tracking-[0.18em] uppercase">
          Ember <span className="text-ember-gold">&amp;</span> Oak
        </div>
        <div className="font-display text-ember-gold mb-9 text-center text-[0.9rem] tracking-[0.1em] italic">
          Reservations Admin
        </div>

        {error && (
          <div className="mb-5 border border-[rgba(201,122,122,0.4)] bg-[rgba(201,122,122,0.06)] px-4 py-3 text-[0.82rem] text-[#c97a7a]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-[0.62rem] tracking-[0.2em] text-[rgba(245,240,232,0.55)] uppercase"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-ember-border bg-ember-black text-ember-cream focus:border-ember-gold w-full border px-4 py-[0.85rem] text-[0.92rem] font-light outline-none transition-colors"
            />
          </div>

          <div className="mb-6 flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-[0.62rem] tracking-[0.2em] text-[rgba(245,240,232,0.55)] uppercase"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-ember-border bg-ember-black text-ember-cream focus:border-ember-gold w-full border px-4 py-[0.85rem] text-[0.92rem] font-light outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="border-ember-gold bg-ember-gold text-ember-black hover:bg-ember-gold-2 hover:border-ember-gold-2 w-full cursor-pointer border px-6 py-[0.95rem] text-[0.7rem] font-semibold tracking-[0.16em] uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
