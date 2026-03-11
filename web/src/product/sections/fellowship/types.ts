export type PrayerTag = 'Health' | 'Family' | 'Finances' | 'Repentance' | 'Spiritual Growth' | 'Youth'

export type PrayerVisibility = 'Public' | 'Ministry Only'

export type PrayerCategory = 'Health' | 'Family' | 'Finances' | 'Repentance' | 'Spiritual Growth' | 'Youth'

export type TestimonyMediaType = 'image' | 'audio'

export type CounselingCategory = 'Marriage/Family' | 'Business' | 'Spiritual Growth' | 'Youth' | 'Crisis'

export type PreferredCounselingMethod = 'WhatsApp Call' | 'In-person at church' | 'Email'

export type CounselingRequestStatus = 'Received' | 'In Review' | 'Scheduled'

export interface FellowshipPresence {
  onlineBelievers: number
  lastUpdatedAt: string
  headline: string
}

export interface TestimonyReactionCounts {
  praiseGodCount: number
  shareCount: number
  viewerPraised: boolean
}

export interface TestimonyMedia {
  type: TestimonyMediaType
  url: string
  durationSeconds?: number
}

export interface Testimony {
  id: string
  displayName: string
  isAnonymous: boolean
  location: string
  content: string
  createdAt: string
  reactions: TestimonyReactionCounts
  media: TestimonyMedia[]
}

export interface PrayerPoint {
  id: string
  title: string
  details: string
  category: PrayerCategory
  visibility: PrayerVisibility
  submittedBy: string
  createdAt: string
  prayedCount: number
  viewerHasPrayed: boolean
  tags: PrayerTag[]
}

export interface CounselingRequest {
  id: string
  category: CounselingCategory
  preferredMethod: PreferredCounselingMethod
  description: string
  status: CounselingRequestStatus
  submittedAt: string
  nextStep: string
  isConfidential: boolean
}

export interface NewTestimonyInput {
  content: string
  isAnonymous: boolean
  location?: string
  media?: TestimonyMedia
}

export interface NewPrayerPointInput {
  title: string
  details: string
  category: PrayerCategory
  visibility: PrayerVisibility
  tags: PrayerTag[]
}

export interface NewCounselingRequestInput {
  category: CounselingCategory
  preferredMethod: PreferredCounselingMethod
  description: string
}

export interface FellowshipProps {
  fellowshipPresence: FellowshipPresence
  testimonies: Testimony[]
  prayerPoints: PrayerPoint[]
  counselingRequests: CounselingRequest[]
  availablePrayerTags: PrayerTag[]
  myPrayerCommitments: string[]

  /**
   * Opens one of the three Fellowship sub-features from the hub cards.
   */
  onOpenFeature?: (feature: 'testimony' | 'prayer' | 'counseling') => void

  /**
   * Submits a new testimony post to the Testimony Wall.
   */
  onCreateTestimony?: (input: NewTestimonyInput) => void

  /**
   * Records a user reaction to a testimony.
   */
  onReactToTestimony?: (testimonyId: string, action: 'praise-god' | 'share') => void

  /**
   * Submits a new prayer point to the prayer list.
   */
  onSubmitPrayerPoint?: (input: NewPrayerPointInput) => void

  /**
   * Marks that the user has prayed for a specific prayer point.
   */
  onCommitPrayer?: (prayerPointId: string) => void

  /**
   * Creates a confidential counseling request for ministry review.
   */
  onSubmitCounselingRequest?: (input: NewCounselingRequestInput) => void

  /**
   * Opens the details of one existing counseling request in "My Requests".
   */
  onOpenCounselingRequest?: (requestId: string) => void

  /**
   * Navigates back to the Fellowship hub.
   */
  onBack?: () => void
}
