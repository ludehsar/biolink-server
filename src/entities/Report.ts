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
} from 'typeorm'

import { User } from '../entities'
import { ResolveStatus } from '../enums'

@ObjectType()
@Entity()
export class Report extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  firstName!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  lastName!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  email!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  reportedUrl!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  description!: string

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', enum: ResolveStatus, default: ResolveStatus.Pending })
  status!: ResolveStatus

  @Field(() => String, { nullable: true })
  @CreateDateColumn()
  createdAt!: Date

  // Relationships
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.reports, { nullable: true, lazy: true })
  @JoinColumn({ name: 'reporterId' })
  reporter!: Promise<User> | User

  @RelationId((report: Report) => report.reporter)
  reporterId!: string
}
