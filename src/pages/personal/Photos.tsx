import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadPhotoModal } from '@/components/modals/UploadPhotoModal';
import { CreateAlbumModal } from '@/components/modals/CreateAlbumModal';
import { RenameAlbumModal } from '@/components/modals/RenameAlbumModal';
import { MovePhotosModal } from '@/components/modals/MovePhotosModal';
import { PhotoService, Photo, Album, PaginatedResult } from '@/services/photoService';
import { toast } from 'sonner';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ImageIcon, FolderPlus, MoreVertical, Trash2, Edit } from 'lucide-react';

export default function PersonalPhotos() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCreateAlbumModalOpen, setIsCreateAlbumModalOpen] = useState(false);
  const [isRenameAlbumModalOpen, setIsRenameAlbumModalOpen] = useState(false);
  const [isMovePhotosModalOpen, setIsMovePhotosModalOpen] = useState(false);
  const [photosResult, setPhotosResult] = useState<PaginatedResult<Photo>>({
    items: [],
    total: 0,
    page: 1,
    pageSize: 12,
    totalPages: 0
  });
  const [albumsResult, setAlbumsResult] = useState<PaginatedResult<Album>>({
    items: [],
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0
  });
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [selectedAlbumForRename, setSelectedAlbumForRename] = useState<Album | null>(null);
  const [selectedPhotosForMove, setSelectedPhotosForMove] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingAlbumId, setEditingAlbumId] = useState<string | null>(null);

  // Advanced filtering states
  const [photoFilter, setPhotoFilter] = useState({
    searchTerm: '',
    albumId: '',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    sortBy: 'date' as 'date' | 'name' | 'size',
    sortOrder: 'desc' as 'asc' | 'desc'
  });

  const [albumFilter, setAlbumFilter] = useState({
    searchTerm: '',
    minPhotoCount: undefined as number | undefined,
    maxPhotoCount: undefined as number | undefined,
    sortBy: 'date' as 'date' | 'name' | 'photoCount',
    sortOrder: 'desc' as 'asc' | 'desc'
  });

  // Fetch user's albums and photos on component mount and when page changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Replace with actual user ID from authentication
        const userId = 'current-user-id';
        
        // Fetch albums
        const fetchedAlbums = await PhotoService.getUserAlbums(userId, albumsResult.page);
        setAlbumsResult(fetchedAlbums);

        // Fetch photos (either from a specific album or all photos)
        const fetchedPhotos = await PhotoService.getPhotos(selectedAlbum || undefined, photosResult.page);
        setPhotosResult(fetchedPhotos);
      } catch (error) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Failed to load photos and albums';
        
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedAlbum, albumsResult.page, photosResult.page]);

  const handleUploadPhotos = async (uploadedFiles: File[]) => {
    try {
      // TODO: Replace with actual user ID from authentication
      const userId = 'current-user-id';
      
      const uploadPromises = uploadedFiles.map(file => 
        PhotoService.uploadPhoto(file, selectedAlbum || undefined)
      );

      await Promise.all(uploadPromises);
      
      // Refresh photos after upload
      const fetchedPhotos = await PhotoService.getPhotos(selectedAlbum || undefined, photosResult.page);
      setPhotosResult(fetchedPhotos);
      
      toast.success(`Successfully uploaded ${uploadedFiles.length} photo(s)`);
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to upload photos';
      
      toast.error(errorMessage);
    }
  };

  const handleCreateAlbum = async (albumName: string) => {
    try {
      // TODO: Replace with actual user ID from authentication
      const userId = 'current-user-id';
      
      const newAlbum = await PhotoService.createAlbum(albumName, userId);
      
      // Update albums list
      const updatedAlbums = await PhotoService.getUserAlbums(userId, albumsResult.page);
      setAlbumsResult(updatedAlbums);
      
      toast.success(`Album "${albumName}" created successfully`);
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to create album';
      
      toast.error(errorMessage);
    }
  };

  const handleDeleteAlbum = (albumId: string) => {
    try {
      PhotoService.deleteAlbum(albumId);
      
      // Refresh albums list
      const userId = 'current-user-id';
      const updatedAlbums = PhotoService.getUserAlbums(userId, albumsResult.page);
      setAlbumsResult(updatedAlbums);
      
      // Reset selected album if deleted
      if (selectedAlbum === albumId) {
        setSelectedAlbum(null);
      }
      
      toast.success('Album deleted successfully');
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to delete album';
      
      toast.error(errorMessage);
    }
  };

  const handleDeletePhoto = (photoId: string) => {
    try {
      PhotoService.deletePhoto(photoId);
      
      // Refresh photos list
      const fetchedPhotos = PhotoService.getPhotos(selectedAlbum || undefined, photosResult.page);
      setPhotosResult(fetchedPhotos);
      
      toast.success('Photo deleted successfully');
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to delete photo';
      
      toast.error(errorMessage);
    }
  };

  const handleRenameAlbum = (newName: string) => {
    if (selectedAlbumForRename) {
      PhotoService.renameAlbum(selectedAlbumForRename.id, newName);
      toast.success(`Album renamed to ${newName}`);
      setSelectedAlbumForRename(null);
    }
  };

  const handleMovePhotos = (photoIds: string[], targetAlbumId?: string) => {
    PhotoService.bulkMovePhotos(photoIds, targetAlbumId);
    toast.success(`Moved ${photoIds.length} photo(s)`);
    setSelectedPhotosForMove([]);
  };

  const handlePageChange = (type: 'photos' | 'albums', newPage: number) => {
    try {
      if (type === 'photos') {
        setPhotosResult(prevState => ({ ...prevState, page: newPage }));
      } else {
        setAlbumsResult(prevState => ({ ...prevState, page: newPage }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to change page';
      
      toast.error(errorMessage);
    }
  };

  const applyPhotoFilter = () => {
    const filteredPhotos = PhotoService.filterPhotos(
      {
        searchTerm: photoFilter.searchTerm,
        albumId: photoFilter.albumId,
        startDate: photoFilter.startDate,
        endDate: photoFilter.endDate,
        sortBy: photoFilter.sortBy,
        sortOrder: photoFilter.sortOrder
      },
      photosResult.page
    );
    setPhotosResult(filteredPhotos);
  };

  const applyAlbumFilter = () => {
    const filteredAlbums = PhotoService.filterAlbums(
      {
        searchTerm: albumFilter.searchTerm,
        minPhotoCount: albumFilter.minPhotoCount,
        maxPhotoCount: albumFilter.maxPhotoCount,
        sortBy: albumFilter.sortBy,
        sortOrder: albumFilter.sortOrder
      },
      albumsResult.page
    );
    setAlbumsResult(filteredAlbums);
  };

  const renderPhotoFilterControls = () => (
    <div className="flex space-x-2 mb-4">
      <input 
        type="text" 
        placeholder="Search photos" 
        value={photoFilter.searchTerm}
        onChange={(e) => setPhotoFilter(prev => ({...prev, searchTerm: e.target.value}))}
      />
      <Select
        value={photoFilter.sortBy}
        onValueChange={(value) => setPhotoFilter(prev => ({...prev, sortBy: value as 'date' | 'name' | 'size'}))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date">Date</SelectItem>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="size">Size</SelectItem>
        </SelectContent>
      </Select>
      {/* Add more filter controls as needed */}
    </div>
  );

  const renderAlbumFilterControls = () => (
    <div className="flex space-x-2 mb-4">
      <input 
        type="text" 
        placeholder="Search albums" 
        value={albumFilter.searchTerm}
        onChange={(e) => setAlbumFilter(prev => ({...prev, searchTerm: e.target.value}))}
      />
      <Select
        value={albumFilter.sortBy}
        onValueChange={(value) => setAlbumFilter(prev => ({...prev, sortBy: value as 'date' | 'name' | 'photoCount'}))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="date">Date</SelectItem>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="photoCount">Photo Count</SelectItem>
        </SelectContent>
      </Select>
      {/* Add more filter controls as needed */}
    </div>
  );

  const renderModals = () => (
    <>
      {/* Rename Album Modal */}
      {selectedAlbumForRename && (
        <RenameAlbumModal
          isOpen={isRenameAlbumModalOpen}
          onClose={() => {
            setIsRenameAlbumModalOpen(false);
            setSelectedAlbumForRename(null);
          }}
          onRename={handleRenameAlbum}
          currentName={selectedAlbumForRename.name}
        />
      )}

      {/* Move Photos Modal */}
      <MovePhotosModal
        isOpen={isMovePhotosModalOpen}
        onClose={() => {
          setIsMovePhotosModalOpen(false);
          setSelectedPhotosForMove([]);
        }}
        photos={selectedPhotosForMove}
        albums={albumsResult.items}
        onMove={handleMovePhotos}
      />
    </>
  );

  return (
    <div className="container mx-auto p-4">
      {renderPhotoFilterControls()}
      {renderAlbumFilterControls()}
      {renderModals()}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ImageIcon className="h-6 w-6" />
              <span>Personal Photos</span>
            </div>
            <div className="flex items-center space-x-4">
              <Select 
                value={selectedAlbum || "all"}
                onValueChange={(value) => setSelectedAlbum(value === "all" ? null : value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Album" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Photos</SelectItem>
                  {albumsResult.items.map(album => (
                    <SelectItem key={album.id} value={album.id}>
                      {album.name} ({album.photoCount})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={() => setIsUploadModalOpen(true)}>
                Upload Photos
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsCreateAlbumModalOpen(true)}
              >
                <FolderPlus className="mr-2 h-4 w-4" />
                Create Album
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Albums Section */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Albums</h3>
              {albumsResult.items.length > 0 ? (
                <div className="grid grid-cols-4 gap-4">
                  {albumsResult.items.map(album => (
                    <div 
                      key={album.id} 
                      className="bg-gray-100 p-4 rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <h4 className="font-medium">{album.name}</h4>
                        <p className="text-sm text-gray-500">
                          {album.photoCount} photos
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem 
                            onSelect={() => {
                              setSelectedAlbumForRename(album);
                              setIsRenameAlbumModalOpen(true);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onSelect={() => handleDeleteAlbum(album.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No albums found</p>
              )}
              
              {/* Albums Pagination */}
              {albumsResult.totalPages > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (albumsResult.page > 1) {
                            handlePageChange('albums', albumsResult.page - 1);
                          }
                        }}
                        isActive={albumsResult.page > 1}
                      />
                    </PaginationItem>
                    {[...Array(albumsResult.totalPages)].map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange('albums', index + 1);
                          }}
                          isActive={albumsResult.page === index + 1}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (albumsResult.page < albumsResult.totalPages) {
                            handlePageChange('albums', albumsResult.page + 1);
                          }
                        }}
                        isActive={albumsResult.page < albumsResult.totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>

            {/* Photos Section */}
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {selectedAlbum ? 'Album Photos' : 'All Photos'}
              </h3>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <p>Loading photos...</p>
                </div>
              ) : photosResult.items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <ImageIcon className="h-12 w-12 mb-4" />
                  <p>No photos found. Start uploading!</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4">
                  {photosResult.items.map((photo) => (
                    <div 
                      key={photo.id} 
                      className="relative group overflow-hidden rounded-lg"
                    >
                      <img 
                        src={photo.url} 
                        alt={photo.name}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-center">
                        <div>
                          <p className="text-xs truncate">{photo.name}</p>
                          <p className="text-xs">
                            {new Date(photo.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-white hover:bg-red-500/30"
                          onClick={() => handleDeletePhoto(photo.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Photos Pagination */}
              {photosResult.totalPages > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (photosResult.page > 1) {
                            handlePageChange('photos', photosResult.page - 1);
                          }
                        }}
                        isActive={photosResult.page > 1}
                      />
                    </PaginationItem>
                    {[...Array(photosResult.totalPages)].map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink 
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange('photos', index + 1);
                          }}
                          isActive={photosResult.page === index + 1}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (photosResult.page < photosResult.totalPages) {
                            handlePageChange('photos', photosResult.page + 1);
                          }
                        }}
                        isActive={photosResult.page < photosResult.totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <UploadPhotoModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadPhotos}
        albumId={selectedAlbum || undefined}
      />

      <CreateAlbumModal 
        isOpen={isCreateAlbumModalOpen}
        onClose={() => setIsCreateAlbumModalOpen(false)}
        onCreate={handleCreateAlbum}
      />
    </div>
  );
}
