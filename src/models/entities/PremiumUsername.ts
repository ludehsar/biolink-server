import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm'

import { PremiumUsernameType } from '../enums/PremiumUsernameType'
import { User } from './User'

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

  // Relationships
  @ManyToOne(() => User, (user) => user.premiumUsernames, { nullable: true })
  @JoinColumn({ name: 'ownerId' })
  owner!: User

  @RelationId((premiumUsername: PremiumUsername) => premiumUsername.owner)
  ownerId!: string
}
