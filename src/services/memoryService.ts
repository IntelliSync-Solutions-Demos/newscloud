import { supabase } from '@/lib/supabase';
import { Memory, CreateMemoryDTO, MemoryFilter } from '@/types/Memory';
import { toast } from 'sonner';

export class MemoryService {
  static async createMemory(userId: string, memory: CreateMemoryDTO): Promise<Memory> {
    try {
      const { data, error } = await supabase
        .from('memories')
        .insert({
          ...memory,
          userId,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Memory created successfully');
      return data;
    } catch (error) {
      toast.error('Failed to create memory');
      console.error('Create Memory Error:', error);
      throw error;
    }
  }

  static async getUserMemories(
    userId: string, 
    page: number = 1, 
    pageSize: number = 10,
    filter?: MemoryFilter
  ): Promise<{ items: Memory[], page: number, total: number }> {
    try {
      let query = supabase
        .from('memories')
        .select('*', { count: 'exact' })
        .eq('userId', userId)
        .order('date', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1);

      // Apply optional filters
      if (filter?.tags && filter.tags.length > 0) {
        query = query.contains('tags', filter.tags);
      }
      
      if (filter?.startDate) {
        query = query.gte('date', filter.startDate.toISOString());
      }
      
      if (filter?.endDate) {
        query = query.lte('date', filter.endDate.toISOString());
      }

      const { data, count, error } = await query;

      if (error) throw error;

      return {
        items: data || [],
        page,
        total: count || 0
      };
    } catch (error) {
      toast.error('Failed to fetch memories');
      console.error('Get Memories Error:', error);
      throw error;
    }
  }

  static async updateMemory(memoryId: string, updates: Partial<Memory>): Promise<Memory> {
    try {
      const { data, error } = await supabase
        .from('memories')
        .update({
          ...updates,
          updatedAt: new Date()
        })
        .eq('id', memoryId)
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Memory updated successfully');
      return data;
    } catch (error) {
      toast.error('Failed to update memory');
      console.error('Update Memory Error:', error);
      throw error;
    }
  }

  static async deleteMemory(memoryId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('memories')
        .delete()
        .eq('id', memoryId);

      if (error) throw error;
      
      toast.success('Memory deleted successfully');
    } catch (error) {
      toast.error('Failed to delete memory');
      console.error('Delete Memory Error:', error);
      throw error;
    }
  }
}
