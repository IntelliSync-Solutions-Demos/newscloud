Need to install the following packages:
supabase@2.6.8
Ok to proceed? (y) 

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
      user_sidebar_preferences: {
        Row: {
          user_id: string
          personal_favorites_order: string[]
        }
        Insert: {
          user_id: string
          personal_favorites_order?: string[] | null
        }
        Update: {
          user_id?: string
          personal_favorites_order?: string[] | null
        }
      }
    }
  }
}