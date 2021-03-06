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

import { User } from '../entities'
import { ResolveStatus } from '../enums'

@ObjectType()
@Entity()
export class Support extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  @Field(() => String, { nullable: true })
  id!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  fullName!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  email!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  phoneNumber!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  company!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  subject!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  message!: string

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', enum: ResolveStatus, default: ResolveStatus.Pending })
  status!: ResolveStatus

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  supportReply!: string

  @Field(() => String, { nullable: true })
  @CreateDateColumn()
  createdAt!: Date

  @Field(() => String, { nullable: true })
  @UpdateDateColumn()
  updatedAt!: Date

  @Field(() => String, { nullable: true })
  @DeleteDateColumn()
  deletedAt?: Date

  // Relationships
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.supports, { nullable: true, lazy: true, cascade: true })
  @JoinColumn({ name: 'userId' })
  user!: Promise<User> | User

  @RelationId((support: Support) => support.user)
  userId!: string
}
