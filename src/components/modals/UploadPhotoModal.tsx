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
import { Upload, X, AlertTriangle } from 'lucide-react';
import { PhotoService } from '@/services/photoService';
import { toast } from 'sonner';

interface UploadPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
  albumId?: string;
}

export function UploadPhotoModal({ 
  isOpen, 
  onClose, 
  onUpload,
  albumId
}: UploadPhotoModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileErrors, setFileErrors] = useState<{[key: string]: string}>({});
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const newFileErrors: {[key: string]: string} = {};

      const validFiles = files.filter(file => {
        const validation = PhotoService.validateFile(file);
        if (!validation.isValid && validation.error) {
          newFileErrors[file.name] = validation.error;
        }
        return validation.isValid;
      });

      setSelectedFiles(validFiles);
      setFileErrors(newFileErrors);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = selectedFiles.map(file => 
        PhotoService.uploadPhoto(file, albumId)
      );

      const uploadedPhotos = await Promise.all(uploadPromises);
      
      onUpload(selectedFiles);
      toast.success(`Successfully uploaded ${uploadedPhotos.length} photo(s)`);
      
      // Reset state
      setSelectedFiles([]);
      setFileErrors({});
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred during upload';
      
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (fileToRemove: File) => {
    setSelectedFiles(selectedFiles.filter(file => file !== fileToRemove));
    const { [fileToRemove.name]: removedError, ...remainingErrors } = fileErrors;
    setFileErrors(remainingErrors);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Photos</DialogTitle>
          <DialogDescription>
            Select and upload your photos to your personal collection.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <Label 
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, or WEBP (Max 10MB)</p>
              </div>
              <Input 
                id="dropzone-file" 
                type="file" 
                multiple 
                accept="image/png, image/jpeg, image/webp"
                className="hidden" 
                onChange={handleFileChange}
              />
            </Label>
          </div>

          {Object.keys(fileErrors).length > 0 && (
            <div className="bg-red-50 p-3 rounded-md space-y-2">
              <div className="flex items-center text-red-600">
                <AlertTriangle className="mr-2 h-5 w-5" />
                <span className="font-semibold">Upload Errors</span>
              </div>
              {Object.entries(fileErrors).map(([fileName, error]) => (
                <p key={fileName} className="text-sm text-red-600">
                  {fileName}: {error}
                </p>
              ))}
            </div>
          )}

          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Selected Files:</h4>
              {selectedFiles.map((file, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-2 bg-gray-100 rounded-md"
                >
                  <span className="text-sm truncate">{file.name}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeFile(file)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            disabled={selectedFiles.length === 0 || isUploading}
            onClick={handleUpload}
          >
            {isUploading ? 'Uploading...' : 'Upload Photos'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
