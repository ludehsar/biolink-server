import { Field, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm'

import { CodeType } from '../enums/CodeType'
import { User } from './User'

@ObjectType()
@Entity()
export class Code extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', enum: CodeType, default: CodeType.Discount })
  type!: CodeType

  @Field(() => String, { nullable: true })
  @Column({ unique: true })
  code!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, default: 0 })
  discount!: number

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, default: 0 })
  quantity!: number

  @Field(() => String, { nullable: true })
  @Column({ type: 'date', nullable: true })
  expireDate!: Date

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt?: Date

  // Relationships
  @ManyToOne(() => User, (user) => user.codes, { nullable: true })
  @JoinColumn({ name: 'referrerId' })
  referrer!: User

  @RelationId((code: Code) => code.referrer)
  referrerId!: string
}
