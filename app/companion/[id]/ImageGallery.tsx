"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageGalleryProps {
  images: Array<{ src: string; alt: string | null }>;
  companionTitle: string;
}

export function ImageGallery({ images, companionTitle }: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div
        className="aspect-[4/5] rounded-2xl overflow-hidden relative"
        style={{
          background: "linear-gradient(to bottom right, #AFC8DA, #e2eef7)",
        }}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "#AFC8DA" }}
          >
            <span className="text-4xl font-bold" style={{ color: "#47709B" }}>
              {companionTitle.charAt(0)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div
        className="aspect-[4/5] rounded-2xl overflow-hidden relative"
        style={{
          background: "linear-gradient(to bottom right, #AFC8DA, #e2eef7)",
        }}
      >
        <Image
          src={images[selectedImageIndex].src}
          alt={images[selectedImageIndex].alt || companionTitle}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <div
              key={index}
              className={`aspect-square rounded-lg overflow-hidden bg-gray-100 relative hover:opacity-80 transition-all cursor-pointer border-2 ${
                selectedImageIndex === index
                  ? "border-blue-500 ring-2 ring-blue-200"
                  : "border-transparent hover:border-blue-300"
              }`}
              onClick={() => setSelectedImageIndex(index)}
            >
              <Image
                src={image.src}
                alt={image.alt || `${companionTitle} photo ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 25vw, 12vw"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
