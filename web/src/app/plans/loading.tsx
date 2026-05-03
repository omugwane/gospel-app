import ShellLayout from '@/components/ShellLayout'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'

export default function PlansLoading() {
  return (
    <ShellLayout>
      <LoadingSkeleton blocks={3} />
    </ShellLayout>
  )
}
