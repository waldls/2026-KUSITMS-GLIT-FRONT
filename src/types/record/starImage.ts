export interface UploadStarImageRequest {
  mimeTypes: string[];
}

export interface UploadStarImageResponse {
  imageKey?: string;
  presignedUrl?: string;
  imageUrl?: string;
}

export interface ConfirmStarImageRequest {
  imageKeys: string[];
}

export interface StarImageListItemResponse {
  starImageId?: number;
  imageUrl?: string;
}
