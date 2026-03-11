import ShellLayout from '@/components/ShellLayout'
import ExhortationDetailClient from '@/components/ExhortationDetailClient'
import { getHomeData } from '@/lib/mappers/home'

export default async function ExhortationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const data = await getHomeData()
  const { id } = await params
  return (
    <ShellLayout>
      <ExhortationDetailClient key={id} data={data} locale={data.viewer.locale} />
    </ShellLayout>
  )
}
