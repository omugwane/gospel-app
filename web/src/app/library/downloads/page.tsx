import ShellLayout from '@/components/ShellLayout'
import LibraryDownloadsClient from '@/components/LibraryDownloadsClient'
import { getLibraryData } from '@/lib/mappers/library'

export default async function LibraryDownloadsPage() {
  const data = await getLibraryData()
  return (
    <ShellLayout>
      <LibraryDownloadsClient data={data} />
    </ShellLayout>
  )
}
