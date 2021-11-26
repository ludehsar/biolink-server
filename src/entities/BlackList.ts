import { Field, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm'

import { BlacklistType } from '../enums'

@ObjectType()
@Entity()
@Unique(['blacklistType', 'keyword'])
export class BlackList extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  @Field(() => String, { nullable: true })
  id!: string

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', enum: BlacklistType, default: BlacklistType.BadWord })
  blacklistType!: BlacklistType

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  keyword!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  reason!: string

  @Field(() => String, { nullable: true })
  @CreateDateColumn()
  createdAt!: Date

  @Field(() => String, { nullable: true })
  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  @Field(() => String, { nullable: true })
  deletedAt?: Date
}
