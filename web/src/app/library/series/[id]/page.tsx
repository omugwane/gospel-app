import { notFound } from 'next/navigation'
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
  const series = data.series.find((s) => s.id === id)
  if (!series) {
    notFound()
  }
  return (
    <ShellLayout>
      <LibrarySeriesIdClient data={data} seriesId={id} />
    </ShellLayout>
  )
}
