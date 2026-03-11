import ShellLayout from '@/components/ShellLayout'
import { CounselingRequestDetail } from '@/product/sections/fellowship/components'
import { getFellowshipData } from '@/lib/mappers/fellowship'
import FellowshipCounselingRequestClient from '@/components/FellowshipCounselingRequestClient'

export default async function FellowshipCounselingRequestPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const data = await getFellowshipData()
  const request = data.counselingRequests.find((r) => r.id === id)

  if (!request) {
    return (
      <ShellLayout>
        <div className="mx-auto max-w-2xl px-4 py-8">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">Request not found.</p>
        </div>
      </ShellLayout>
    )
  }

  return (
    <ShellLayout>
      <FellowshipCounselingRequestClient request={request} />
    </ShellLayout>
  )
}
