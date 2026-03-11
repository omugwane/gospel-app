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
    return (
      <ShellLayout>
        <div className="mx-auto max-w-5xl px-4 py-8">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Plan not found.</p>
        </div>
      </ShellLayout>
    )
  }

  return (
    <ShellLayout>
      <PlanDetailClient data={data} plan={plan} locale={locale} />
    </ShellLayout>
  )
}
