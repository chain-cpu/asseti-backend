import { registerAs } from '@nestjs/config';
import { AwsConfigType } from './types/aws.config.type';
import { getEnv } from '../utils/get-env.variable.util';

export default registerAs(
  'aws',
  (): AwsConfigType => ({
    /**
     * Get AWS credentials
     * @return { accessKeyId: string; secretAccessKey: string; region: string }
     */
    getCredentials: (): {
      accessKeyId: string;
      region: string;
      secretAccessKey: string;
    } => ({
      accessKeyId: getEnv('AWS_ACCESS_KEY_ID', true),
      secretAccessKey: getEnv('AWS_SECRET_ACCESS_KEY', true),
      region: getEnv('AWS_REGION', true),
    }),

    /**
     * Get AWS S3 Assets storage bucket
     * @return string
     */
    getStorageS3Bucket: (): string => getEnv('AWS_BUCKET_NAME', true),
  }),
);
