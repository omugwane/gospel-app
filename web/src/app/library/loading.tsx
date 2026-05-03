import ShellLayout from '@/components/ShellLayout'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'

export default function LibraryLoading() {
  return (
    <ShellLayout>
      <LoadingSkeleton blocks={4} />
    </ShellLayout>
  )
}
