import ShellLayout from '@/components/ShellLayout'
import FellowshipCounselingClient from '@/components/FellowshipCounselingClient'
import { getFellowshipData } from '@/lib/mappers/fellowship'

export default async function FellowshipCounselingPage() {
  const data = await getFellowshipData()
  return (
    <ShellLayout>
      <FellowshipCounselingClient data={data} />
    </ShellLayout>
  )
}
