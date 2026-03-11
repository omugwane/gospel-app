import ShellLayout from '@/components/ShellLayout'
import VerseDetailClient from '@/components/VerseDetailClient'
import { getHomeData } from '@/lib/mappers/home'

export default async function VerseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const data = await getHomeData()
  const { id } = await params
  return (
    <ShellLayout>
      <VerseDetailClient key={id} data={data} locale={data.viewer.locale} />
    </ShellLayout>
  )
}
