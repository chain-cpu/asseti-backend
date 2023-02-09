import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { Express } from 'express';
import { Repository } from 'typeorm';
import { Company } from './company.entity';
import { CompanyDto } from './dto/company.dto';
import { SurveyDto } from '../../core/models/survey.dto';
import { S3Service } from '../../core/services/s3.service';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly s3Service: S3Service,
  ) {}

  create(survey: SurveyDto): Promise<Company> {
    const company = this.createWithNotSaving(survey);
    return this.companyRepository.save(company);
  }

  createWithNotSaving(survey: SurveyDto): Company {
    const company = new Company();
    if (survey.company_name) {
      company.companyName = survey.company_name;
    }
    if (survey.mrr_value) {
      company.mrr = survey.mrr_value;
    }
    if (survey.country) {
      company.country = survey.country;
    }

    if (survey.url) {
      company.website = survey.url;
    }

    return company;
  }

  async findOne(id: string): Promise<Company> {
    return this.companyRepository.findOneBy({ id });
  }

  async update(
    companyUpdates: CompanyDto,
    token,
    id: string,
  ): Promise<Company> {
    const company = await this.findOne(id);
    const updatedData = Object.assign({}, company, { ...companyUpdates });
    await this.companyRepository.save(updatedData);
    return updatedData;
  }

  async uploadAvatar(file: Express.Multer.File, id: string): Promise<Company> {
    const fileData: S3.ManagedUpload.SendData =
      await this.s3Service.uploadObject(file);
    const company = await this.findOne(id);

    if (company.logo) {
      await this.s3Service.removeObject(company.logo);
    }
    const updatedData = Object.assign(company, { logo: fileData.Location });
    await this.companyRepository.save(updatedData);
    return updatedData;
  }

  async deleteAvatar(id: string): Promise<Company> {
    const company = await this.findOne(id);
    if (company.logo) {
      // eslint-disable-next-line no-console
      console.log('****** avatar removing start');
      const result = await this.s3Service.removeObject(company.logo);
      // eslint-disable-next-line no-console
      console.log('****** avatar removing result: ', result);
      const updatedData = Object.assign(company, { logo: null });
      return await this.companyRepository.save(updatedData);
    }
    return company;
  }
}
