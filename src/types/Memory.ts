import { User } from '@supabase/supabase-js';

export interface Memory {
  id?: string;
  userId: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  imageUrl?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMemoryDTO {
  title?: string;
  description?: string;
  content?: string;
  tags: string[];
  imageUrl?: string;
  date: Date;
}

export interface MemoryFilter {
  tags?: string[];
  startDate?: Date;
  endDate?: Date;
}
