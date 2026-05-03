import ShellLayout from '@/components/ShellLayout'
import LibrarySearchClient from '@/components/LibrarySearchClient'
import { getLibraryData } from '@/lib/mappers/library'

export default async function LibrarySearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string
    topic?: string
    series?: string
    audio?: string
    video?: string
    notes?: string
  }>
}) {
  const { q, topic, series, audio, video, notes } = await searchParams
  const data = await getLibraryData()
  return (
    <ShellLayout>
      <LibrarySearchClient
        data={data}
        initialQuery={q}
        initialTopicId={topic}
        initialSeriesId={series}
        initialHasAudio={audio === '1' ? true : undefined}
        initialHasVideo={video === '1' ? true : undefined}
        initialHasTranscript={notes === '1' ? true : undefined}
      />
    </ShellLayout>
  )
}
