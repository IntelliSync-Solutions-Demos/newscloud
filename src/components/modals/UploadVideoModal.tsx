import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { VideoService } from '@/services/videoService';
import { toast } from 'sonner';
import { X, Plus } from 'lucide-react';

interface UploadVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  albumId?: string;
  onUploadSuccess?: () => void;
}

export function UploadVideoModal({ 
  isOpen, 
  onClose, 
  albumId,
  onUploadSuccess
}: UploadVideoModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [category, setCategory] = useState('Other');
  const [description, setDescription] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileList = Array.from(files);
      setSelectedFiles(prevFiles => [...prevFiles, ...fileList]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prevTags => [...prevTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prevTags => prevTags.filter(tag => tag !== tagToRemove));
  };

  const handleUpload = async () => {
    try {
      const uploadPromises = selectedFiles.map(file => 
        VideoService.uploadVideo(
          file, 
          albumId, 
          tags, 
          category, 
          description
        )
      );

      await Promise.all(uploadPromises);
      
      toast.success(`Successfully uploaded ${selectedFiles.length} video(s)`);
      
      // Reset form
      setSelectedFiles([]);
      setTags([]);
      setNewTag('');
      setCategory('Other');
      setDescription('');
      
      onClose();
      onUploadSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to upload videos';
      
      toast.error(errorMessage);
    }
  };

  const categories = VideoService.getCategories();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Videos</DialogTitle>
          <DialogDescription>
            Upload your videos with optional tags, category, and description.
          </DialogDescription>
        </DialogHeader>

        {/* File Selection */}
        <div>
          <Input 
            type="file" 
            multiple 
            accept="video/*" 
            onChange={handleFileChange} 
            className="mb-4"
          />
          
          {selectedFiles.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Selected Videos:</h4>
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between bg-muted p-2 rounded"
                  >
                    <span>{file.name}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Category Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Category</label>
          <Select 
            value={category} 
            onValueChange={setCategory}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Tags</label>
          <div className="flex space-x-2 mb-2">
            <Input 
              value={newTag} 
              onChange={(e) => setNewTag(e.target.value)} 
              placeholder="Add a tag" 
            />
            <Button 
              variant="outline" 
              onClick={addTag}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <div 
                  key={tag} 
                  className="bg-muted px-2 py-1 rounded flex items-center space-x-1"
                >
                  <span>{tag}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeTag(tag)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Description</label>
          <Input 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Optional description" 
          />
        </div>

        {/* Upload Button */}
        <Button 
          onClick={handleUpload} 
          disabled={selectedFiles.length === 0}
        >
          Upload Videos
        </Button>
      </DialogContent>
    </Dialog>
  );
}
