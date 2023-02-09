import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TagSet as S3TagSet, Tag as S3Tag } from 'aws-sdk/clients/s3';
import { Auth0UserType } from '../../../types/auth0-user.type';
import { FileTagEnum } from '../enums/file-tag.enum';

/**
 * Create tags formatted for AWS Services
 */
export const CreateTags = createParamDecorator(
  (
    data: keyof Auth0UserType | undefined,
    context: ExecutionContext,
  ): S3TagSet => {
    const request: Request = context.switchToHttp().getRequest();
    const response = [
      {
        Key: FileTagEnum.CREATED_AT,
        Value: new Date().toISOString(),
      } as S3Tag,
      {
        Key: FileTagEnum.CREATED_BY,
        Value: 'user' in request ? (request['user'].sub as string) : '',
      } as S3Tag,
    ];
    return response;
  },
);
