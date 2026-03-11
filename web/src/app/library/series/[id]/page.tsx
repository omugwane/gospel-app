import ShellLayout from '@/components/ShellLayout'
import LibrarySeriesIdClient from '@/components/LibrarySeriesIdClient'
import { getLibraryData } from '@/lib/mappers/library'

export default async function LibrarySeriesIdPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const data = await getLibraryData()
  const locale = (data.viewer.preferredLanguage ?? 'rw') as 'rw' | 'en' | 'fr'
  return (
    <ShellLayout>
      <LibrarySeriesIdClient data={data} seriesId={id} locale={locale} />
    </ShellLayout>
  )
}
