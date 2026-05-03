import { notFound } from 'next/navigation'
import ShellLayout from '@/components/ShellLayout'
import LibrarySermonClient from '@/components/LibrarySermonClient'
import { getLibraryData } from '@/lib/mappers/library'

export default async function LibrarySermonPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ play?: string }>
}) {
  const { id } = await params
  const { play } = await searchParams
  const data = await getLibraryData()
  const sermon = data.sermons.find((s) => s.id === id)
  if (!sermon) {
    notFound()
  }
  return (
    <ShellLayout>
      <LibrarySermonClient
        data={data}
        sermonId={id}
        autoplayAudioOnMount={play === '1'}
      />
    </ShellLayout>
  )
}
