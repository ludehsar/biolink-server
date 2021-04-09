import { Field, ObjectType } from 'type-graphql'
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { User } from './User'
import { DomainScheme } from '../enums/DomainScheme'
import { EnabledStatus } from '../enums/EnabledStatus'

@ObjectType()
@Entity()
export class Domain extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', enum: DomainScheme, default: DomainScheme.HTTPS })
  scheme!: DomainScheme;

  @Field(() => String, { nullable: true })
  @Column()
  host!: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  customIndexUrl!: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', enum: EnabledStatus, default: EnabledStatus.Disabled })
  enabledStatus!: EnabledStatus;

  @Field(() => String, { nullable: true })
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String, { nullable: true })
  @UpdateDateColumn()
  updatedAt!: Date;

  // Relationships
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, user => user.domains)
  @JoinColumn()
  user!: User;
}
