import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AssetEntity } from './asset.entity';
import { User } from '../../users/user.entity';
import { AssetStateEnum } from '../enums/asset-state.enum';

@Entity({ name: 'assets_state' })
@Index(['asset', 'user'], { unique: true })
export class AssetStateEntity {
  @PrimaryGeneratedColumn('uuid', { comment: 'Asset state ID' })
  public id: string;

  @ManyToOne(() => AssetEntity, (asset) => asset.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  public asset: AssetEntity;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  public user: User;

  @Column({
    nullable: false,
    type: 'enum',
    enum: AssetStateEnum,
    default: AssetStateEnum.NOT_ACCEPTED,
  })
  public status: AssetStateEnum;

  @CreateDateColumn({ type: 'timestamp' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  public updatedAt!: Date;
}
