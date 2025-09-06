export interface ImageConstraints {
  width: number;
  height: number;
  maxSizeInMB: number;
  allowedTypes?: string[];
}

export type ImageType = 'deal' | 'menuItem' | 'entity' | 'branchLogo' | 'branchBanner';

// Define constraints for different image types
export const IMAGE_CONSTRAINTS: Record<ImageType, ImageConstraints> = {
  deal: {
    width: 400,
    height: 300,
    maxSizeInMB: 2,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  },
  menuItem: {
    width: 400,
    height: 300,
    maxSizeInMB: 2,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  },
  entity: {
    width: 400,
    height: 300,
    maxSizeInMB: 2,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  },
  branchLogo: {
    width: 512,
    height: 512,
    maxSizeInMB: 4,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  },
  branchBanner: {
    width: 1920,
    height: 192,
    maxSizeInMB: 7,
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  }
};

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface ValidationOptions {
  checkDimensions?: boolean;
  checkFileSize?: boolean;
  checkFileType?: boolean;
}

/**
 * Validates an image file against specific constraints
 */
export async function validateImage(
  file: File,
  imageType: ImageType,
  options: ValidationOptions = {
    checkDimensions: true,
    checkFileSize: true,
    checkFileType: true
  }
): Promise<ValidationResult> {
  const constraints = IMAGE_CONSTRAINTS[imageType];

  // Check file type
  if (options.checkFileType && constraints.allowedTypes) {
    if (!constraints.allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `Invalid file type. Please select a ${constraints.allowedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')} file.`
      };
    }
  }

  // Check file size
  if (options.checkFileSize) {
    const maxSizeInBytes = constraints.maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return {
        isValid: false,
        error: `File size exceeds ${constraints.maxSizeInMB}MB limit. Please select a smaller image.`
      };
    }
  }

  // Check image dimensions
  if (options.checkDimensions) {
    try {
      const dimensions = await getImageDimensions(file);
      if (dimensions.width !== constraints.width || dimensions.height !== constraints.height) {
        return {
          isValid: false,
          error: `Image dimensions must be exactly ${constraints.width}x${constraints.height} pixels. Current image is ${dimensions.width}x${dimensions.height} pixels.`
        };
      }
    } catch (error) {
      return {
        isValid: false,
        error: 'Failed to read image dimensions. Please select a valid image file.'
      };
    }
  }

  return { isValid: true };
}

/**
 * Gets the dimensions of an image file
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Gets a user-friendly description of image constraints
 */
export function getConstraintDescription(imageType: ImageType): string {
  const constraints = IMAGE_CONSTRAINTS[imageType];
  return `${constraints.width}x${constraints.height} pixels, max ${constraints.maxSizeInMB}MB`;
}

/**
 * Formats file size in a human-readable way
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}