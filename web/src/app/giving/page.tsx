import ShellLayout from '@/components/ShellLayout'
import GivingClient from '@/components/GivingClient'
import { getGivingData } from '@/lib/mappers/giving'

export default async function GivingPage() {
  const data = await getGivingData()
  return (
    <ShellLayout>
      <GivingClient data={data} />
    </ShellLayout>
  )
}
