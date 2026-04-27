'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  RESERVATION_STATUSES,
  STATUS_LABELS,
  type ReservationRow,
  type ReservationStatus,
} from '@/lib/reservation'

type WhenFilter = 'today' | 'week' | 'upcoming' | 'all'
type StatusFilter = ReservationStatus | 'all'

const WHEN_OPTIONS: { value: WhenFilter; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'Next 7 days' },
  { value: 'upcoming', label: 'All upcoming' },
  { value: 'all', label: 'Everything' },
]

const STATUS_FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  ...RESERVATION_STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] })),
]

const todayISO = () => new Date().toISOString().slice(0, 10)
const isoDaysFromNow = (n: number) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

const formatShortDate = (iso: string) =>
  new Date(iso + 'T00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

const formatLongDate = (iso: string) =>
  new Date(iso + 'T00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

const todayLong = () =>
  new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

const DEMO_EMAIL = 'demo@gmail.com'

export function AdminDashboard({
  initialReservations,
  userEmail,
}: {
  initialReservations: ReservationRow[]
  userEmail: string
}) {
  const router = useRouter()
  const isDemo = userEmail === DEMO_EMAIL
  const [reservations, setReservations] = useState(initialReservations)
  const [whenFilter, setWhenFilter] = useState<WhenFilter>('today')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [search, setSearch] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [modalError, setModalError] = useState<string | null>(null)
  const [modalSuccess, setModalSuccess] = useState<string | null>(null)

  const supabase = useMemo(() => createClient(), [])

  const refresh = async () => {
    setRefreshing(true)
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('reservation_date', { ascending: true })
      .order('reservation_time', { ascending: true })
    setRefreshing(false)
    if (!error && data) setReservations(data as ReservationRow[])
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const stats = useMemo(() => {
    const today = todayISO()
    const weekEnd = isoDaysFromNow(7)
    return {
      today: reservations.filter((r) => r.reservation_date === today).length,
      week: reservations.filter(
        (r) => r.reservation_date >= today && r.reservation_date <= weekEnd,
      ).length,
      pending: reservations.filter(
        (r) => r.status === 'pending' && r.reservation_date >= today,
      ).length,
      all: reservations.length,
    }
  }, [reservations])

  const filtered = useMemo(() => {
    const today = todayISO()
    const weekEnd = isoDaysFromNow(7)
    let rows = reservations

    if (whenFilter === 'today') {
      rows = rows.filter((r) => r.reservation_date === today)
    } else if (whenFilter === 'week') {
      rows = rows.filter(
        (r) => r.reservation_date >= today && r.reservation_date <= weekEnd,
      )
    } else if (whenFilter === 'upcoming') {
      rows = rows.filter((r) => r.reservation_date >= today)
    }

    if (statusFilter !== 'all') {
      rows = rows.filter((r) => r.status === statusFilter)
    }

    const q = search.trim().toLowerCase()
    if (q) {
      rows = rows.filter(
        (r) =>
          `${r.first_name} ${r.last_name}`.toLowerCase().includes(q) ||
          (r.email || '').toLowerCase().includes(q),
      )
    }

    return rows
  }, [reservations, whenFilter, statusFilter, search])

  const active = activeId
    ? reservations.find((r) => r.id === activeId) ?? null
    : null

  const updateStatus = async (newStatus: ReservationStatus) => {
    if (!active) return
    setModalError(null)
    setModalSuccess(null)

    const { error } = await supabase
      .from('reservations')
      .update({ status: newStatus })
      .eq('id', active.id)

    if (error) {
      setModalError(`Update failed: ${error.message}`)
      return
    }

    setReservations((prev) =>
      prev.map((r) => (r.id === active.id ? { ...r, status: newStatus } : r)),
    )
    setModalSuccess(`Marked as ${STATUS_LABELS[newStatus]}`)
  }

  const closeModal = () => {
    setActiveId(null)
    setModalError(null)
    setModalSuccess(null)
  }

  return (
    <div className="bg-ember-black min-h-svh">
      <header className="border-ember-border bg-ember-dark sticky top-0 z-50 flex items-center justify-between border-b px-8 py-4 max-md:px-4">
        <div className="font-display text-[1.3rem] tracking-[0.16em] uppercase">
          Ember <span className="text-ember-gold">&amp;</span> Oak
        </div>
        <div className="flex items-center gap-5 max-md:gap-3">
          <span className="text-[0.7rem] tracking-[0.1em] text-[rgba(245,240,232,0.45)] max-md:hidden">
            Signed in ·{' '}
            <span className="text-ember-gold-2">{userEmail}</span>
          </span>
          <button
            onClick={signOut}
            className="border-ember-border hover:border-ember-gold hover:text-ember-gold inline-flex cursor-pointer items-center gap-2 border bg-transparent px-3 py-2 text-[0.65rem] font-medium tracking-[0.16em] text-ember-cream uppercase transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      {isDemo && (
        <div className="border-b border-[rgba(201,162,83,0.25)] bg-[rgba(201,162,83,0.08)] px-8 py-3 text-center text-[0.72rem] tracking-[0.16em] text-ember-gold-2 uppercase max-md:px-4">
          Demo Mode <span className="opacity-60">·</span> Read-only showcase — status updates are disabled
        </div>
      )}

      <main className="mx-auto max-w-[1280px] px-8 py-8 max-md:px-4">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-[2.2rem] font-light tracking-[0.02em] max-md:text-[1.6rem]">
              Reservations <span className="text-ember-gold">·</span> Today
            </h1>
            <div className="font-display mt-1 text-[0.95rem] text-[rgba(245,240,232,0.45)] italic">
              {todayLong()}
            </div>
          </div>
          <button
            onClick={refresh}
            disabled={refreshing}
            className="border-ember-border hover:border-ember-gold hover:text-ember-gold inline-flex cursor-pointer items-center gap-2 border bg-transparent px-5 py-3 text-[0.7rem] font-medium tracking-[0.16em] text-ember-cream uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            ↻ {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>

        <div className="mb-8 grid grid-cols-4 gap-4 max-md:grid-cols-2">
          <Stat label="Today" value={stats.today} />
          <Stat label="This Week" value={stats.week} />
          <Stat label="Pending" value={stats.pending} />
          <Stat label="All Time" value={stats.all} />
        </div>

        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[0.62rem] tracking-[0.2em] text-[rgba(245,240,232,0.45)] uppercase">
            When
          </span>
          {WHEN_OPTIONS.map((opt) => (
            <Chip
              key={opt.value}
              active={whenFilter === opt.value}
              onClick={() => setWhenFilter(opt.value)}
            >
              {opt.label}
            </Chip>
          ))}
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[0.62rem] tracking-[0.2em] text-[rgba(245,240,232,0.45)] uppercase">
            Status
          </span>
          {STATUS_FILTER_OPTIONS.map((opt) => (
            <Chip
              key={opt.value}
              active={statusFilter === opt.value}
              onClick={() => setStatusFilter(opt.value)}
            >
              {opt.label}
            </Chip>
          ))}
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="border-ember-border bg-ember-dark text-ember-cream focus:border-ember-gold min-w-[200px] flex-1 border px-3 py-2 text-[0.85rem] font-light outline-none placeholder:text-[rgba(245,240,232,0.3)]"
          />
        </div>

        <div className="border-ember-border bg-ember-dark overflow-x-auto border">
          {filtered.length === 0 ? (
            <div className="px-8 py-16 text-center text-[rgba(245,240,232,0.45)]">
              <div className="text-ember-gold mb-3 text-3xl opacity-60">◇</div>
              <h3 className="font-display text-ember-cream mb-1 text-[1.4rem] font-normal">
                No reservations match
              </h3>
              <div>Try adjusting the filters above.</div>
            </div>
          ) : (
            <table className="w-full border-collapse max-md:hidden">
              <thead>
                <tr>
                  <Th>When</Th>
                  <Th>Guest</Th>
                  <Th>Party</Th>
                  <Th>Contact</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setActiveId(r.id)}
                    className="hover:bg-ember-dark-2 cursor-pointer border-b border-[rgba(201,162,83,0.08)] transition-colors last:border-b-0"
                  >
                    <td className="p-4 align-middle text-[0.88rem]">
                      <div className="text-ember-gold-2 whitespace-nowrap">
                        {r.reservation_time}
                        <small className="mt-0.5 block text-[0.7rem] tracking-[0.05em] text-[rgba(245,240,232,0.45)]">
                          {formatShortDate(r.reservation_date)}
                        </small>
                      </div>
                    </td>
                    <td className="p-4 align-middle text-[0.88rem]">
                      <div className="font-normal">
                        {r.first_name} {r.last_name}
                        {r.occasion && (
                          <small className="mt-0.5 block text-[0.72rem] text-[rgba(245,240,232,0.45)]">
                            {r.occasion}
                          </small>
                        )}
                      </div>
                    </td>
                    <td className="p-4 align-middle">
                      <span className="text-ember-gold-2 font-display text-xl">
                        {r.party_size}
                      </span>
                    </td>
                    <td className="p-4 align-middle text-[0.88rem]">
                      {r.email}
                      <br />
                      <small className="text-[0.75rem] text-[rgba(245,240,232,0.45)]">
                        {r.phone}
                      </small>
                    </td>
                    <td className="p-4 align-middle">
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {filtered.length > 0 && (
            <div className="md:hidden">
              {filtered.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setActiveId(r.id)}
                  className="hover:bg-ember-dark-2 cursor-pointer border-b border-[rgba(201,162,83,0.08)] p-4 transition-colors last:border-b-0"
                >
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <div className="text-ember-gold-2">
                        {r.reservation_time}
                      </div>
                      <div className="text-[0.7rem] text-[rgba(245,240,232,0.45)]">
                        {formatShortDate(r.reservation_date)}
                      </div>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="text-[0.9rem]">
                    {r.first_name} {r.last_name} ·{' '}
                    <span className="text-ember-gold-2">
                      {r.party_size} guests
                    </span>
                  </div>
                  <div className="mt-1 text-[0.8rem] text-[rgba(245,240,232,0.45)]">
                    {r.email} · {r.phone}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {active && (
        <ReservationModal
          reservation={active}
          onClose={closeModal}
          onUpdateStatus={updateStatus}
          error={modalError}
          success={modalSuccess}
          isDemo={isDemo}
        />
      )}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-ember-border bg-ember-dark border px-5 py-5">
      <div className="mb-2 text-[0.62rem] tracking-[0.2em] text-[rgba(245,240,232,0.45)] uppercase">
        {label}
      </div>
      <div className="font-display text-ember-gold-2 text-[2rem] font-normal">
        {value}
      </div>
    </div>
  )
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer border px-4 py-2 text-[0.72rem] tracking-[0.08em] transition-colors ${
        active
          ? 'border-ember-gold bg-[rgba(201,162,83,0.12)] text-ember-gold-2'
          : 'border-ember-border hover:border-ember-gold hover:text-ember-gold bg-transparent text-[rgba(245,240,232,0.7)]'
      }`}
    >
      {children}
    </button>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="border-ember-border bg-ember-dark-2 border-b px-4 py-4 text-left text-[0.62rem] font-medium tracking-[0.2em] whitespace-nowrap text-[rgba(245,240,232,0.45)] uppercase">
      {children}
    </th>
  )
}

function StatusBadge({ status }: { status: ReservationStatus }) {
  const styles: Record<ReservationStatus, string> = {
    pending: 'text-ember-cream border-[rgba(245,240,232,0.3)]',
    confirmed:
      'text-ember-gold-2 border-[rgba(226,192,122,0.5)] bg-[rgba(201,162,83,0.08)]',
    seated:
      'text-[#6fb38a] border-[rgba(111,179,138,0.4)] bg-[rgba(111,179,138,0.06)]',
    no_show:
      'text-[#c97a7a] border-[rgba(201,122,122,0.4)] bg-[rgba(201,122,122,0.06)]',
    cancelled: 'text-[rgba(245,240,232,0.45)] border-[rgba(245,240,232,0.15)]',
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.6rem] tracking-[0.16em] whitespace-nowrap uppercase ${styles[status]}`}
    >
      <span className="text-[0.7rem] leading-none">●</span>
      {STATUS_LABELS[status]}
    </span>
  )
}

function ReservationModal({
  reservation: r,
  onClose,
  onUpdateStatus,
  error,
  success,
  isDemo,
}: {
  reservation: ReservationRow
  onClose: () => void
  onUpdateStatus: (status: ReservationStatus) => void
  error: string | null
  success: string | null
  isDemo: boolean
}) {
  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(8,7,5,0.85)] px-8 py-8 backdrop-blur-md"
    >
      <div className="border-ember-gold bg-ember-dark relative max-h-[90vh] w-full max-w-[540px] overflow-y-auto border p-8">
        <button
          onClick={onClose}
          className="border-ember-border hover:border-ember-gold hover:text-ember-gold absolute top-4 right-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border bg-transparent text-base text-ember-cream transition-colors"
          aria-label="Close"
        >
          ×
        </button>

        <div className="mb-6">
          <StatusBadge status={r.status} />
        </div>

        <h2 className="font-display mb-1 text-[1.8rem] font-light">
          {r.first_name}{' '}
          <span className="text-ember-gold">{r.last_name}</span>
        </h2>

        {error && (
          <div className="mt-4 mb-4 border border-[rgba(201,122,122,0.4)] bg-[rgba(201,122,122,0.06)] px-4 py-3 text-[0.82rem] text-[#c97a7a]">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 mb-4 border border-[rgba(111,179,138,0.4)] bg-[rgba(111,179,138,0.06)] px-4 py-3 text-[0.82rem] text-[#6fb38a]">
            {success}
          </div>
        )}

        <div className="border-ember-border my-5 grid grid-cols-2 gap-x-6 gap-y-4 border-y py-5 max-md:grid-cols-1">
          <Detail label="Date" value={formatLongDate(r.reservation_date)} />
          <Detail label="Time" value={r.reservation_time} />
          <Detail label="Party" value={`${r.party_size} guests`} />
          <Detail label="Occasion" value={r.occasion || '—'} />
          <Detail label="Email" value={r.email} full />
          <Detail label="Phone" value={r.phone} full />
          {r.notes && <Detail label="Notes" value={r.notes} full />}
          <Detail
            label="Submitted"
            value={new Date(r.created_at).toLocaleString()}
            full
          />
        </div>

        {isDemo ? (
          <div className="border border-[rgba(201,162,83,0.25)] bg-[rgba(201,162,83,0.06)] px-4 py-3 text-[0.75rem] tracking-[0.08em] text-ember-gold-2">
            Status updates are disabled in demo mode.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <h4 className="w-full text-[0.62rem] font-medium tracking-[0.2em] text-[rgba(245,240,232,0.45)] uppercase">
              Update status
            </h4>
            {RESERVATION_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => onUpdateStatus(s)}
                disabled={r.status === s}
                className="border-ember-border hover:border-ember-gold hover:text-ember-gold inline-flex cursor-pointer items-center gap-2 border bg-transparent px-3 py-2 text-[0.65rem] font-medium tracking-[0.16em] text-ember-cream uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Detail({
  label,
  value,
  full,
}: {
  label: string
  value: string
  full?: boolean
}) {
  return (
    <div className={`flex flex-col gap-1 ${full ? 'col-span-full' : ''}`}>
      <span className="text-[0.6rem] tracking-[0.2em] text-[rgba(245,240,232,0.45)] uppercase">
        {label}
      </span>
      <span className="text-[0.92rem] break-words text-ember-cream">
        {value}
      </span>
    </div>
  )
}
