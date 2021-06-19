import { Field, ObjectType } from 'type-graphql'
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

import { User } from '../entities'
import { ResolveStatus } from '../enums'

@ObjectType()
@Entity()
export class Support extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
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

  // Relationships
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.supports, { nullable: true, lazy: true })
  @JoinColumn({ name: 'userId' })
  user!: Promise<User> | User

  @RelationId((support: Support) => support.user)
  userId!: string
}
