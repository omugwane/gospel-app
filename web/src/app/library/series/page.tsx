import ShellLayout from '@/components/ShellLayout'
import LibrarySeriesClient from '@/components/LibrarySeriesClient'
import { getLibraryData } from '@/lib/mappers/library'

export default async function LibrarySeriesPage() {
  const data = await getLibraryData()
  const locale = (data.viewer.preferredLanguage ?? 'rw') as 'rw' | 'en' | 'fr'
  return (
    <ShellLayout>
      <LibrarySeriesClient data={data} locale={locale} />
    </ShellLayout>
  )
}
