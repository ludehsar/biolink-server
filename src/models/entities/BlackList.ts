import { Field, Int, ObjectType } from 'type-graphql'
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

@ObjectType()
@Entity()
@Unique(['blacklistType', 'keyword'])
export class BlackList extends BaseEntity {
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  id!: number

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', enum: BlacklistType, default: BlacklistType.BadWord })
  blacklistType!: BlacklistType

  @Field(() => String, { nullable: true })
  @Column()
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
}
