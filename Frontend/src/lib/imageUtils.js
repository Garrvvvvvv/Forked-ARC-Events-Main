/**
 * Image Compression Utility
 * Compresses images client-side before upload using Canvas API
 * Maintains quality while reducing file size
 */

/**
 * Compress an image file to reduce size while maintaining quality
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @param {number} options.maxWidth - Maximum width (default: 1920)
 * @param {number} options.maxHeight - Maximum height (default: 1920)
 * @param {number} options.quality - Compression quality 0-1 (default: 0.85)
 * @param {string} options.mimeType - Output format (default: auto-detect)
 * @returns {Promise<File>} - Compressed image file
 */
export async function compressImage(file, options = {}) {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.85,
    mimeType = file.type
  } = options;

  // Validate input
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('Invalid image file');
  }

  // For very small files, skip compression
  if (file.size < 100 * 1024) { // Less than 100KB
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onerror = () => reject(new Error('Failed to load image'));
      
      img.onload = () => {
        try {
          // Calculate new dimensions maintaining aspect ratio
          let { width, height } = img;
          
          if (width > maxWidth || height > maxHeight) {
            const aspectRatio = width / height;
            
            if (width > height) {
              width = maxWidth;
              height = width / aspectRatio;
            } else {
              height = maxHeight;
              width = height * aspectRatio;
            }
          }

          // Create canvas and draw image
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          
          // Enable image smoothing for better quality
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          
          // Draw image on canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Convert canvas to blob
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }

              // Create new File from blob
              const compressedFile = new File(
                [blob],
                file.name,
                {
                  type: mimeType,
                  lastModified: Date.now()
                }
              );

              resolve(compressedFile);
            },
            mimeType,
            quality
          );
        } catch (error) {
          reject(error);
        }
      };
      
      img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Calculate compression ratio
 * @param {number} originalSize - Original file size in bytes
 * @param {number} compressedSize - Compressed file size in bytes
 * @returns {number} - Compression percentage (0-100)
 */
export function getCompressionRatio(originalSize, compressedSize) {
  if (originalSize === 0) return 0;
  return Math.round(((originalSize - compressedSize) / originalSize) * 100);
}
