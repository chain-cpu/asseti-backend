import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { AddFeatureDto } from './dto/add-feature.dto';
import { EditFeatureDto } from './dto/edit-feature.dto';
import { FeatureEntity } from './feature.entity';
import { DbErrorsEnum } from '../../../enums/db-errors.enum';

@Injectable()
export class FeatureService {
  constructor(
    @InjectRepository(FeatureEntity)
    private readonly featureRepository: Repository<FeatureEntity>,
  ) {}

  /**
   * Add feature
   * @param {AddFeatureDto} param
   */
  async add(param: AddFeatureDto): Promise<FeatureEntity> {
    const entity = this.featureRepository.create(param);
    try {
      return await this.featureRepository.save(entity);
    } catch (error) {
      if (error.driverError.code === DbErrorsEnum.UNIQUE_CONSTRAINT)
        throw new ConflictException('This feature has already being defined');
    }
  }

  /**
   * Edit feature
   * @param {string} id
   * @param {EditFeatureDto} param
   */
  async updateById(id: string, param: EditFeatureDto): Promise<UpdateResult> {
    const entity = this.featureRepository.create(param);
    const value = await this.featureRepository.update(id, entity);
    if (value.affected === 0)
      throw new NotFoundException('Not found feature property');
    return value;
  }

  /**
   * Get feature by Id
   * @param {string} id
   */
  async getById(id: string): Promise<FeatureEntity> {
    return this.featureRepository.findOneBy({ id });
  }

  /**
   * Get list of features for admins
   */
  async list(): Promise<{ data: FeatureEntity[]; total: number }> {
    const data = await this.featureRepository.find({});
    const total = await this.featureRepository.count({});
    return {
      total,
      data,
    };
  }

  /**
   * Get list of features for application
   */
  async getAll(): Promise<FeatureEntity[]> {
    return await this.featureRepository.find({
      select: ['isActive', 'name'],
    });
  }
}
