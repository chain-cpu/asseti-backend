import { BadRequestException } from '@nestjs/common';

export const avatarFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.mimetype.match(/^(image)\/\w+$/)) {
    return callback(
      new BadRequestException('Only image files are allowed'),
      false,
    );
  }

  callback(null, true);
};
