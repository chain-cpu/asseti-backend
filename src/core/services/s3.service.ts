import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { Express } from 'express';
import { v4 as uuid } from 'uuid';

@Injectable()
export class S3Service {
  private readonly s3: S3;

  constructor(private config: ConfigService) {
    const accessKey = config.get('AWS_ACCESS_KEY_ID');
    const secretKey = config.get('AWS_SECRET_ACCESS_KEY');

    this.s3 = new S3({
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
      s3ForcePathStyle: true,
    });
  }

  async uploadObject(
    file: Express.Multer.File,
  ): Promise<S3.ManagedUpload.SendData> {
    return await this.s3
      .upload({
        Bucket: this.config.get('AWS_BUCKET_NAME'),
        Body: file.buffer,
        Key: `${uuid()}-${file.originalname}`,
        ContentType: file.mimetype,
      })
      .promise();
  }

  async removeObject(location: string): Promise<S3.Types.DeleteObjectOutput> {
    const bucket = this.config.get('AWS_BUCKET_NAME');
    const objectKey = location.split(`/${bucket}/`)[1];
    return await this.s3
      .deleteObject({
        Bucket: bucket,
        Key: objectKey,
      })
      .promise();
  }
}
