import ShellLayout from '@/components/ShellLayout'
import LibrarySavedClient from '@/components/LibrarySavedClient'
import { getLibraryData } from '@/lib/mappers/library'

export default async function LibrarySavedPage() {
  const data = await getLibraryData()
  return (
    <ShellLayout>
      <LibrarySavedClient data={data} />
    </ShellLayout>
  )
}
