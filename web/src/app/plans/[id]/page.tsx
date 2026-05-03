import { notFound } from 'next/navigation'
import ShellLayout from '@/components/ShellLayout'
import PlanDetailClient from '@/components/PlanDetailClient'
import { getPlansData } from '@/lib/mappers/plans'

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const data = await getPlansData()
  const plan = data.plans.find((p) => p.id === id)
  const locale = 'rw' as const

  if (!plan) {
    notFound()
  }

  return (
    <ShellLayout>
      <PlanDetailClient data={data} plan={plan} locale={locale} />
    </ShellLayout>
  )
}
