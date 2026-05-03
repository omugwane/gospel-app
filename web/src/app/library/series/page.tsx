import ShellLayout from '@/components/ShellLayout'
import LibrarySeriesClient from '@/components/LibrarySeriesClient'
import { getLibraryData } from '@/lib/mappers/library'

export default async function LibrarySeriesPage() {
  const data = await getLibraryData()
  return (
    <ShellLayout>
      <LibrarySeriesClient data={data} />
    </ShellLayout>
  )
}
