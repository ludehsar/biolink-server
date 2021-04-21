import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { PremiumUsernameType } from '../enums/PremiumUsernameType'

@Entity()
export class PremiumUsername extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ unique: true })
  username!: string

  @Column()
  price!: number

  @Column({ type: 'enum', enum: PremiumUsernameType, default: PremiumUsernameType.Premium })
  usernameType!: PremiumUsernameType

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
