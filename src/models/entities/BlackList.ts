import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm'

import { BlacklistType } from '../enums/BlacklistType'

@Entity()
@Unique(['blacklistType', 'keyword'])
export class BlackList extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'enum', enum: BlacklistType, default: BlacklistType.BadWord })
  blacklistType!: BlacklistType

  @Column()
  keyword!: string

  @Column({ nullable: true })
  reason!: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
