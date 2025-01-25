// Temporary mock Supabase client for UI development
export const supabase = {
  // Mock authentication methods
  auth: {
    signUp: async () => ({ data: { user: null }, error: null }),
    signIn: async () => ({ data: { user: null }, error: null }),
    signOut: async () => ({ error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
  },
  
  // Mock database methods
  from: (tableName: string) => ({
    select: () => ({
      data: [],
      error: null,
    }),
    insert: <T>(data: T) => ({
      data: [data],
      error: null,
    }),
    update: <T>(updates: T) => ({
      data: [updates],
      error: null,
    }),
    delete: () => ({
      data: null,
      error: null,
    }),
    upsert: <T>(data: T[], options?: { onConflict?: string }) => ({
      data: data,
      error: null,
    }),
  }),

  // Mock storage methods
  storage: {
    from: (bucketName: string) => ({
      upload: async () => ({ data: null, error: null }),
      download: async () => ({ data: null, error: null }),
      remove: async () => ({ data: null, error: null }),
    }),
  },
};
