import ShellLayout from '@/components/ShellLayout'
import LibrarySearchClient from '@/components/LibrarySearchClient'
import { getLibraryData } from '@/lib/mappers/library'

export default async function LibrarySearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; topic?: string }>
}) {
  const { q, topic } = await searchParams
  const data = await getLibraryData()
  const locale = (data.viewer.preferredLanguage ?? 'rw') as 'rw' | 'en' | 'fr'
  return (
    <ShellLayout>
      <LibrarySearchClient
        data={data}
        initialQuery={q}
        initialTopicId={topic ?? undefined}
        locale={locale}
      />
    </ShellLayout>
  )
}
