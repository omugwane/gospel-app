import ShellLayout from '@/components/ShellLayout'
import LibraryClient from '@/components/LibraryClient'
import { getLibraryData } from '@/lib/mappers/library'

export default async function LibraryPage() {
  const data = await getLibraryData()
  return (
    <ShellLayout>
      <LibraryClient data={data} />
    </ShellLayout>
  )
}
