import ShellLayout from '@/components/ShellLayout'
import PlansClient from '@/components/PlansClient'
import { getPlansData } from '@/lib/mappers/plans'
import type { PlanFilter } from '@/product/sections/plans/types'

export default async function PlansPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; plan?: string }>
}) {
  const { filter, plan } = await searchParams
  const data = await getPlansData()
  const validFilters: PlanFilter[] = ['my', 'find', 'saved', 'completed']
  const initialFilter = filter && validFilters.includes(filter as PlanFilter)
    ? (filter as PlanFilter)
    : undefined
  const locale = 'rw' as const

  if (plan && data.plans.some((p) => p.id === plan)) {
    const { redirect } = await import('next/navigation')
    redirect(`/plans/${plan}`)
  }

  return (
    <ShellLayout>
      <PlansClient data={data} locale={locale} initialFilter={initialFilter} />
    </ShellLayout>
  )
}
