import { notFound } from 'next/navigation'
import ShellLayout from '@/components/ShellLayout'
import PlanMissedDaysClient from '@/components/PlanMissedDaysClient'
import { getPlansData } from '@/lib/mappers/plans'

export default async function PlanMissedDaysPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ start?: string }>
}) {
  const { id } = await params
  const { start } = await searchParams
  const data = await getPlansData()
  const plan = data.plans.find((p) => p.id === id)
  const locale = 'rw' as const

  if (!plan) {
    notFound()
  }

  return (
    <ShellLayout>
      <PlanMissedDaysClient
        data={data}
        planId={id}
        startDateIso={start}
        locale={locale}
      />
    </ShellLayout>
  )
}
