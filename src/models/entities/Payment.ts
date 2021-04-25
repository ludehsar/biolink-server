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

@Entity()
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ nullable: true })
  stripeId!: string

  @Column({ nullable: true })
  clientIp!: string

  @Column({ nullable: true })
  stripePaymentCreatedAt!: string

  @Column({ nullable: true })
  email!: string

  @Column({ nullable: true })
  methodType!: string

  @Column({ nullable: true })
  cardBrand!: string

  @Column({ nullable: true })
  country!: string

  @Column({ nullable: true })
  cvcCheck!: string

  @Column({ nullable: true })
  expMonth!: string

  @Column({ nullable: true })
  expYear!: string

  @Column({ nullable: true })
  funding!: string

  @Column({ nullable: true })
  cardId!: string

  @Column({ nullable: true })
  last4!: string

  @CreateDateColumn()
  createdAt!: Date

  // Relationships
  @ManyToOne(() => User, (user) => user.activities)
  @JoinColumn({ name: 'userId' })
  user!: User

  @RelationId((payment: Payment) => payment.user)
  userId!: string
}
