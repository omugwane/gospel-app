import ShellLayout from '@/components/ShellLayout'
import FellowshipClient from '@/components/FellowshipClient'
import { getFellowshipData } from '@/lib/mappers/fellowship'

export default async function FellowshipPage() {
  const data = await getFellowshipData()
  return (
    <ShellLayout>
      <FellowshipClient data={data} />
    </ShellLayout>
  )
}
