import { api } from "@/api/client";

interface UploadStarImageRequest {
  mimeTypes: string[];
}

interface UploadStarImageResponse {
  imageKey?: string;
  presignedUrl?: string;
  imageUrl?: string;
}

interface ConfirmStarImageRequest {
  imageKeys: string[];
}

interface StarImageListItemResponse {
  starImageId?: number;
  imageUrl?: string;
}

// 이미지 업로드 Presigned URL 발급
export const uploadImage = (starRecordId: number, body: UploadStarImageRequest) =>
  api.post<UploadStarImageResponse[]>(
    `/api/star-records/${starRecordId}/images/presigned-url`,
    body,
  );

// 이미지 업로드 완료 확인
export const confirmImage = (starRecordId: number, body: ConfirmStarImageRequest) =>
  api.post<null>(`/api/star-records/${starRecordId}/images/confirm`, body);

// 이미지 목록 조회
export const getImages = (starRecordId: number) =>
  api.get<StarImageListItemResponse[]>(`/api/star-records/${starRecordId}/images`);

// 이미지 삭제
export const deleteImage = (starRecordId: number, imageId: number) =>
  api.delete<null>(`/api/star-records/${starRecordId}/images/${imageId}`);
