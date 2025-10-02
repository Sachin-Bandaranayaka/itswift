export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      testimonials: {
        Row: {
          id: string
          name: string
          role: string
          company: string
          content: string
          rating: number
          avatar_url: string | null
          display_order: number | null
          is_active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          role: string
          company: string
          content: string
          rating?: number
          avatar_url?: string | null
          display_order?: number | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          role?: string
          company?: string
          content?: string
          rating?: number
          avatar_url?: string | null
          display_order?: number | null
          is_active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      // Add other tables as needed
    }
  }
}


