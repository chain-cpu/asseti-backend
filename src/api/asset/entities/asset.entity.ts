import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AssetStateEntity } from './asset-state.entity';
import { AssetMetaType } from '../types/asset-meta.type';

@Entity({ name: 'assets' })
export class AssetEntity {
  @PrimaryGeneratedColumn('uuid', { comment: 'File ID' })
  public id: string;

  @Column({
    type: 'varchar',
    length: 64,
    unique: true,
    comment: 'Asset name',
  })
  public name: string;

  @Column({
    type: 'varchar',
    length: 512,
    default: '',
    comment: 'Asset location (path)',
  })
  public location: string;

  @Column({
    type: 'varchar',
    length: 1024,
    default: '',
    comment: 'Asset description',
  })
  public description?: string;

  @OneToMany(() => AssetStateEntity, (asset) => asset.asset)
  assigned: AssetStateEntity[];

  @Column({ type: 'jsonb', nullable: true })
  public meta: AssetMetaType;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;
}
