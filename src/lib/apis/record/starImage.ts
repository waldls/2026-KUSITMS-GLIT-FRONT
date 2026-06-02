import { api } from "@/lib/apis/client";
import type {
  ConfirmStarImageRequest,
  StarImageListItemResponse,
  UploadStarImageRequest,
  UploadStarImageResponse,
} from "@/types/record/starImage";

// 이미지 업로드 Presigned URL 발급
export const postPresignedUrl = (starRecordId: number, body: UploadStarImageRequest) =>
  api.post<UploadStarImageResponse[]>(
    `/api/star-records/${starRecordId}/images/presigned-url`,
    body,
  );

// 이미지 업로드 완료 확인
export const postConfirm = (starRecordId: number, body: ConfirmStarImageRequest) =>
  api.post<null>(`/api/star-records/${starRecordId}/images/confirm`, body);

// 이미지 목록 조회
export const getImages = (starRecordId: number) =>
  api.get<StarImageListItemResponse[]>(`/api/star-records/${starRecordId}/images`);

// 이미지 삭제
export const deleteImageId = (starRecordId: number, imageId: number) =>
  api.delete<null>(`/api/star-records/${starRecordId}/images/${imageId}`);
