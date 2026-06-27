"use client";

import { useState } from "react";

interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}

export function useCloudinaryUpload() {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const upload = async (files: File | File[]): Promise<string[]> => {
    setUploading(true);
    const fileArray = Array.isArray(files) ? files : [files];
    const urls: string[] = [];

    try {
      for (const file of fileArray) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "proplead_uploads");

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: "POST", body: formData },
        );
        const data: CloudinaryUploadResult = await res.json();
        urls.push(data.url);
      }

      setUploadedUrls((prev) => [...prev, ...urls]);
      return urls;
    } finally {
      setUploading(false);
    }
  };

  const removeUrl = (url: string) => {
    setUploadedUrls((prev) => prev.filter((u) => u !== url));
  };

  return { uploading, uploadedUrls, upload, removeUrl };
}
