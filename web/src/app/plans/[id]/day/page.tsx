import { notFound } from 'next/navigation'
import ShellLayout from '@/components/ShellLayout'
import PlanDayViewClient from '@/components/PlanDayViewClient'
import { getPlansData } from '@/lib/mappers/plans'

export default async function PlanDayPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ day?: string }>
}) {
  const { id } = await params
  const { day } = await searchParams
  const data = await getPlansData()
  const plan = data.plans.find((p) => p.id === id)
  const locale = 'rw' as const
  const initialDay = day ? parseInt(day, 10) : undefined

  if (!plan) {
    notFound()
  }

  return (
    <ShellLayout>
      <PlanDayViewClient
        data={data}
        planId={id}
        initialDay={Number.isNaN(initialDay) ? undefined : initialDay}
        locale={locale}
      />
    </ShellLayout>
  )
}
