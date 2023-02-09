import { HttpStatus } from '@nestjs/common';
import { FileUploadErrorEnum } from '../enums/file-upload-error.enum';

export class FileUploadErrorException extends Error {
  name: string;
  code: string | number;
  status: number;
  message: string;
  stack: string;

  constructor(error?: any) {
    super(error || 'An Error occurred.');
    this.name = 'Asset API Error';
    this.code = Error.name;
    this.message = FileUploadErrorException.getMessage(error);
    this.status = FileUploadErrorException.getStatusCode(error.code);
    this.stack = error;
  }

  private static getStatusCode(errorCode: string): HttpStatus {
    switch (errorCode) {
      case FileUploadErrorEnum.AccessDenied ||
        FileUploadErrorEnum.AccountProblem ||
        FileUploadErrorEnum.AllAccessDisabled ||
        FileUploadErrorEnum.CrossLocationLoggingProhibited ||
        FileUploadErrorEnum.InvalidAccessKeyId ||
        FileUploadErrorEnum.InvalidObjectState ||
        FileUploadErrorEnum.InvalidPayer ||
        FileUploadErrorEnum.InvalidSecurity ||
        FileUploadErrorEnum.NotSignedUp ||
        FileUploadErrorEnum.RequestTimeTooSkewed ||
        FileUploadErrorEnum.SignatureDoesNotMatch:
        return HttpStatus.FORBIDDEN;

      case FileUploadErrorEnum.AmbiguousGrantByEmailAddress ||
        FileUploadErrorEnum.AuthorizationHeaderMalformed ||
        FileUploadErrorEnum.BadDigest ||
        FileUploadErrorEnum.CredentialsNotSupported ||
        FileUploadErrorEnum.EntityTooSmall ||
        FileUploadErrorEnum.EntityTooLarge ||
        FileUploadErrorEnum.ExpiredToken ||
        FileUploadErrorEnum.IllegalVersioningConfigurationException ||
        FileUploadErrorEnum.IncompleteBody ||
        FileUploadErrorEnum.IncorrectNumberOfFilesInPostRequest ||
        FileUploadErrorEnum.InlineDataTooLarge ||
        FileUploadErrorEnum.InvalidAddressingHeader ||
        FileUploadErrorEnum.InvalidArgument ||
        FileUploadErrorEnum.InvalidBucketName ||
        FileUploadErrorEnum.InvalidDigest ||
        FileUploadErrorEnum.InvalidEncryptionAlgorithmError ||
        FileUploadErrorEnum.InvalidLocationConstraint ||
        FileUploadErrorEnum.InvalidPart ||
        FileUploadErrorEnum.InvalidPartOrder ||
        FileUploadErrorEnum.InvalidPolicyDocument ||
        FileUploadErrorEnum.InvalidRequest ||
        FileUploadErrorEnum.InvalidSOAPRequest ||
        FileUploadErrorEnum.InvalidStorageClass ||
        FileUploadErrorEnum.InvalidTargetBucketForLogging ||
        FileUploadErrorEnum.InvalidToken ||
        FileUploadErrorEnum.InvalidURI ||
        FileUploadErrorEnum.InvalidTag ||
        FileUploadErrorEnum.KeyTooLongError ||
        FileUploadErrorEnum.MalformedACLError ||
        FileUploadErrorEnum.MalformedPOSTRequest ||
        FileUploadErrorEnum.MalformedXML ||
        FileUploadErrorEnum.MaxMessageLengthExceeded ||
        FileUploadErrorEnum.MaxPostPreDataLengthExceededError ||
        FileUploadErrorEnum.MetadataTooLarge ||
        FileUploadErrorEnum.MissingAttachment ||
        FileUploadErrorEnum.MissingRequestBodyError ||
        FileUploadErrorEnum.MissingSecurityElement ||
        FileUploadErrorEnum.MissingSecurityHeader ||
        FileUploadErrorEnum.NoLoggingStatusForKey ||
        FileUploadErrorEnum.RequestIsNotMultiPartContent ||
        FileUploadErrorEnum.RequestTimeout ||
        FileUploadErrorEnum.RequestTorrentOfBucketError ||
        FileUploadErrorEnum.TokenRefreshRequired ||
        FileUploadErrorEnum.TooManyBuckets ||
        FileUploadErrorEnum.UnexpectedContent ||
        FileUploadErrorEnum.UnresolvableGrantByEmailAddress ||
        FileUploadErrorEnum.UserKeyMustBeSpecified:
        return HttpStatus.BAD_REQUEST;

      case FileUploadErrorEnum.NoSuchBucket ||
        FileUploadErrorEnum.NoSuchFile ||
        FileUploadErrorEnum.NoSuchBucketPolicy ||
        FileUploadErrorEnum.NoSuchKey ||
        FileUploadErrorEnum.NoSuchLifecycleConfiguration ||
        FileUploadErrorEnum.NoSuchUpload ||
        FileUploadErrorEnum.NoSuchVersion:
        return HttpStatus.NOT_FOUND;

      case FileUploadErrorEnum.MethodNotAllowed:
        return HttpStatus.NOT_ACCEPTABLE;

      case FileUploadErrorEnum.UnsupportedMediaType:
        return HttpStatus.UNSUPPORTED_MEDIA_TYPE;

      case FileUploadErrorEnum.MissingContentLength:
        return HttpStatus.LENGTH_REQUIRED;

      case FileUploadErrorEnum.BucketAlreadyExists ||
        FileUploadErrorEnum.BucketAlreadyOwnedByYou ||
        FileUploadErrorEnum.BucketNotEmpty ||
        FileUploadErrorEnum.InvalidBucketState ||
        FileUploadErrorEnum.OperationAborted ||
        FileUploadErrorEnum.RestoreAlreadyInProgress:
        return HttpStatus.CONFLICT;

      case FileUploadErrorEnum.PreconditionFailed:
        return HttpStatus.PRECONDITION_FAILED;

      case FileUploadErrorEnum.InvalidRange:
        return HttpStatus.REQUESTED_RANGE_NOT_SATISFIABLE;

      case FileUploadErrorEnum.InternalError:
        return HttpStatus.INTERNAL_SERVER_ERROR;

      case FileUploadErrorEnum.ServiceUnavailable ||
        FileUploadErrorEnum.SlowDown:
        return HttpStatus.SERVICE_UNAVAILABLE;

      case FileUploadErrorEnum.NotImplemented:
        return HttpStatus.NOT_IMPLEMENTED;

      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }

  private static getMessage(error: any) {
    return Array.isArray(error.errors)
      ? error.errors.map((line) => line.toString())
      : error;
  }
}
