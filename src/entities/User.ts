import { Field, Int, ObjectType } from 'type-graphql'
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
  Unique,
  UpdateDateColumn,
} from 'typeorm'

import {
  Biolink,
  Domain,
  Code,
  Follow,
  UserLogs,
  Link,
  Plan,
  Username,
  Payment,
  Referral,
  Verification,
  AdminRole,
  Report,
  Support,
  Service,
  Message,
  Order,
} from '../entities'
import { Billing } from '../json-types'
import { PlanType } from '../enums'
import { ChatRoomToUser } from './ChatRoomToUser'

@ObjectType()
@Entity()
@Unique(['email', 'deletedAt'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  @Field(() => String, { nullable: true })
  id!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  email!: string

  @Field(() => String, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  emailVerifiedAt!: Date | null

  @Column({ nullable: true })
  encryptedPassword!: string

  @Field(() => Billing, { nullable: true })
  @Column({ type: 'json', nullable: true })
  billing!: Billing

  @Column({ nullable: true })
  authenticatorSecret!: string

  @Column({ nullable: true })
  facebookId!: string

  @Field(() => String, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  lastActiveTill!: Date

  @Field(() => String, { nullable: true })
  @Column({ type: 'date', nullable: true })
  planExpirationDate!: Date | null

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'boolean', default: false })
  planTrialDone!: boolean

  @Field(() => String, { nullable: true })
  @Column({
    type: 'enum',
    enum: PlanType,
    default: PlanType.Free,
    nullable: true,
  })
  planType!: PlanType

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'boolean', default: false })
  usedReferralsToPurchasePlan!: boolean

  @Column({ nullable: true })
  stripeCustomerId!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  language!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  timezone!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  lastIPAddress!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  lastUserAgent!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  country!: string

  @Field(() => Int, { nullable: true })
  @Column({ default: 0 })
  totalLogin!: number

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  currentBiolinkId!: string

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
  @OneToMany(() => Biolink, (biolink) => biolink.user, { lazy: true })
  biolinks!: Promise<Biolink[]> | Biolink[]

  @OneToMany(() => Domain, (domain) => domain.user, {
    lazy: true,
  })
  domains!: Promise<Domain[]> | Domain[]

  @OneToMany(() => UserLogs, (activity) => activity.user, { lazy: true })
  activities!: Promise<UserLogs[]> | UserLogs[]

  @OneToMany(() => Link, (link) => link.user, { lazy: true })
  links!: Promise<Link[]> | Link[]

  @Field(() => Plan, { nullable: true })
  @ManyToOne(() => Plan, (plan) => plan.users, { lazy: true })
  @JoinColumn({ name: 'planId' })
  plan!: Plan | Promise<Plan>

  @RelationId((user: User) => user.plan)
  planId!: string

  @OneToMany(() => Username, (username) => username.owner, { lazy: true })
  usernames!: Promise<Username[]> | Username[]

  @OneToMany(() => Payment, (payment) => payment.user, { lazy: true })
  payments!: Promise<Payment[]> | Payment[]

  @OneToMany(() => Code, (code) => code.referrer, { lazy: true })
  codes!: Promise<Code[]> | Code[]

  @OneToMany(() => Referral, (referral) => referral.referredBy, { lazy: true })
  referrals!: Promise<Referral[]> | Referral[]

  @OneToMany(() => Report, (report) => report.reporter, { lazy: true })
  reports!: Promise<Report[]> | Report[]

  @OneToMany(() => Support, (support) => support.user, { lazy: true })
  supports!: Promise<Support[]> | Support[]

  @OneToMany(() => Verification, (verification) => verification.user, { lazy: true })
  verifications!: Promise<Verification[]> | Verification[]

  @Field(() => AdminRole, { nullable: true })
  @ManyToOne(() => AdminRole, (role) => role.users, { nullable: true, lazy: true })
  @JoinColumn({ name: 'adminRoleId' })
  adminRole!: Promise<AdminRole> | AdminRole | null

  @RelationId((user: User) => user.adminRole)
  adminRoleId!: string

  @ManyToOne(() => Code, (code) => code.referredByUsers, {
    nullable: true,
    lazy: true,
  })
  @JoinColumn({ name: 'registeredByCodeId' })
  registeredByCode!: Promise<Code> | Code | null

  @RelationId((user: User) => user.registeredByCode)
  registeredByCodeId!: string

  @OneToMany(() => Follow, (follow) => follow.follower, { lazy: true })
  followers!: Promise<Follow[]> | Follow[]

  @OneToMany(() => Message, (message) => message.sender, { lazy: true })
  sentMessages!: Promise<Message[]> | Message[]

  @OneToMany(() => ChatRoomToUser, (room) => room.user, { lazy: true })
  chatRoomToUserRelations!: Promise<ChatRoomToUser[]> | ChatRoomToUser[]

  @OneToMany(() => Service, (service) => service.seller, { lazy: true })
  services!: Promise<Service[]> | Service[]

  @OneToMany(() => Order, (order) => order.buyer, { lazy: true })
  orders!: Promise<Order[]> | Order[]
}
