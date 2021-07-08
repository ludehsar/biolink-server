import { Field, Float, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm'

import { User } from '../entities'
import { CodeType } from '../enums'

@ObjectType()
@Entity()
export class Code extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { nullable: true })
  id!: string

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', enum: CodeType, default: CodeType.Discount })
  type!: CodeType

  @Field(() => String, { nullable: true })
  @Column({ unique: true })
  code!: string

  @Field(() => Float, { nullable: true })
  @Column({ nullable: true, default: 0 })
  discount!: number

  @Field(() => Float, { nullable: true })
  @Column({ nullable: true, default: 0 })
  quantity!: number

  @Field(() => String, { nullable: true })
  @Column({ type: 'date', nullable: true })
  expireDate!: Date | null

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
  @ManyToOne(() => User, (user) => user.codes, { nullable: true, lazy: true })
  @JoinColumn({ name: 'referrerId' })
  referrer!: Promise<User>

  @RelationId((code: Code) => code.referrer)
  referrerId!: string

  @OneToMany(() => User, (user) => user.registeredByCode, { lazy: true })
  referredByUsers!: Promise<User[]>
}
