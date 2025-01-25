// Video management service
import { v4 as uuidv4 } from 'uuid';

// Define interfaces for type safety
export interface Video {
  id: string;
  url: string;
  name: string;
  size: number;
  uploadedAt: string;
  albumId?: string;
  tags: string[];
  category: string;
  description?: string;
}

export interface VideoAlbum {
  id: string;
  name: string;
  createdAt: string;
  userId: string;
  videoCount: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class VideoService {
  // Mock storage
  private static videos: Video[] = [];
  private static albums: VideoAlbum[] = [];

  // Maximum file size (100MB)
  private static MAX_FILE_SIZE = 100 * 1024 * 1024;

  // Allowed file types
  private static ALLOWED_TYPES = [
    'video/mp4', 
    'video/webm', 
    'video/quicktime', 
    'video/x-msvideo'
  ];

  // Available video categories
  private static CATEGORIES = [
    'Personal', 
    'Work', 
    'Education', 
    'Entertainment', 
    'Sports', 
    'Music', 
    'Other'
  ];

  // Validate file before upload
  static validateFile(file: File): { isValid: boolean; error?: string } {
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return { 
        isValid: false, 
        error: 'Invalid file type. Allowed types: MP4, WebM, QuickTime, AVI.' 
      };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return { 
        isValid: false, 
        error: 'File is too large. Maximum size is 100MB.' 
      };
    }

    return { isValid: true };
  }

  // Upload a single video
  static uploadVideo(
    file: File, 
    albumId?: string, 
    tags: string[] = [], 
    category: string = 'Other', 
    description?: string
  ): Video {
    const validation = this.validateFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error || 'File validation failed');
    }

    // Validate category
    if (!this.CATEGORIES.includes(category)) {
      throw new Error(`Invalid category. Must be one of: ${this.CATEGORIES.join(', ')}`);
    }

    // Generate a mock URL for the uploaded file
    const mockUrl = `https://picsum.photos/seed/${uuidv4()}/800/600`;

    const newVideo: Video = {
      id: uuidv4(),
      url: mockUrl,
      name: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      albumId: albumId,
      tags: tags,
      category: category,
      description: description
    };

    this.videos.push(newVideo);

    // Update album video count if applicable
    if (albumId) {
      const albumIndex = this.albums.findIndex(a => a.id === albumId);
      if (albumIndex !== -1) {
        this.albums[albumIndex].videoCount += 1;
      }
    }

    return newVideo;
  }

  // Create a new video album
  static createAlbum(name: string, userId: string): VideoAlbum {
    if (!name.trim()) {
      throw new Error('Album name cannot be empty');
    }

    const newAlbum: VideoAlbum = {
      id: uuidv4(),
      name,
      userId,
      createdAt: new Date().toISOString(),
      videoCount: 0
    };

    this.albums.push(newAlbum);
    return newAlbum;
  }

  // Delete a video album
  static deleteAlbum(albumId: string): void {
    const albumIndex = this.albums.findIndex(a => a.id === albumId);
    if (albumIndex === -1) {
      throw new Error('Album not found');
    }

    // Remove videos associated with the album
    this.videos = this.videos.filter(v => v.albumId !== albumId);

    // Remove the album
    this.albums.splice(albumIndex, 1);
  }

  // Delete a video
  static deleteVideo(videoId: string): void {
    const videoIndex = this.videos.findIndex(v => v.id === videoId);
    if (videoIndex === -1) {
      throw new Error('Video not found');
    }

    // If the video is in an album, decrease the album's video count
    const video = this.videos[videoIndex];
    if (video.albumId) {
      const albumIndex = this.albums.findIndex(a => a.id === video.albumId);
      if (albumIndex !== -1) {
        this.albums[albumIndex].videoCount -= 1;
      }
    }

    // Remove the video
    this.videos.splice(videoIndex, 1);
  }

  // Fetch user's video albums with pagination
  static getUserAlbums(
    userId: string, 
    page: number = 1, 
    pageSize: number = 10
  ): PaginatedResult<VideoAlbum> {
    const userAlbums = this.albums.filter(album => album.userId === userId);
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    const paginatedAlbums = userAlbums.slice(startIndex, endIndex);
    
    return {
      items: paginatedAlbums,
      total: userAlbums.length,
      page,
      pageSize,
      totalPages: Math.ceil(userAlbums.length / pageSize)
    };
  }

  // Fetch videos with pagination (optionally filtered by album, category, or tags)
  static getVideos(
    options: {
      albumId?: string;
      category?: string;
      tags?: string[];
      page?: number;
      pageSize?: number;
    } = {}
  ): PaginatedResult<Video> {
    const { 
      albumId, 
      category, 
      tags, 
      page = 1, 
      pageSize = 12 
    } = options;

    // Filter videos by album, category, and tags
    const filteredVideos = this.videos.filter(video => 
      (!albumId || video.albumId === albumId) &&
      (!category || video.category === category) &&
      (!tags || tags.every(tag => video.tags.includes(tag)))
    );
    
    // Sort videos by upload date (most recent first)
    const sortedVideos = filteredVideos.sort((a, b) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    const paginatedVideos = sortedVideos.slice(startIndex, endIndex);
    
    return {
      items: paginatedVideos,
      total: filteredVideos.length,
      page,
      pageSize,
      totalPages: Math.ceil(filteredVideos.length / pageSize)
    };
  }

  // Rename a video album
  static renameAlbum(albumId: string, newName: string): VideoAlbum {
    const albumIndex = this.albums.findIndex(a => a.id === albumId);
    if (albumIndex === -1) {
      throw new Error('Album not found');
    }

    this.albums[albumIndex].name = newName;
    return this.albums[albumIndex];
  }

  // Add or remove tags from a video
  static updateVideoTags(videoId: string, tags: string[]): Video {
    const videoIndex = this.videos.findIndex(v => v.id === videoId);
    if (videoIndex === -1) {
      throw new Error('Video not found');
    }

    this.videos[videoIndex].tags = tags;
    return this.videos[videoIndex];
  }

  // Change video category
  static updateVideoCategory(videoId: string, category: string): Video {
    if (!this.CATEGORIES.includes(category)) {
      throw new Error(`Invalid category. Must be one of: ${this.CATEGORIES.join(', ')}`);
    }

    const videoIndex = this.videos.findIndex(v => v.id === videoId);
    if (videoIndex === -1) {
      throw new Error('Video not found');
    }

    this.videos[videoIndex].category = category;
    return this.videos[videoIndex];
  }

  // Get available categories
  static getCategories(): string[] {
    return [...this.CATEGORIES];
  }
}
