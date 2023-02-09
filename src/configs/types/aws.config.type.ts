export type AwsConfigType = {
  /**
   * Get AWS credentials
   * @return { accessKeyId: string; secretAccessKey: string; region: string }
   */
  getCredentials(): {
    accessKeyId: string;
    region: string;
    secretAccessKey: string;
  };

  /**
   * Get AWS S3 Assets bucket
   * @return string
   */
  getStorageS3Bucket(): string;
};
