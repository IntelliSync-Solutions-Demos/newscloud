import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Album, Photo } from '@/services/photoService';
import { toast } from 'sonner';
import { Move, FolderPlus } from 'lucide-react';

interface MovePhotosModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: Photo[];
  albums: Album[];
  onMove: (photoIds: string[], targetAlbumId?: string) => void;
}

export function MovePhotosModal({ 
  isOpen, 
  onClose, 
  photos,
  albums,
  onMove 
}: MovePhotosModalProps) {
  const [selectedAlbum, setSelectedAlbum] = useState<string | undefined>(undefined);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<string[]>([]);

  const handlePhotoSelect = (photoId: string) => {
    setSelectedPhotoIds(prev => 
      prev.includes(photoId)
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    );
  };

  const handleMove = () => {
    if (selectedPhotoIds.length > 0) {
      onMove(selectedPhotoIds, selectedAlbum);
      onClose();
      toast.success(`Moved ${selectedPhotoIds.length} photo(s)`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Move Photos</DialogTitle>
          <DialogDescription>
            Select photos to move and choose a destination album
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Album Selection */}
          <div className="flex items-center space-x-4">
            <span className="font-medium">Move to Album:</span>
            <Select 
              value={selectedAlbum || ''} 
              onValueChange={(value) => setSelectedAlbum(value || undefined)}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select Destination Album" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">
                  <div className="flex items-center">
                    <FolderPlus className="mr-2 h-4 w-4" />
                    No Album (Unassigned)
                  </div>
                </SelectItem>
                {albums.map(album => (
                  <SelectItem key={album.id} value={album.id}>
                    {album.name} ({album.photoCount} photos)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-4 gap-4 max-h-[400px] overflow-y-auto">
            {photos.map(photo => (
              <div 
                key={photo.id}
                className={`relative cursor-pointer 
                  ${selectedPhotoIds.includes(photo.id) 
                    ? 'border-4 border-blue-500 opacity-75' 
                    : 'hover:opacity-75'}`}
                onClick={() => handlePhotoSelect(photo.id)}
              >
                <img 
                  src={photo.url} 
                  alt={photo.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                {selectedPhotoIds.includes(photo.id) && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                    ✓
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <p className="text-sm text-gray-500">
              {selectedPhotoIds.length} photo(s) selected
            </p>
            <div>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button 
                className="ml-2"
                disabled={selectedPhotoIds.length === 0}
                onClick={handleMove}
              >
                <Move className="mr-2 h-4 w-4" />
                Move Photos
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
