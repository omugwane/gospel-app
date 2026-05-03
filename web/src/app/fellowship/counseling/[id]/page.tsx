import { notFound } from 'next/navigation'
import ShellLayout from '@/components/ShellLayout'
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
    notFound()
  }

  return (
    <ShellLayout>
      <FellowshipCounselingRequestClient request={request} />
    </ShellLayout>
  )
}
