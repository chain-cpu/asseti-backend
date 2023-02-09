import { UnsupportedMediaTypeException } from '@nestjs/common';

/**
 * Mime type filter for upload images
 * @param {string[]} mimetypes
 */
export function fileMimetypeFilter(...mimetypes: string[]) {
  return (
    req,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (mimetypes.some((m) => file.mimetype.includes(m))) {
      callback(null, true);
    } else {
      callback(
        new UnsupportedMediaTypeException(
          `You can upload only allowed file types: ${mimetypes.join(', ')}`,
        ),
        false,
      );
    }
  };
}
