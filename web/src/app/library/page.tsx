import ShellLayout from '@/components/ShellLayout'
import LibraryClient from '@/components/LibraryClient'
import { getLibraryData } from '@/lib/mappers/library'

export default async function LibraryPage() {
  const data = await getLibraryData()
  const locale = (data.viewer.preferredLanguage ?? 'rw') as 'rw' | 'en' | 'fr'
  return (
    <ShellLayout>
      <LibraryClient data={data} locale={locale} />
    </ShellLayout>
  )
}
