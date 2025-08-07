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

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];

    // Log device info for iOS debugging
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    console.log(`[DEBUG] Image selection on ${isIOS ? 'iOS' : 'other device'}, ${files.length} files selected`);

    Array.from(files).forEach((file, index) => {
      console.log(`[DEBUG] File ${index + 1}: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);
      
      // iOS Safari may not set file.type properly, so also check extension
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
      
      const isValidType = allowedTypes.includes(file.type) || 
                         (fileExtension && validExtensions.includes(fileExtension));
      
      if (!isValidType) {
        console.error(`[DEBUG] Invalid file type: ${file.type} for file: ${file.name}`);
        alert("只允许JPG、PNG和GIF文件");
        return;
      }
      if (file.size > maxSize) {
        console.error(`[DEBUG] File too large: ${file.size} bytes for file: ${file.name}`);
        alert("每张图片必须小于5MB");
        return;
      }
      if (file.size === 0) {
        console.error(`[DEBUG] Empty file detected: ${file.name}`);
        alert("文件为空，请选择有效的图片文件");
        return;
      }
      validFiles.push(file);
    });

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
      const url = URL.createObjectURL(file);
      console.log(`[DEBUG] Created preview URL for ${file.name}`);
      return url;
    } catch (error) {
      console.error(`[DEBUG] Error creating preview URL for ${file.name}:`, error);
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
          accept="image/*"
          capture="environment"
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
            <p>{""}</p>
            <p>{""}</p>
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
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
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
