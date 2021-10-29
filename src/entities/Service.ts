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

import { Order, User } from '../entities'

@ObjectType()
@Entity()
export class Service extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { nullable: true })
  id!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  title!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  description!: string

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'boolean', default: false })
  blacklisted?: boolean

  @Field(() => Float, { nullable: true })
  @Column({ type: 'float', default: 0.0 })
  price!: number

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
  @ManyToOne(() => User, (seller) => seller.services, { nullable: true, lazy: true, cascade: true })
  @JoinColumn({ name: 'sellerId' })
  seller!: Promise<User>

  @RelationId((support: Service) => support.seller)
  sellerId!: string

  @OneToMany(() => Order, (order) => order.service, { lazy: true })
  orders!: Promise<Order[]>
}
