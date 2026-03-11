import ShellLayout from '@/components/ShellLayout'
import GivingHistoryClient from '@/components/GivingHistoryClient'
import { getGivingData } from '@/lib/mappers/giving'

export default async function GivingHistoryPage() {
  const data = await getGivingData()
  return (
    <ShellLayout>
      <GivingHistoryClient data={data} />
    </ShellLayout>
  )
}
