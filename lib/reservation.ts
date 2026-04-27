import { z } from 'zod'

export const RESERVATION_STATUSES = [
  'pending',
  'confirmed',
  'seated',
  'no_show',
  'cancelled',
] as const

export type ReservationStatus = (typeof RESERVATION_STATUSES)[number]

export const reservationFormSchema = z.object({
  first_name: z.string().trim().min(1, 'First name is required'),
  last_name: z.string().trim().min(1, 'Last name is required'),
  email: z.string().trim().toLowerCase().email('Valid email required'),
  phone: z.string().trim().min(7, 'Phone number is required'),
  party_size: z.string().min(1, 'Select a party size'),
  reservation_date: z.string().min(1, 'Pick a date'),
  reservation_time: z.string().min(1, 'Pick a time'),
  occasion: z.string().trim().optional().nullable(),
  notes: z.string().trim().max(500).optional().nullable(),
})

export type ReservationForm = z.infer<typeof reservationFormSchema>

export type ReservationRow = ReservationForm & {
  id: string
  created_at: string
  offer_code: string | null
  source: string | null
  status: ReservationStatus
}

export const STATUS_LABELS: Record<ReservationStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  seated: 'Seated',
  no_show: 'No-show',
  cancelled: 'Cancelled',
}
