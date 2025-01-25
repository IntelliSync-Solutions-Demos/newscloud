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
import { Edit } from 'lucide-react';

interface RenameAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: (newName: string) => void;
  currentName: string;
  onRenameSuccess?: () => void;
}

export function RenameAlbumModal({ 
  isOpen, 
  onClose, 
  onRename,
  currentName,
  onRenameSuccess
}: RenameAlbumModalProps) {
  const [newName, setNewName] = useState(currentName);

  const handleRename = () => {
    if (newName.trim() && newName.trim() !== currentName) {
      onRename(newName.trim());
      onClose();
      onRenameSuccess?.();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Album</DialogTitle>
          <DialogDescription>
            Change the name of your album
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="album-name">Album Name</Label>
            <Input 
              type="text" 
              id="album-name" 
              placeholder="Enter new album name" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Edit className="h-4 w-4" />
            <p>The album will be renamed in your photo collection.</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            disabled={!newName.trim() || newName.trim() === currentName}
            onClick={handleRename}
          >
            Rename Album
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
