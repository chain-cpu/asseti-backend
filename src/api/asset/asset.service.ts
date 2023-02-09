import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { config, S3 } from 'aws-sdk';
import { DeleteObjectOutput, TagSet } from 'aws-sdk/clients/s3';
import { DeleteResult, Repository } from 'typeorm';
import { AssetFilter } from './asset.filter';
import { AssetSort } from './asset.sort';
import { AssetRegisterDto } from './dto/asset-register.dto';
import { AssetStateEntity } from './entities/asset-state.entity';
import { AssetEntity } from './entities/asset.entity';
import { AssetStateEnum } from './enums/asset-state.enum';
import { FileDirectoryEnum } from './enums/file-directory.enum';
import { FileTagEnum } from './enums/file-tag.enum';
import { FileUploadErrorException } from './exceptions/file-upload-error.exception';
import { AssetMetaType } from './types/asset-meta.type';
import { apiConfig, awsConfig } from '../../configs';
import { DbErrorsEnum } from '../../enums/db-errors.enum';
import { PaginationLimitPipe } from '../../pipes/pagination-limit.pipe';
import { PaginationOffsetPipe } from '../../pipes/pagination-offset.pipe';
import { User } from '../users/user.entity';

@Injectable()
export class AssetService {
  /**
   * AWS S3 repository
   * @private
   */
  private readonly s3Repository: S3;

  /**
   * AWS S3 bucket
   * @private
   */
  private readonly bucket: string;

  constructor(
    @Inject(apiConfig.KEY)
    private readonly apiConf: ConfigType<typeof apiConfig>,
    @Inject(awsConfig.KEY)
    private readonly awsConf: ConfigType<typeof awsConfig>,
    @InjectRepository(AssetEntity)
    private readonly assetRepository: Repository<AssetEntity>,
    @InjectRepository(AssetStateEntity)
    private readonly assetStateRepository: Repository<AssetStateEntity>,
  ) {
    config.logger = !this.apiConf.isProduction()
      ? new Logger(AssetService.name)
      : null;
    this.s3Repository = new S3(this.awsConf.getCredentials());
    this.bucket = this.awsConf.getStorageS3Bucket();
  }

  /**
   * Upload file to S3
   * @param {FileDirectoryEnum} directory
   * @param {Buffer} buffer
   * @param {string} mime
   * @param {TagSet} tags
   */
  async uploadFile(
    directory: FileDirectoryEnum,
    buffer: Buffer,
    mime: string,
    tags: TagSet,
  ): Promise<AssetMetaType> {
    const createdAt = Date.now();
    const Key = `${directory}/${String(createdAt)}`;

    try {
      const file = await this.s3Repository
        .upload(
          {
            Bucket: this.bucket,
            Body: buffer,
            Key,
            ContentType: mime,
          },
          { tags },
        )
        .promise();

      return {
        location: file.Key,
        createdBy:
          tags.find((tag) => tag.Key === FileTagEnum.CREATED_BY).Value || null,
        fileSize: parseInt(
          tags.find((tag) => tag.Key === FileTagEnum.FILE_SIZE).Value,
        ),
        fileMimeType: tags.find((tag) => tag.Key === FileTagEnum.FILE_MIMETYPE)
          .Value,
      };
    } catch (error) {
      throw new FileUploadErrorException(error);
    }
  }

  /**
   * Delete file from S3
   * @param {string} key
   */
  async deleteFile(key: string): Promise<DeleteObjectOutput> {
    try {
      return await this.s3Repository
        .deleteObject({
          Bucket: this.bucket,
          Key: key,
        })
        .promise();
    } catch (error) {
      throw new FileUploadErrorException(error);
    }
  }

  /**
   * Register asset
   * @param {AssetRegisterDto} param
   */
  async registerAsset(param: AssetRegisterDto): Promise<AssetEntity> {
    const entity = this.assetRepository.create(param);
    try {
      return await this.assetRepository.save(entity);
    } catch (error) {
      if (error.driverError.code === DbErrorsEnum.UNIQUE_CONSTRAINT)
        throw new ConflictException('Asset has already being registered');
    }
  }

  /**
   * Get asset by Id
   * @param {string} id
   */
  async getAsset(id: string): Promise<AssetEntity> {
    const asset = await this.assetRepository.findOne({
      where: { id },
    });
    if (!asset) throw new NotFoundException(`Asset with ${id} was not found`);
    return asset;
  }

  /**
   * Get assets list
   * @param {AssetFilter} filter
   * @param {AssetSort} sort
   * @param {PaginationOffsetPipe} offset
   * @param {PaginationLimitPipe} limit
   */
  async getAssetsList(
    filter?: AssetFilter,
    sort?: AssetSort,
    offset?: PaginationOffsetPipe,
    limit?: PaginationLimitPipe,
  ): Promise<{ data: AssetEntity[]; total: number }> {
    const total = await this.assetRepository.count({
      where: filter as any,
    });

    const data = await this.assetRepository.find({
      where: filter as any,
      order: sort,
      skip: offset as number,
      take: limit as number,
      relations: ['assigned.user'],
    });

    return {
      total,
      data,
    };
  }

  /**
   * Unregister asset
   * @param {string} id
   */
  async unregisterAsset(id: string): Promise<DeleteResult> {
    return await this.assetRepository.delete(id);
  }

  /**
   * Assign / Reassign asset to users
   * @param {AssetEntity} asset
   * @param {User} users
   */
  async assignToUsers(asset: AssetEntity, users: User[]) {
    const rows = users.map((user) => ({
      user,
      asset,
    }));
    const result = await this.assetStateRepository.upsert(rows, [
      'asset',
      'user',
    ]);
    return result.raw;
  }

  /**
   * Get assigned asset
   * @param {string} id
   * @param {User} user
   */
  async getAssignedAsset(id: string, user: User): Promise<AssetStateEntity> {
    const asset = this.assetRepository.create({ id });
    return await this.assetStateRepository.findOne({
      where: {
        asset: {
          id: asset.id,
        },
        user: {
          id: user.id,
        },
      },
    });
  }

  /**
   * Change asset state
   * @param {string} id
   * @param {AssetStateEnum} status
   */
  async changeAssetState(
    id: string,
    status: AssetStateEnum,
  ): Promise<AssetStateEntity> {
    const entity = this.assetStateRepository.create({ status });
    const assetState = await this.assetStateRepository.update(id, entity);
    if (assetState.affected === 0)
      throw new NotFoundException(
        `Nothing to update. Asset state was not found`,
      );
    return assetState.raw;
  }
}
