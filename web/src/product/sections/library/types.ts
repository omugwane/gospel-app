export type LanguageCode = 'rw' | 'en' | 'fr'

export interface LanguageOption {
  code: LanguageCode
  label: string
}

export interface Viewer {
  userId: string
  displayName: string
  preferredLanguage: LanguageCode
}

export interface Topic {
  id: string
  label: string
  translations?: Partial<Record<LanguageCode, { label: string }>>
}

export interface Series {
  id: string
  title: string
  description: string
  sermonCount: number
  topicIds: string[]
  translations?: Partial<Record<LanguageCode, { title: string; description: string }>>
}

export type MediaKind = 'audio' | 'video'

export interface MediaAsset {
  id: string
  kind: MediaKind
  url: string
  mimeType: string
  byteSize: number
}

export interface SermonAvailability {
  hasAudio: boolean
  hasVideo: boolean
  hasTranscript: boolean
}

export type DownloadState =
  | 'notDownloaded'
  | 'downloading'
  | 'downloaded'
  | 'failed'
  | 'notApplicable'

export interface Sermon {
  id: string
  title: string
  publishedAt: string
  durationSeconds: number
  scriptureReferences: string[]
  summary: string
  seriesId: string | null
  topicIds: string[]
  availability: SermonAvailability
  mediaAssets: MediaAsset[]
  notes: {
    transcript: string
  }
  translations?: Partial<
    Record<
      LanguageCode,
      {
        title: string
        summary: string
        transcript: string
      }
    >
  >
  actions: {
    canPlayAudio: boolean
    canWatchVideo: boolean
    canDownload: boolean
    canShare: boolean
    canSave: boolean
    canAddToQueue: boolean
    canMarkCompleted: boolean
  }
  offline: {
    downloadState: DownloadState
    downloadId?: string
    isRecommendedForDownload?: boolean
  }
}

export interface SavedState {
  savedSermonIds: string[]
  savedSeriesIds: string[]
}

export interface ListeningQueueState {
  queueSermonIds: string[]
}

export interface Download {
  id: string
  mediaAssetId: string
  createdAt: string
  byteSize: number
  state: Exclude<DownloadState, 'notDownloaded' | 'notApplicable'>
}

export interface SearchFilters {
  seriesId: string | null
  topicId: string | null
  hasAudio: boolean | null
  hasVideo: boolean | null
  hasTranscript: boolean | null
}

export interface SearchState {
  query: string
  filters: SearchFilters
  recentQueries: string[]
  resultSermonIds: string[]
}

export interface LibraryTranslations {
  title?: string
  subtitle?: string
  search?: string
  searchPlaceholder?: string
  searchPlaceholderShort?: string
  searchResults?: string
  series?: string
  topic?: string
  allSeries?: string
  saved?: string
  browseBySeries?: string
  play?: string
  download?: string
  save?: string
  unsaveSermon?: string
  unsaveSeries?: string
  saveSermon?: string
  saveSeries?: string
  offline?: string
  suggested?: string
  inQueue?: string
  transcript?: string
  audio?: string
  video?: string
  notes?: string
  clearFilters?: string
  noResults?: string
  tryShorterKeyword?: string
  searchIncludesTranscript?: string
  unknownSermon?: string
  downloadsTitle?: string
  removeDownload?: string
}

export const DEFAULT_LIBRARY_TRANSLATIONS: LibraryTranslations = {
  title: 'Library',
  subtitle: "Browse calmly. Search precisely. Save what you'll need offline.",
  search: 'Search',
  searchPlaceholder: 'Search: title, summary, scripture, notes…',
  searchPlaceholderShort: 'Search sermons…',
  searchResults: 'Search results',
  series: 'Series',
  topic: 'Topic',
  allSeries: 'All series',
  saved: 'saved',
  browseBySeries: 'Browse teachings by series. Save your favorites for quick access.',
  play: 'Play',
  download: 'Download',
  save: 'Save',
  unsaveSermon: 'Unsave sermon',
  unsaveSeries: 'Unsave series',
  saveSermon: 'Save sermon',
  saveSeries: 'Save series',
  offline: 'Offline',
  suggested: 'Suggested',
  inQueue: 'In queue',
  transcript: 'Transcript',
  audio: 'Audio',
  video: 'Video',
  notes: 'Notes',
  clearFilters: 'Clear filters',
  noResults: 'No results',
  tryShorterKeyword: 'Try a shorter keyword, change language, or clear filters.',
  searchIncludesTranscript: 'Search includes transcript/notes when available — helpful for finding a teaching by a key phrase.',
  unknownSermon: 'Unknown sermon',
  downloadsTitle: 'Downloads',
  removeDownload: 'Remove',
}

export interface LibraryData {
  languageOptions?: LanguageOption[]
  viewer: Viewer
  topics: Topic[]
  series: Series[]
  sermons: Sermon[]
  saved: SavedState
  listeningQueue: ListeningQueueState
  downloads: Download[]
  searchState: SearchState
}

export interface LibraryProps {
  data: LibraryData
  /** App-level locale; content is displayed in this language with fallback. */
  locale: LanguageCode
  /** Translated UI labels; falls back to DEFAULT_LIBRARY_TRANSLATIONS when omitted. */
  translations?: Partial<LibraryTranslations>
  /**
   * Fired when the user opens a series to browse its sermons.
   */
  onOpenSeries?: (seriesId: string) => void
  /**
   * Fired when the user wants to browse all series (e.g. "View all series" link).
   */
  onBrowseAllSeries?: () => void
  /**
   * Fired when the user opens a topic to browse sermons for that theme.
   */
  onOpenTopic?: (topicId: string) => void
  /**
   * Fired when the user opens a specific sermon (detail view).
   */
  onOpenSermon?: (sermonId: string) => void
  /**
   * Fired when the user starts audio playback for a sermon.
   */
  onPlaySermonAudio?: (sermonId: string) => void
  /**
   * Fired when the user chooses to watch the video for a sermon.
   */
  onWatchSermonVideo?: (sermonId: string) => void
  /**
   * Fired when the user downloads a sermon for offline listening.
   */
  onDownloadSermon?: (sermonId: string) => void
  /**
   * Fired when the user removes a previously downloaded sermon.
   */
  onRemoveDownload?: (downloadId: string) => void
  /**
   * Fired when the user shares a sermon.
   */
  onShareSermon?: (sermonId: string) => void
  /**
   * Fired when the user toggles a sermon bookmark/save.
   */
  onToggleSaveSermon?: (sermonId: string, saved: boolean) => void
  /**
   * Fired when the user toggles saving a series.
   */
  onToggleSaveSeries?: (seriesId: string, saved: boolean) => void
  /**
   * Fired when the user adds a sermon to the listening queue.
   */
  onAddToQueue?: (sermonId: string) => void
  /**
   * Fired when the user marks a sermon completed/listened.
   */
  onMarkSermonCompleted?: (sermonId: string, completed: boolean) => void
  /**
   * Fired when the user updates the search query.
   */
  onSearch?: (query: string) => void
  /**
   * Fired when the user updates search filters.
   */
  onUpdateSearchFilters?: (filters: SearchFilters) => void
  /**
   * Fired when the user navigates back (e.g. from series view, downloads, search).
   */
  onBack?: () => void
  /**
   * Fired when the user opens the downloads/offline view.
   */
  onOpenDownloads?: () => void
}

