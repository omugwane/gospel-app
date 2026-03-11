import ShellLayout from '@/components/ShellLayout'
import PlanContentReaderClient from '@/components/PlanContentReaderClient'
import { getPlansData } from '@/lib/mappers/plans'

export default async function PlanContentPage({
  params,
}: {
  params: Promise<{ id: string; dayNumber: string; contentId: string }>
}) {
  const { id, dayNumber, contentId } = await params
  const dayNum = parseInt(dayNumber, 10)
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

  const planDays = data.planDays[plan.id] || []
  const day = planDays.find((d) => d.dayNumber === dayNum)
  const content = day?.content.find((c) => c.id === contentId)

  if (!content) {
    return (
      <ShellLayout>
        <div className="mx-auto max-w-5xl px-4 py-8">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Content not found.</p>
        </div>
      </ShellLayout>
    )
  }

  return (
    <ShellLayout>
      <PlanContentReaderClient
        data={data}
        plan={plan}
        dayNumber={dayNum}
        content={content}
        locale={locale}
      />
    </ShellLayout>
  )
}
