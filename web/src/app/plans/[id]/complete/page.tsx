import { notFound } from 'next/navigation'
import ShellLayout from '@/components/ShellLayout'
import PlanCompleteClient from '@/components/PlanCompleteClient'
import { getPlansData } from '@/lib/mappers/plans'

export default async function PlanCompletePage({
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
      <PlanCompleteClient data={data} plan={plan} locale={locale} />
    </ShellLayout>
  )
}
