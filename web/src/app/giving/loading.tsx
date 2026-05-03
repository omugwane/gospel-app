import ShellLayout from '@/components/ShellLayout'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'

export default function GivingLoading() {
  return (
    <ShellLayout>
      <LoadingSkeleton blocks={3} />
    </ShellLayout>
  )
}
