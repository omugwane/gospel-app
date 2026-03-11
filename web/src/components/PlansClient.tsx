'use client'

import type { LanguageCode, PlansData, PlanFilter } from '@/product/sections/plans/types'
import { PlansHome } from '@/product/sections/plans/components'
import { usePlansCallbacks } from '@/lib/plans-callbacks'

export default function PlansClient({
  data,
  locale,
  initialFilter,
}: {
  data: PlansData
  locale: LanguageCode
  initialFilter?: PlanFilter
}) {
  const callbacks = usePlansCallbacks(data)

  const mergedData: PlansData = {
    ...data,
    activeFilter: initialFilter ?? data.activeFilter,
  }

  return (
    <PlansHome
      data={mergedData}
      locale={locale}
      {...callbacks}
    />
  )
}
