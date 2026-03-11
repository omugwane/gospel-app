import ShellLayout from '@/components/ShellLayout'
import LivePrayerDetailClient from '@/components/LivePrayerDetailClient'
import { getHomeData } from '@/lib/mappers/home'

export default async function LivePrayerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const data = await getHomeData()
  const { id } = await params
  return (
    <ShellLayout>
      <LivePrayerDetailClient key={id} data={data} locale={data.viewer.locale} />
    </ShellLayout>
  )
}