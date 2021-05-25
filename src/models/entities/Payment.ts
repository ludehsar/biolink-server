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

import { User } from './User'

@ObjectType()
@Entity()
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { nullable: true })
  id!: string

  @Column({ nullable: true })
  stripeId!: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  clientIp!: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  stripePaymentCreatedAt!: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  email!: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  methodType!: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  cardBrand!: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  country!: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  cvcCheck!: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  expMonth!: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  expYear!: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  funding!: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  cardId!: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  last4!: string

  @CreateDateColumn()
  @Field(() => String, { nullable: true })
  createdAt!: Date

  // Relationships
  @ManyToOne(() => User, (user) => user.payments)
  @JoinColumn({ name: 'userId' })
  user!: User

  @RelationId((payment: Payment) => payment.user)
  userId!: string
}
