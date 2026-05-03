'use client'

import { Suspense } from 'react'
import { AuthProvider } from '@/components/auth-context'
import AuthGate from '@/components/AuthGate'
import { LibraryOverlayProvider } from '@/lib/library-overlay'

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LibraryOverlayProvider>
        <Suspense fallback={null}>
          <AuthGate>{children}</AuthGate>
        </Suspense>
      </LibraryOverlayProvider>
    </AuthProvider>
  )
}
