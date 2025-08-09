"use client";

import { useState } from "react";
import JSZip from "jszip";

interface DownloadButtonProps {
  images: Array<{
    id: number;
    src: string;
    alt: string | null;
    width: number;
    height: number;
  }>;
  chapterTitle: string;
  isAuthenticated: boolean;
}

export default function DownloadButton({
  images,
  chapterTitle,
  isAuthenticated,
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const downloadImageAsBlob = async (url: string): Promise<Blob> => {
    try {
      const response = await fetch(url, { 
        mode: 'cors',
        credentials: 'omit'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }
      
      return await response.blob();
    } catch (error) {
      console.error('Error downloading image:', error);
      throw error;
    }
  };

  const downloadZipFile = (blob: Blob, filename: string) => {
    const downloadUrl = window.URL.createObjectURL(blob);
    
    // Check if we're on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // On mobile, try different approaches for better compatibility
      try {
        // Method 1: Try native sharing if available (modern mobile browsers)
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], filename, { type: blob.type })] })) {
          navigator.share({
            files: [new File([blob], filename, { type: blob.type })],
            title: '图片下载',
            text: `下载 ${filename}`
          }).catch((error) => {
            console.log('Share failed, falling back to download:', error);
            // Fallback to direct download
            fallbackDownload();
          });
          return;
        }
      } catch (error) {
        console.log('Native share not supported, using download:', error);
      }
    }
    
    // Default download method (works on desktop and most mobile browsers)
    fallbackDownload();
    
    function fallbackDownload() {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      link.style.display = 'none';
      
      // Add to DOM
      document.body.appendChild(link);
      
      // Create and dispatch click event
      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      
      link.dispatchEvent(clickEvent);
      
      // Cleanup
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        window.URL.revokeObjectURL(downloadUrl);
      }, 1000);
    }
  };

  const handleDownloadAll = async () => {
    if (!isAuthenticated || images.length === 0) return;

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      // Create a sanitized filename from chapter title
      const sanitizedTitle = chapterTitle.replace(/[^a-zA-Z0-9\u4e00-\u9fff\s]/g, '_').replace(/\s+/g, '_');
      
      console.log(`Starting ZIP download of ${images.length} images`);
      
      // Create a new JSZip instance
      const zip = new JSZip();
      
      let successCount = 0;
      let failedCount = 0;

      // Download and add each image to the ZIP
      for (let i = 0; i < images.length; i++) {
        try {
          const image = images[i];
          const fileExtension = image.src.split('.').pop()?.split('?')[0] || 'jpg';
          const filename = `${String(i + 1).padStart(2, '0')}.${fileExtension}`;
          
          console.log(`Downloading image ${i + 1}/${images.length}: ${filename}`);
          
          // Download the image as blob
          const imageBlob = await downloadImageAsBlob(image.src);
          
          // Add the image to the ZIP file
          zip.file(filename, imageBlob);
          successCount++;
          
          // Update progress (50% for downloading, 50% for zipping)
          const progress = Math.round(((i + 1) / images.length) * 50);
          setDownloadProgress(progress);
          console.log(`Download Progress: ${progress}%`);
          
        } catch (error) {
          console.error(`Failed to download image ${i + 1}:`, error);
          failedCount++;
        }
      }
      
      if (successCount === 0) {
        alert('所有图片下载失败，请重试');
        return;
      }

      // Generate ZIP file
      console.log('Generating ZIP file...');
      setDownloadProgress(75);
      
      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 }
      });
      
      setDownloadProgress(100);
      
      // Download the ZIP file
      const zipFilename = `${sanitizedTitle}_图片合集.zip`;
      downloadZipFile(zipBlob, zipFilename);
      
      // Show result message with mobile-friendly instructions
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (failedCount > 0) {
        alert(`下载完成！成功打包 ${successCount} 张图片，${failedCount} 张失败`);
      } else {
        const message = isMobile 
          ? `成功下载 ${successCount} 张图片！文件已保存为 ZIP 格式。\n\n📱 在手机上：请检查下载文件夹或通过分享功能保存文件。`
          : `成功下载 ${successCount} 张图片！文件已保存为 ZIP 格式`;
        alert(message);
      }
      
    } catch (error) {
      console.error('Error in download process:', error);
      alert('下载过程中出现错误，请重试');
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  // Don't show button for unauthenticated users or if no images
  if (!isAuthenticated || images.length === 0) {
    return null;
  }

  return (
    <button
      onClick={handleDownloadAll}
      disabled={isDownloading}
      className={`inline-flex items-center px-6 py-3 md:px-6 md:py-3 sm:px-8 sm:py-4 border border-transparent shadow-sm text-base font-medium rounded-md text-white transition-colors min-h-[48px] touch-manipulation ${
        isDownloading
          ? 'bg-blue-400 cursor-not-allowed'
          : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
      }`}
    >
      {isDownloading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
          下载中... {downloadProgress > 0 && `${downloadProgress}%`}
        </>
      ) : (
        <>
          <svg
            className="mr-2 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-4-4m4 4l4-4m5-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          下载ZIP文件 ({images.length}张)
        </>
      )}
    </button>
  );
}