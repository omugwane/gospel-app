import ShellLayout from '@/components/ShellLayout'
import HomeClient from '@/components/HomeClient'
import { getHomeData } from '@/lib/mappers/home'

export default async function HomePage() {
  const data = await getHomeData()
  return (
    <ShellLayout>
      <HomeClient data={data} locale={data.viewer.locale} />
    </ShellLayout>
  )
}
