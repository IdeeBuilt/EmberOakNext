import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { ReservationRow } from '@/lib/reservation'
import { AdminDashboard } from './AdminDashboard'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: reservations } = await supabase
    .from('reservations')
    .select('*')
    .order('reservation_date', { ascending: true })
    .order('reservation_time', { ascending: true })

  return (
    <AdminDashboard
      initialReservations={(reservations as ReservationRow[] | null) ?? []}
      userEmail={user.email ?? ''}
    />
  )
}
