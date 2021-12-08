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
import { DomainScheme, EnabledStatus } from '../enums'

@ObjectType()
@Entity()
export class Domain extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  @Field(() => String, { nullable: true })
  id!: string

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', enum: DomainScheme, default: DomainScheme.HTTPS })
  scheme!: DomainScheme

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  host!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  customIndexUrl!: string

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', enum: EnabledStatus, default: EnabledStatus.Disabled })
  enabledStatus!: EnabledStatus

  @Field(() => String, { nullable: true })
  @CreateDateColumn()
  createdAt!: Date

  @Field(() => String, { nullable: true })
  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  @Field(() => String, { nullable: true })
  deletedAt?: Date

  // Relationships
  @ManyToOne(() => User, (user) => user.domains, { lazy: true, cascade: true })
  @JoinColumn({ name: 'userId' })
  user!: Promise<User> | User

  @RelationId((domain: Domain) => domain.user)
  userId!: string
}
