// Mock implementation for photo and album management
import { v4 as uuidv4 } from 'uuid';

// Define interfaces for type safety
export interface Photo {
  id: string;
  url: string;
  name: string;
  size: number;
  uploadedAt: string;
  albumId?: string;
}

export interface Album {
  id: string;
  name: string;
  createdAt: string;
  userId: string;
  photoCount: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class PhotoService {
  // Mock storage
  private static photos: Photo[] = [];
  private static albums: Album[] = [];

  // Maximum file size (10MB)
  private static MAX_FILE_SIZE = 10 * 1024 * 1024;

  // Allowed file types
  private static ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

  // Validate file before upload
  static validateFile(file: File): { isValid: boolean; error?: string } {
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return { 
        isValid: false, 
        error: 'Invalid file type. Only JPEG, PNG, and WEBP are allowed.' 
      };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return { 
        isValid: false, 
        error: 'File is too large. Maximum size is 10MB.' 
      };
    }

    return { isValid: true };
  }

  // Upload a single photo
  static uploadPhoto(file: File, albumId?: string): Photo {
    const validation = this.validateFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error || 'File validation failed');
    }

    // Generate a mock URL for the uploaded file
    const mockUrl = `https://picsum.photos/seed/${uuidv4()}/800/600`;

    const newPhoto: Photo = {
      id: uuidv4(),
      url: mockUrl,
      name: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      albumId: albumId
    };

    this.photos.push(newPhoto);

    // Update album photo count if applicable
    if (albumId) {
      const albumIndex = this.albums.findIndex(a => a.id === albumId);
      if (albumIndex !== -1) {
        this.albums[albumIndex].photoCount += 1;
      }
    }

    return newPhoto;
  }

  // Create a new album
  static createAlbum(name: string, userId: string): Album {
    if (!name.trim()) {
      throw new Error('Album name cannot be empty');
    }

    const newAlbum: Album = {
      id: uuidv4(),
      name,
      userId,
      createdAt: new Date().toISOString(),
      photoCount: 0
    };

    this.albums.push(newAlbum);
    return newAlbum;
  }

  // Delete an album
  static deleteAlbum(albumId: string): void {
    const albumIndex = this.albums.findIndex(a => a.id === albumId);
    if (albumIndex === -1) {
      throw new Error('Album not found');
    }

    // Remove photos associated with the album
    this.photos = this.photos.filter(p => p.albumId !== albumId);

    // Remove the album
    this.albums.splice(albumIndex, 1);
  }

  // Delete a photo
  static deletePhoto(photoId: string): void {
    const photoIndex = this.photos.findIndex(p => p.id === photoId);
    if (photoIndex === -1) {
      throw new Error('Photo not found');
    }

    // If the photo is in an album, decrease the album's photo count
    const photo = this.photos[photoIndex];
    if (photo.albumId) {
      const albumIndex = this.albums.findIndex(a => a.id === photo.albumId);
      if (albumIndex !== -1) {
        this.albums[albumIndex].photoCount -= 1;
      }
    }

    // Remove the photo
    this.photos.splice(photoIndex, 1);
  }

  // Fetch user's albums with pagination
  static getUserAlbums(
    userId: string, 
    page: number = 1, 
    pageSize: number = 10
  ): PaginatedResult<Album> {
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

  // Fetch photos with pagination (optionally filtered by album)
  static getPhotos(
    albumId?: string, 
    page: number = 1, 
    pageSize: number = 12
  ): PaginatedResult<Photo> {
    // Filter photos by album if specified
    const filteredPhotos = albumId 
      ? this.photos.filter(photo => photo.albumId === albumId)
      : this.photos;
    
    // Sort photos by upload date (most recent first)
    const sortedPhotos = filteredPhotos.sort((a, b) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    const paginatedPhotos = sortedPhotos.slice(startIndex, endIndex);
    
    return {
      items: paginatedPhotos,
      total: filteredPhotos.length,
      page,
      pageSize,
      totalPages: Math.ceil(filteredPhotos.length / pageSize)
    };
  }

  // Rename an album
  static renameAlbum(albumId: string, newName: string): Album {
    const albumIndex = this.albums.findIndex(a => a.id === albumId);
    if (albumIndex === -1) {
      throw new Error('Album not found');
    }

    if (!newName.trim()) {
      throw new Error('Album name cannot be empty');
    }

    this.albums[albumIndex].name = newName;
    return this.albums[albumIndex];
  }

  // Move a photo to a different album
  static movePhoto(photoId: string, targetAlbumId?: string): Photo {
    const photoIndex = this.photos.findIndex(p => p.id === photoId);
    if (photoIndex === -1) {
      throw new Error('Photo not found');
    }

    const photo = this.photos[photoIndex];
    
    // If the photo was in a previous album, decrease its photo count
    if (photo.albumId) {
      const prevAlbumIndex = this.albums.findIndex(a => a.id === photo.albumId);
      if (prevAlbumIndex !== -1) {
        this.albums[prevAlbumIndex].photoCount -= 1;
      }
    }

    // Update the photo's album
    photo.albumId = targetAlbumId;

    // If moving to a new album, increase its photo count
    if (targetAlbumId) {
      const newAlbumIndex = this.albums.findIndex(a => a.id === targetAlbumId);
      if (newAlbumIndex !== -1) {
        this.albums[newAlbumIndex].photoCount += 1;
      }
    }

    return photo;
  }

  // Advanced filtering methods

  // Filter photos by multiple criteria
  static filterPhotos(
    options: {
      albumId?: string;
      startDate?: Date;
      endDate?: Date;
      minSize?: number;
      maxSize?: number;
      searchTerm?: string;
      sortBy?: 'date' | 'name' | 'size';
      sortOrder?: 'asc' | 'desc';
    },
    page: number = 1,
    pageSize: number = 12
  ): PaginatedResult<Photo> {
    let filteredPhotos = this.photos;

    // Filter by album
    if (options.albumId) {
      filteredPhotos = filteredPhotos.filter(photo => photo.albumId === options.albumId);
    }

    // Filter by date range
    if (options.startDate) {
      filteredPhotos = filteredPhotos.filter(photo => 
        new Date(photo.uploadedAt) >= options.startDate!
      );
    }
    if (options.endDate) {
      filteredPhotos = filteredPhotos.filter(photo => 
        new Date(photo.uploadedAt) <= options.endDate!
      );
    }

    // Filter by file size
    if (options.minSize !== undefined) {
      filteredPhotos = filteredPhotos.filter(photo => photo.size >= options.minSize!);
    }
    if (options.maxSize !== undefined) {
      filteredPhotos = filteredPhotos.filter(photo => photo.size <= options.maxSize!);
    }

    // Search by filename
    if (options.searchTerm) {
      const searchLower = options.searchTerm.toLowerCase();
      filteredPhotos = filteredPhotos.filter(photo => 
        photo.name.toLowerCase().includes(searchLower)
      );
    }

    // Sorting
    if (options.sortBy) {
      filteredPhotos.sort((a, b) => {
        let comparison = 0;
        switch (options.sortBy) {
          case 'date':
            comparison = new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime();
            break;
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'size':
            comparison = a.size - b.size;
            break;
        }
        return options.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    // Pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    const paginatedPhotos = filteredPhotos.slice(startIndex, endIndex);
    
    return {
      items: paginatedPhotos,
      total: filteredPhotos.length,
      page,
      pageSize,
      totalPages: Math.ceil(filteredPhotos.length / pageSize)
    };
  }

  // Filter albums by multiple criteria
  static filterAlbums(
    options: {
      userId?: string;
      searchTerm?: string;
      minPhotoCount?: number;
      maxPhotoCount?: number;
      startDate?: Date;
      endDate?: Date;
      sortBy?: 'date' | 'name' | 'photoCount';
      sortOrder?: 'asc' | 'desc';
    },
    page: number = 1,
    pageSize: number = 10
  ): PaginatedResult<Album> {
    let filteredAlbums = this.albums;

    // Filter by user
    if (options.userId) {
      filteredAlbums = filteredAlbums.filter(album => album.userId === options.userId);
    }

    // Search by album name
    if (options.searchTerm) {
      const searchLower = options.searchTerm.toLowerCase();
      filteredAlbums = filteredAlbums.filter(album => 
        album.name.toLowerCase().includes(searchLower)
      );
    }

    // Filter by photo count
    if (options.minPhotoCount !== undefined) {
      filteredAlbums = filteredAlbums.filter(album => 
        album.photoCount >= options.minPhotoCount!
      );
    }
    if (options.maxPhotoCount !== undefined) {
      filteredAlbums = filteredAlbums.filter(album => 
        album.photoCount <= options.maxPhotoCount!
      );
    }

    // Filter by date range
    if (options.startDate) {
      filteredAlbums = filteredAlbums.filter(album => 
        new Date(album.createdAt) >= options.startDate!
      );
    }
    if (options.endDate) {
      filteredAlbums = filteredAlbums.filter(album => 
        new Date(album.createdAt) <= options.endDate!
      );
    }

    // Sorting
    if (options.sortBy) {
      filteredAlbums.sort((a, b) => {
        let comparison = 0;
        switch (options.sortBy) {
          case 'date':
            comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            break;
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'photoCount':
            comparison = a.photoCount - b.photoCount;
            break;
        }
        return options.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    // Pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    const paginatedAlbums = filteredAlbums.slice(startIndex, endIndex);
    
    return {
      items: paginatedAlbums,
      total: filteredAlbums.length,
      page,
      pageSize,
      totalPages: Math.ceil(filteredAlbums.length / pageSize)
    };
  }

  // Bulk move photos to another album
  static bulkMovePhotos(photoIds: string[], targetAlbumId?: string): void {
    photoIds.forEach(photoId => {
      this.movePhoto(photoId, targetAlbumId);
    });
  }

  // Bulk copy photos (creates new photo entries)
  static bulkCopyPhotos(photoIds: string[], targetAlbumId?: string): Photo[] {
    return photoIds.map(photoId => {
      const originalPhoto = this.photos.find(p => p.id === photoId);
      
      if (!originalPhoto) {
        throw new Error(`Photo with ID ${photoId} not found`);
      }

      // Create a new photo with a new ID but same properties
      const copiedPhoto: Photo = {
        ...originalPhoto,
        id: uuidv4(), // Generate new unique ID
        uploadedAt: new Date().toISOString(), // Update upload date
        albumId: targetAlbumId
      };

      this.photos.push(copiedPhoto);

      // Update target album photo count if applicable
      if (targetAlbumId) {
        const albumIndex = this.albums.findIndex(a => a.id === targetAlbumId);
        if (albumIndex !== -1) {
          this.albums[albumIndex].photoCount += 1;
        }
      }

      return copiedPhoto;
    });
  }
}
