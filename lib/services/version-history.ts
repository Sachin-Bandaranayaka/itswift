// Removed Sanity dependency to keep this service decoupled

export interface VersionHistoryEntry {
  postId: string
  action: 'created' | 'updated' | 'published' | 'unpublished' | 'deleted'
  metadata?: {
    title?: string
    publishedAt?: string | null
    hasSchedule?: boolean
    [key: string]: any
  }
  timestamp?: string
}

export class VersionHistoryService {
  static async createEntry(entry: VersionHistoryEntry): Promise<void> {
    try {
      const versionEntry = {
        _type: 'versionHistory',
        postId: entry.postId,
        action: entry.action,
        metadata: entry.metadata || {},
        timestamp: entry.timestamp || new Date().toISOString(),
        _createdAt: new Date().toISOString()
      }

      // For now, we'll just log this. In a full implementation, you might want to:
      // 1. Store in a separate Sanity document type
      // 2. Store in a separate database table
      // 3. Use a dedicated versioning service
      console.log('Version History Entry:', versionEntry)

      // Optional: Store in CMS/DB if you have a versionHistory document/table
      // e.g., await db.insert('version_history').values(versionEntry)
    } catch (error) {
      console.error('Error creating version history entry:', error)
      // Don't throw - version history should not break the main operation
    }
  }

  static async getVersionHistory(postId: string, limit: number = 50): Promise<any[]> {
    try {
      // This would query your version history storage
      // For now, returning empty array as this is just to prevent the HTTP call issue
      return []
    } catch (error) {
      console.error('Error fetching version history:', error)
      return []
    }
  }
}