import type { Metadata } from 'next'
import LoginClient from '@/components/LoginClient'

export const metadata: Metadata = {
  title: 'Sign in · Senga App',
  description: 'Sign in with your Google account to continue using Senga.',
}

export default function LoginPage() {
  return <LoginClient />
}
