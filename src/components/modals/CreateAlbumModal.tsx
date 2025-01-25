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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Album } from 'lucide-react';

interface CreateAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (albumName: string) => void;
  onCreateSuccess?: () => void;
}

export function CreateAlbumModal({ 
  isOpen, 
  onClose, 
  onCreate, 
  onCreateSuccess 
}: CreateAlbumModalProps) {
  const [albumName, setAlbumName] = useState<string>('');

  const handleCreate = () => {
    if (albumName.trim()) {
      onCreate(albumName.trim());
      onClose();
      onCreateSuccess?.();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Album</DialogTitle>
          <DialogDescription>
            Create a new album to organize your photos.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="album-name">Album Name</Label>
            <Input 
              type="text" 
              id="album-name" 
              placeholder="Enter album name" 
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Album className="h-4 w-4" />
            <p>Your album will be created in your personal photo collection.</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            disabled={!albumName.trim()}
            onClick={handleCreate}
          >
            Create Album
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
