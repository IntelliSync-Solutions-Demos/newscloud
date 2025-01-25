import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Video } from '@/services/videoService';
import { 
  MoreVertical, 
  Trash2, 
  Edit, 
  Plus, 
  X 
} from 'lucide-react';
import { VideoService } from '@/services/videoService';

interface VideoCardProps {
  video: Video;
  onDelete: () => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  onUpdateCategory: (category: string) => void;
}

export function VideoCard({ 
  video, 
  onDelete, 
  onAddTag, 
  onRemoveTag, 
  onUpdateCategory 
}: VideoCardProps) {
  const [newTag, setNewTag] = useState('');
  const [isTagInputVisible, setIsTagInputVisible] = useState(false);

  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(newTag.trim());
      setNewTag('');
      setIsTagInputVisible(false);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="p-0 relative">
        <div className="absolute top-2 right-2 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem 
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <img 
          src={video.url} 
          alt={video.name} 
          className="w-full h-48 object-cover rounded-t-lg" 
        />
      </CardHeader>
      
      <CardContent className="p-4 space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold truncate">{video.name}</h3>
          
          {/* Category Selection */}
          <Select 
            value={video.category} 
            onValueChange={onUpdateCategory}
          >
            <SelectTrigger className="w-[120px] text-xs">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {VideoService.getCategories().map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 items-center">
          {video.tags.map(tag => (
            <div 
              key={tag} 
              className="bg-muted px-2 py-1 rounded-full text-xs flex items-center"
            >
              {tag}
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-1 h-4 w-4"
                onClick={() => onRemoveTag(tag)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          
          {/* Add Tag Button */}
          {!isTagInputVisible ? (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsTagInputVisible(true)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          ) : (
            <div className="flex items-center space-x-1">
              <Input 
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="New tag"
                className="w-24 h-8 text-xs"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleAddTag}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                  setNewTag('');
                  setIsTagInputVisible(false);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
        <div className="flex justify-between w-full">
          <span>{new Date(video.uploadedAt).toLocaleDateString()}</span>
          <span>{(video.size / 1024 / 1024).toFixed(2)} MB</span>
        </div>
      </CardFooter>
    </Card>
  );
}