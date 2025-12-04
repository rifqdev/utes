import { Database } from './database.types';

// Table Row Types
export type Profile = Database['public']['Tables']['profiles']['Row'];

// Insert Types
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];

// Update Types
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

// Re-export Database type
export type { Database };
