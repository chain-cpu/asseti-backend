import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'configuration_features' })
@Unique('uni_feature', ['name'])
export class FeatureEntity {
  @PrimaryGeneratedColumn('uuid', { comment: 'Feature property ID' })
  public id: string;

  @Column({
    type: 'varchar',
    length: 64,
    comment: 'Feature name',
  })
  public name: string;

  @Column({
    type: 'varchar',
    length: 512,
    default: '',
    comment: 'Feature description',
  })
  public description?: string;

  @Column({ type: 'boolean', default: false })
  public isActive = false;
}
