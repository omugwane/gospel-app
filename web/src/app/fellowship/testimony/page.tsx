import ShellLayout from '@/components/ShellLayout'
import FellowshipTestimonyClient from '@/components/FellowshipTestimonyClient'
import { getFellowshipData } from '@/lib/mappers/fellowship'

export default async function FellowshipTestimonyPage() {
  const data = await getFellowshipData()
  return (
    <ShellLayout>
      <FellowshipTestimonyClient data={data} />
    </ShellLayout>
  )
}
