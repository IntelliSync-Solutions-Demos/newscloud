import { useState, useEffect } from "react";
import { VideoCard } from "@/components/VideoCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { VideoService, Video, VideoAlbum, PaginatedResult } from '@/services/videoService';
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
import { 
  ImageIcon, 
  FolderPlus, 
  MoreVertical, 
  Trash2, 
  Edit, 
 
} from 'lucide-react';
import { UploadVideoModal } from '@/components/modals/UploadVideoModal';
import { CreateAlbumModal } from '@/components/modals/CreateAlbumModal';
import { RenameAlbumModal } from '@/components/modals/RenameAlbumModal';
import { useAuth } from "@/contexts/AuthContext";  
import { Button } from "@/components/ui/button";



const Videos = () => {
  const { user } = useAuth();
  const [videosResult, setVideosResult] = useState<PaginatedResult<Video>>({
    items: [],
    total: 0,
    page: 1,
    pageSize: 12,
    totalPages: 0
  });
  const [albumsResult, setAlbumsResult] = useState<PaginatedResult<VideoAlbum>>({
    items: [],
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0
  });
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [selectedAlbumForRename, setSelectedAlbumForRename] = useState<VideoAlbum | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadVideoModalOpen, setIsUploadVideoModalOpen] = useState(false);
  const [isCreateAlbumModalOpen, setIsCreateAlbumModalOpen] = useState(false);
  const [isRenameAlbumModalOpen, setIsRenameAlbumModalOpen] = useState(false);

  // Advanced filtering states
  const [videoFilter, setVideoFilter] = useState({
    searchTerm: '',
    albumId: '',
    category: 'All',  // Default to 'All' category
    tags: [] as string[],
    sortBy: 'date' as 'date' | 'name' | 'size',
    sortOrder: 'desc' as 'asc' | 'desc'
  });

  const [albumFilter, setAlbumFilter] = useState({
    searchTerm: '',
    minVideoCount: undefined as number | undefined,
    maxVideoCount: undefined as number | undefined,
    sortBy: 'date' as 'date' | 'name' | 'videoCount',
    sortOrder: 'desc' as 'asc' | 'desc'
  });

  // Fetch user's albums and videos on component mount and when page changes
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;  // Early return if no user

      try {
        // Fetch albums
        const fetchedAlbums = await VideoService.getUserAlbums(user.id, albumsResult.page);
        setAlbumsResult(fetchedAlbums);

        // Fetch videos (either from a specific album or all videos)
        const fetchedVideos = await VideoService.getVideos({
          albumId: selectedAlbum || undefined,
          category: videoFilter.category || undefined,
          tags: videoFilter.tags.length > 0 ? videoFilter.tags : undefined,
          page: videosResult.page
        });
        setVideosResult(fetchedVideos);
      } catch (error) {
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Failed to load videos and albums';
        
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [
    selectedAlbum, 
    albumsResult.page, 
    videosResult.page, 
    videoFilter.category, 
    videoFilter.tags,
    user?.id  // Use optional chaining to prevent errors if user is null
  ]);

  const handleCreateAlbum = async (albumName: string) => {
    if (!user) return;  // Early return if no user

    try {
      const newAlbum = await VideoService.createAlbum(albumName, user.id);
      
      // Update albums list
      const updatedAlbums = await VideoService.getUserAlbums(user.id, albumsResult.page);
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
    if (!user) return;  // Early return if no user

    try {
      VideoService.deleteAlbum(albumId);
      
      // Refresh albums list
      const updatedAlbums = VideoService.getUserAlbums(user.id, albumsResult.page);
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

  const handleDeleteVideo = (videoId: string) => {
    if (!user) return;  // Early return if no user

    try {
      VideoService.deleteVideo(videoId);
      
      // Refresh videos list
      const fetchedVideos = VideoService.getVideos({
        albumId: selectedAlbum || undefined,
        category: videoFilter.category || undefined,
        tags: videoFilter.tags.length > 0 ? videoFilter.tags : undefined,
        page: videosResult.page
      });
      setVideosResult(fetchedVideos);
      
      toast.success('Video deleted successfully');
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to delete video';
      
      toast.error(errorMessage);
    }
  };

  const handleRenameAlbum = (newName: string) => {
    if (!user) return;  // Early return if no user

    if (!selectedAlbum) {
      toast.error('No album selected to rename');
      return;
    }

    try {
      // Find the album index to get its ID
      const albumToRename = albumsResult.items.find(album => album.name === selectedAlbum);
      
      if (!albumToRename) {
        toast.error('Album not found');
        return;
      }

      // Rename the album using VideoService
      const renamedAlbum = VideoService.renameAlbum(albumToRename.id, newName);

      // Update the albums state to reflect the change
      setAlbumsResult(prevAlbums => ({
        ...prevAlbums,
        items: prevAlbums.items.map(album => 
          album.id === renamedAlbum.id 
            ? { ...album, name: newName } 
            : album
        ),
        total: prevAlbums.total,
        page: prevAlbums.page,
        pageSize: prevAlbums.pageSize,
        totalPages: prevAlbums.totalPages
      }));

      // Update selectedAlbum if it matches the old name
      if (selectedAlbum === albumToRename.name) {
        setSelectedAlbum(newName);
      }

      // Close the modal and show success toast
      setIsRenameAlbumModalOpen(false);
      toast.success(`Album renamed to "${newName}"`);
    } catch (error) {
      console.error('Failed to rename album:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to rename album');
    }
  };

  const handleAddTag = (videoId: string, tag: string) => {
    if (!user) return;  // Early return if no user

    try {
      const video = videosResult.items.find(v => v.id === videoId);
      if (video && !video.tags.includes(tag)) {
        const updatedVideo = VideoService.updateVideoTags(videoId, [...video.tags, tag]);
        
        // Refresh videos list
        const fetchedVideos = VideoService.getVideos({
          albumId: selectedAlbum || undefined,
          category: videoFilter.category || undefined,
          tags: videoFilter.tags.length > 0 ? videoFilter.tags : undefined,
          page: videosResult.page
        });
        setVideosResult(fetchedVideos);
        
        toast.success('Tag added successfully');
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to add tag';
      
      toast.error(errorMessage);
    }
  };

  const handleRemoveTag = (videoId: string, tag: string) => {
    if (!user) return;  // Early return if no user

    try {
      const video = videosResult.items.find(v => v.id === videoId);
      if (video) {
        const updatedVideo = VideoService.updateVideoTags(
          videoId, 
          video.tags.filter(t => t !== tag)
        );
        
        // Refresh videos list
        const fetchedVideos = VideoService.getVideos({
          albumId: selectedAlbum || undefined,
          category: videoFilter.category || undefined,
          tags: videoFilter.tags.length > 0 ? videoFilter.tags : undefined,
          page: videosResult.page
        });
        setVideosResult(fetchedVideos);
        
        toast.success('Tag removed successfully');
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to remove tag';
      
      toast.error(errorMessage);
    }
  };

  const handleUpdateCategory = (videoId: string, category: string) => {
    if (!user) return;  // Early return if no user

    try {
      VideoService.updateVideoCategory(videoId, category);
      
      // Refresh videos list
      const fetchedVideos = VideoService.getVideos({
        albumId: selectedAlbum || undefined,
        category: videoFilter.category || undefined,
        tags: videoFilter.tags.length > 0 ? videoFilter.tags : undefined,
        page: videosResult.page
      });
      setVideosResult(fetchedVideos);
      
      toast.success('Category updated successfully');
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to update category';
      
      toast.error(errorMessage);
    }
  };

  const handleUploadSuccess = () => {
    setIsUploadVideoModalOpen(false);
  };

  const handleCreateAlbumSuccess = () => {
    setIsCreateAlbumModalOpen(false);
  };

  const handleRenameAlbumSuccess = () => {
    setIsRenameAlbumModalOpen(false);
  };

  const onCreate = (albumName: string) => {
    if (!user) {
      // Optional: Add error handling or redirect to login
      console.error('No user authenticated');
      return null;
    }
    const newAlbum = VideoService.createAlbum(albumName, user.id);
    return newAlbum;
  };

  const renderModals = () => {
    return (
      <>
        {isUploadVideoModalOpen && (
          <UploadVideoModal 
            isOpen={isUploadVideoModalOpen}
            onClose={() => setIsUploadVideoModalOpen(false)}
            onUploadSuccess={handleUploadSuccess}
            albumId={selectedAlbum}
          />
        )}
        {isCreateAlbumModalOpen && (
          <CreateAlbumModal 
            isOpen={isCreateAlbumModalOpen}
            onClose={() => setIsCreateAlbumModalOpen(false)}
            onCreate={onCreate}
            onCreateSuccess={handleCreateAlbumSuccess}
          />
        )}
        {isRenameAlbumModalOpen && selectedAlbum && (
          <RenameAlbumModal 
            isOpen={isRenameAlbumModalOpen}
            onClose={() => setIsRenameAlbumModalOpen(false)}
            currentName={selectedAlbum}
            onRename={handleRenameAlbum}
            onRenameSuccess={handleRenameAlbumSuccess}
          />
        )}
      </>
    );
  };

  const renderFilterSection = () => (
    <div className="mb-4 space-y-2">
      <div className="flex space-x-2">
        {/* Album Filter */}
        <Select 
          value={selectedAlbum || ''} 
          onValueChange={(value) => setSelectedAlbum(value || null)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Album" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Albums</SelectItem>
            {albumsResult.items.map(album => (
              <SelectItem key={album.id} value={album.id}>
                {album.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select 
          value={videoFilter.category}
          onValueChange={(value) => 
            setVideoFilter(prev => ({
              ...prev,
              category: value
            }))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            {VideoService.getCategories().map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Tag Filter */}
        <div className="flex space-x-2">
          <Input 
            placeholder="Add Tag Filter" 
            value={videoFilter.tags.join(', ')} 
            onChange={(e) => {
              const tags = e.target.value
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag !== '');
              setVideoFilter(prev => ({ ...prev, tags }));
            }}
          />
        </div>
      </div>
    </div>
  );

  const renderAlbumSection = () => (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Video Albums</h3>
        <Button 
          variant="outline" 
          onClick={() => setIsCreateAlbumModalOpen(true)}
        >
          <FolderPlus className="mr-2 h-4 w-4" /> Create Album
        </Button>
      </div>
      
      {albumsResult.items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {albumsResult.items.map(album => (
            <div key={album.id} className="hover:shadow-lg transition-shadow">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="text-sm font-medium">{album.name}</div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem 
                      onClick={() => setIsRenameAlbumModalOpen(true)}
                    >
                      <Edit className="mr-2 h-4 w-4" /> Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDeleteAlbum(album.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div>
                <div className="text-2xl font-bold">{album.videoCount}</div>
                <p className="text-xs text-muted-foreground">Videos</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No albums yet. Create one to organize your videos!</p>
      )}
    </div>
  );

  const renderVideoSection = () => (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {selectedAlbum 
            ? `Videos in ${albumsResult.items.find(a => a.id === selectedAlbum)?.name}` 
            : 'All Videos'}
        </h3>
        <Button 
          variant="default" 
          onClick={() => setIsUploadVideoModalOpen(true)}
        >
          <ImageIcon className="mr-2 h-4 w-4" /> Upload Video
        </Button>
      </div>

      {videosResult.items.length > 0 ? (
        <ScrollArea className="h-[400px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {videosResult.items.map(video => (
              <VideoCard 
                key={video.id} 
                video={video}
                onDelete={() => handleDeleteVideo(video.id)}
                onAddTag={(tag) => handleAddTag(video.id, tag)}
                onRemoveTag={(tag) => handleRemoveTag(video.id, tag)}
                onUpdateCategory={(category) => handleUpdateCategory(video.id, category)}
              />
            ))}
          </div>
        </ScrollArea>
      ) : (
        <p className="text-muted-foreground">No videos found. Upload some to get started!</p>
      )}

      {/* Pagination */}
      {videosResult.totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={() => {
                    if (videosResult.page > 1) {
                      setVideosResult(prev => ({ 
                        ...prev, 
                        page: prev.page - 1 
                      }));
                    }
                  }} 
                />
              </PaginationItem>
              {[...Array(videosResult.totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink 
                    href="#" 
                    isActive={videosResult.page === i + 1}
                    onClick={() => {
                      setVideosResult(prev => ({ 
                        ...prev, 
                        page: i + 1 
                      }));
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={() => {
                    if (videosResult.page < videosResult.totalPages) {
                      setVideosResult(prev => ({ 
                        ...prev, 
                        page: prev.page + 1 
                      }));
                    }
                  }} 
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Please log in to view your videos</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {renderModals()}
      
      {renderFilterSection()}
      
      {renderAlbumSection()}
      
      {renderVideoSection()}
    </div>
  );
};

export default Videos;