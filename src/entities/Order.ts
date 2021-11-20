import { Field, Float, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm'

import { User } from '../entities'
import { Payment } from './Payment'
import { Service } from './Service'

@ObjectType()
@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { nullable: true })
  id!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  description!: string

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', default: 0.0 })
  price!: number

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'boolean', default: false })
  orderCompleted?: boolean

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
  @Field(() => Service, { nullable: true })
  @ManyToOne(() => Service, (service) => service.orders, {
    nullable: true,
    lazy: true,
    cascade: true,
  })
  @JoinColumn({ name: 'serviceId' })
  service!: Promise<Service>

  @RelationId((support: Order) => support.service)
  serviceId!: string

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (buyer) => buyer.services, { nullable: true, lazy: true, cascade: true })
  @JoinColumn({ name: 'buyerId' })
  buyer!: Promise<User>

  @RelationId((support: Order) => support.buyer)
  buyerId!: string

  @Field(() => Payment, { nullable: true })
  @OneToOne(() => Payment, (payment) => payment.order, { lazy: true })
  @JoinColumn({ name: 'paymentId' })
  payment!: Promise<Payment>

  @RelationId((support: Order) => support.payment)
  paymentId!: string
}
