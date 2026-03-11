import ShellLayout from '@/components/ShellLayout'
import LibrarySermonClient from '@/components/LibrarySermonClient'
import { getLibraryData } from '@/lib/mappers/library'

export default async function LibrarySermonPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const data = await getLibraryData()
  const locale = (data.viewer.preferredLanguage ?? 'rw') as 'rw' | 'en' | 'fr'
  return (
    <ShellLayout>
      <LibrarySermonClient data={data} sermonId={id} locale={locale} />
    </ShellLayout>
  )
}
