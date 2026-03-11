import ShellLayout from '@/components/ShellLayout'
import LibraryDownloadsClient from '@/components/LibraryDownloadsClient'
import { getLibraryData } from '@/lib/mappers/library'

export default async function LibraryDownloadsPage() {
  const data = await getLibraryData()
  const locale = (data.viewer.preferredLanguage ?? 'rw') as 'rw' | 'en' | 'fr'
  return (
    <ShellLayout>
      <LibraryDownloadsClient data={data} locale={locale} />
    </ShellLayout>
  )
}
