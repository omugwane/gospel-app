import ShellLayout from '@/components/ShellLayout'
import FellowshipPrayerClient from '@/components/FellowshipPrayerClient'
import { getFellowshipData } from '@/lib/mappers/fellowship'

export default async function FellowshipPrayerPage() {
  const data = await getFellowshipData()
  return (
    <ShellLayout>
      <FellowshipPrayerClient data={data} />
    </ShellLayout>
  )
}
