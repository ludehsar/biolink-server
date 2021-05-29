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
import { DomainScheme, EnabledStatus } from '../enums'

@ObjectType()
@Entity()
export class Domain extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', enum: DomainScheme, default: DomainScheme.HTTPS })
  scheme!: DomainScheme

  @Field(() => String, { nullable: true })
  @Column()
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

  // Relationships
  @ManyToOne(() => User, (user) => user.domains, { lazy: true })
  @JoinColumn({ name: 'userId' })
  user!: Promise<User>

  @RelationId((domain: Domain) => domain.user)
  userId!: string
}
