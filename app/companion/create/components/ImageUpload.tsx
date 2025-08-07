import React, { useRef, useState, forwardRef } from "react";
import Image from "next/image";

interface ImageUploadProps {
  images: File[];
  onChange: (images: File[]) => void;
  error?: string;
}

const ImageUpload = forwardRef<HTMLDivElement, ImageUploadProps>(({
  images,
  onChange,
  error,
}, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  // Helper function to compress image
  const compressImage = (file: File, maxWidth: number = 2048, maxHeight: number = 2048, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = document.createElement('img');
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file); // Fallback to original file
          }
        }, file.type, quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    const maxSize = 3 * 1024 * 1024; // Reduced to 3MB to account for base64 expansion
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      
      // iOS Safari may not set file.type properly, so also check extension
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
      
      const isValidType = allowedTypes.includes(file.type) || 
                         (fileExtension && validExtensions.includes(fileExtension));
      
      if (!isValidType) {
        alert("只允许JPG、PNG和GIF文件");
        continue;
      }
      
      if (file.size === 0) {
        alert("文件为空，请选择有效的图片文件");
        continue;
      }

      let processedFile = file;
      
      // Compress image if it's too large
      if (file.size > maxSize) {
        try {
          processedFile = await compressImage(file);
        } catch {
          alert(`压缩图片失败: ${file.name}`);
          continue;
        }
      }

      // Final size check after compression
      if (processedFile.size > maxSize) {
        alert(`图片太大，即使压缩后仍超过3MB: ${file.name}`);
        continue;
      }

      validFiles.push(processedFile);
    }

    const totalFiles = [...images, ...validFiles];
    if (totalFiles.length > 5) {
      alert("最多允许5张图片");
      onChange([...images, ...validFiles.slice(0, 5 - images.length)]);
    } else {
      onChange([...images, ...validFiles]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const getImagePreview = (file: File): string => {
    try {
      return URL.createObjectURL(file);
    } catch {
      // Return a placeholder or handle the error gracefully
      return '';
    }
  };

  return (
    <div ref={ref} className="space-y-4">
      <div className="text-sm text-gray-600">{""}</div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? "border-blue-400 bg-blue-50"
            : error
            ? "border-red-300 bg-red-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/gif,image/jpg"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          <div>
            <p className="text-lg text-gray-600">{""}</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 text-blue-600 hover:text-blue-500 font-medium"
            >
              浏览文件
            </button>
          </div>

          <div className="text-sm text-gray-500 space-y-1">
            <p>支持 JPG、PNG、GIF 格式</p>
            <p>图片将自动压缩以确保上传成功</p>
            <p>建议每张图片不超过 3MB</p>
          </div>
        </div>
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={getImagePreview(image)}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg z-10"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                {image.name}
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
});

ImageUpload.displayName = 'ImageUpload';

export default ImageUpload;
