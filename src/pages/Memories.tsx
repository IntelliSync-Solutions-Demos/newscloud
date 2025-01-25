import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  PlusIcon, 
  FilterIcon, 
  CalendarIcon, 
  TagIcon 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { MemoryService } from '@/services/memoryService';
import { Memory, MemoryFilter } from '@/types/Memory';
import { AddMemoryModal } from '@/components/modals/AddMemoryModal';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const Memories: React.FC = () => {
  const { user } = useAuth();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isAddMemoryModalOpen, setIsAddMemoryModalOpen] = useState(false);
  const [filter, setFilter] = useState<MemoryFilter>({});
  const [page, setPage] = useState(1);
  const [totalMemories, setTotalMemories] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (user) {
      fetchMemories();
    }
  }, [user, page, filter]);

  const fetchMemories = async () => {
    if (!user) return;

    try {
      const result = await MemoryService.getUserMemories(
        user.id, 
        page, 
        10, 
        filter
      );

      setMemories(result.items);
      setTotalMemories(result.total);
    } catch (error) {
      console.error('Failed to fetch memories', error);
    }
  };

  const handleAddTag = () => {
    if (newTag && !selectedTags.includes(newTag)) {
      const updatedTags = [...selectedTags, newTag];
      setSelectedTags(updatedTags);
      setFilter(prev => ({ ...prev, tags: updatedTags }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = selectedTags.filter(tag => tag !== tagToRemove);
    setSelectedTags(updatedTags);
    setFilter(prev => ({ ...prev, tags: updatedTags }));
  };

  const handleMemoryAdded = (newMemory: Memory) => {
    setMemories(prev => [newMemory, ...prev]);
    toast.success('Memory added successfully');
  };

  const renderMemoryTimeline = () => {
    return memories.map((memory, index) => (
      <motion.div 
        key={memory.id || index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {memory.title}
          </h3>
          <span className="text-sm text-gray-500">
            {format(new Date(memory.date), 'PPP')}
          </span>
        </div>
        
        {memory.imageUrl && (
          <img 
            src={memory.imageUrl} 
            alt={memory.title} 
            className="w-full h-64 object-cover rounded-md mb-4"
          />
        )}
        
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {memory.description || memory.content}
        </p>
        
        {memory.tags && memory.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {memory.tags.map(tag => (
              <span 
                key={tag} 
                className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    ));
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Please log in to view your memories</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Memories</h1>
        <Button onClick={() => setIsAddMemoryModalOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add Memory
        </Button>
      </div>

      <div className="flex space-x-4 mb-6">
        <div className="flex items-center space-x-2 flex-grow">
          <Input 
            placeholder="Add a tag" 
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
          />
          <Button 
            variant="outline" 
            onClick={handleAddTag}
          >
            <TagIcon className="mr-2 h-4 w-4" /> Add Tag
          </Button>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <CalendarIcon className="mr-2 h-4 w-4" /> 
              {filter.startDate ? format(filter.startDate, 'PPP') : 'Start Date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filter.startDate}
              onSelect={(date) => setFilter(prev => ({ ...prev, startDate: date }))}
              disabled={(date) => date > new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <CalendarIcon className="mr-2 h-4 w-4" /> 
              {filter.endDate ? format(filter.endDate, 'PPP') : 'End Date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filter.endDate}
              onSelect={(date) => setFilter(prev => ({ ...prev, endDate: date }))}
              disabled={(date) => date > new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedTags.map(tag => (
            <Button 
              key={tag} 
              variant="secondary" 
              size="sm"
              onClick={() => handleRemoveTag(tag)}
            >
              {tag} ✕
            </Button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {renderMemoryTimeline()}
      </AnimatePresence>

      {memories.length === 0 && (
        <div className="text-center text-gray-500">
          No memories yet. Add your first memory!
        </div>
      )}

      <AddMemoryModal 
        isOpen={isAddMemoryModalOpen}
        onOpenChange={setIsAddMemoryModalOpen}
        onMemoryAdded={handleMemoryAdded}
      />
    </div>
  );
};

export default Memories;
