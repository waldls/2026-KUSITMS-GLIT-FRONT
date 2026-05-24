"use client";

import Image from "next/image";
import { type Dispatch, type SetStateAction, useEffect, useRef, useState } from "react";

import { AddIcon, CancelIcon, ImageIcon } from "@/assets/icons";
import Toast from "@/components/common/Toast";

export interface StarImageAttachment {
  id: string;
  url: string;
  file: File;
  starImageId?: number;
  isUploading?: boolean;
}

interface StarImageUploaderProps {
  images: StarImageAttachment[];
  onImagesChange: Dispatch<SetStateAction<StarImageAttachment[]>>;
  onImageUpload: (image: StarImageAttachment) => Promise<void>;
  onImageRemove?: (image: StarImageAttachment) => Promise<void>;
}

const MAX_IMAGE_COUNT = 2;

const StarImageUploader = ({
  images,
  onImagesChange,
  onImageUpload,
  onImageRemove,
}: StarImageUploaderProps) => {
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [isLimitToastVisible, setIsLimitToastVisible] = useState(false);
  const [isUploadToastVisible, setIsUploadToastVisible] = useState(false);

  useEffect(() => {
    if (!isLimitToastVisible && !isUploadToastVisible) return;

    const timer = window.setTimeout(() => {
      setIsLimitToastVisible(false);
      setIsUploadToastVisible(false);
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [isLimitToastVisible, isUploadToastVisible]);

  const openImagePicker = () => {
    imageInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const remainingCount = MAX_IMAGE_COUNT - images.length;

    if (files.length > remainingCount) {
      setIsLimitToastVisible(true);
    }

    const selectedFiles = files.slice(0, remainingCount);

    if (selectedFiles.length > 0) {
      const nextImages = selectedFiles.map(file => ({
        id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
        url: URL.createObjectURL(file),
        file,
        isUploading: true,
      }));

      onImagesChange(prev => [...prev, ...nextImages].slice(0, MAX_IMAGE_COUNT));

      nextImages.forEach(image => {
        void onImageUpload(image).catch(() => {
          URL.revokeObjectURL(image.url);
          onImagesChange(prev => prev.filter(item => item.id !== image.id));
          setIsUploadToastVisible(true);
        });
      });
    }

    e.target.value = "";
  };

  const handleRemoveImage = (imageId: string) => {
    const removedImage = images.find(image => image.id === imageId);
    if (removedImage) URL.revokeObjectURL(removedImage.url);

    onImagesChange(prev => prev.filter(image => image.id !== imageId));
    if (removedImage) void onImageRemove?.(removedImage);
  };

  return (
    <div className="mt-8.5">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-0.5">
          <ImageIcon className="size-6 text-gray-100" aria-hidden />
          <span className="body-2 text-gray-100">이미지 첨부</span>
        </div>
        <span className="body-5 text-gray-600">최대 2장</span>
      </div>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/jpeg,image/png"
        multiple
        className="hidden"
        onChange={handleImageChange}
      />

      {images.length === 0 ? (
        <button
          type="button"
          className="body-5 rounded-6 bg-gray-850 flex h-21.5 w-full cursor-pointer flex-col items-center justify-center text-gray-800"
          onClick={openImagePicker}>
          <AddIcon className="mb-0.5 size-6 text-gray-800" aria-hidden />
          <span>JPG 최대 10MB / PNG 최대 10MB</span>
        </button>
      ) : (
        <div className="flex gap-3">
          {images.map(image => (
            <div
              key={image.id}
              className="rounded-6 bg-gray-850 relative size-21.5 overflow-hidden">
              <Image src={image.url} alt="첨부 이미지" fill unoptimized className="object-cover" />
              {image.isUploading && <div className="absolute inset-0 bg-black/40" />}
              <button
                type="button"
                aria-label="이미지 삭제"
                disabled={image.isUploading}
                className="absolute top-1.25 right-1.25 flex cursor-pointer items-center justify-center rounded-full bg-white"
                onClick={() => handleRemoveImage(image.id)}>
                <CancelIcon className="size-5 text-gray-800" aria-hidden />
              </button>
            </div>
          ))}
          {images.length < MAX_IMAGE_COUNT && (
            <button
              type="button"
              className="body-5 rounded-6 bg-gray-850 flex size-21.5 cursor-pointer flex-col items-center justify-center px-4 py-5 text-gray-800"
              onClick={openImagePicker}>
              <AddIcon className="mb-1 size-6 text-gray-800" aria-hidden />
              이미지 추가
            </button>
          )}
        </div>
      )}

      {isLimitToastVisible && (
        <Toast
          contents="최대 2장만 고를 수 있어요"
          showCloseButton={false}
          className="fixed bottom-9.5 left-1/2 z-[60] -translate-x-1/2 justify-center transition-opacity duration-300"
        />
      )}
      {isUploadToastVisible && (
        <Toast
          contents="이미지를 다시 선택해주세요"
          showCloseButton={false}
          className="fixed bottom-9.5 left-1/2 z-[60] -translate-x-1/2 justify-center transition-opacity duration-300"
        />
      )}
    </div>
  );
};

export default StarImageUploader;
