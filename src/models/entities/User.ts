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

import { Billing } from '../jsonTypes/Billing'
import { Domain } from './Domain'
import { Plan } from './Plan'
import { Biolink } from './Biolink'
import { Link } from './Link'
import { ActiveStatus } from '../enums/ActiveStatus'
import { UserLogs } from './UserLogs'
import { PremiumUsername } from './PremiumUsername'
import { Payment } from './Payment'
import { Code } from './Code'
import { Verification } from './Verification'
import { Referral } from './Referral'
import { AdminRole } from './AdminRole'

@ObjectType()
@Entity()
@Unique(['email', 'deletedAt'])
export class User extends BaseEntity {
  @Field(() => String, { nullable: true })
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Field(() => String, { nullable: true })
  @Column()
  email!: string

  @Field(() => String, { nullable: true })
  @Column({ type: 'date', nullable: true })
  emailVerifiedAt!: Date | null

  @Column({ nullable: true })
  emailActivationCode!: string

  @Column()
  encryptedPassword!: string

  @Column({ nullable: true })
  forgotPasswordCode!: string

  @Field(() => Billing, { nullable: true })
  @Column({ type: 'json', nullable: true })
  billing!: Billing

  @Column({ nullable: true })
  tokenCode!: string

  @Column({ nullable: true })
  authenticatorSecret!: string

  @Column({ nullable: true })
  facebookId!: string

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', enum: ActiveStatus, default: ActiveStatus.Active })
  accountStatus!: ActiveStatus

  @Field(() => String, { nullable: true })
  @Column({ type: 'date', nullable: true })
  planExpirationDate!: Date

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'boolean', default: false })
  planTrialDone!: boolean

  @Column({ nullable: true })
  stripeSubscriptionId!: string

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
  @CreateDateColumn()
  createdAt!: Date

  @Field(() => String, { nullable: true })
  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  @Field(() => String, { nullable: true })
  deletedAt?: Date

  // Relationships
  @Field(() => [Biolink], { nullable: true })
  @OneToMany(() => Biolink, (biolink) => biolink.user, { lazy: true })
  biolinks!: Promise<Biolink[]>

  @Field(() => [Domain], { nullable: true })
  @OneToMany(() => Domain, (domain) => domain.user, { lazy: true })
  domains!: Promise<Domain[]>

  @Field(() => [UserLogs], { nullable: true })
  @OneToMany(() => UserLogs, (activity) => activity.user, { lazy: true })
  activities!: Promise<UserLogs[]>

  @Field(() => [Link], { nullable: true })
  @OneToMany(() => Link, (link) => link.user, { lazy: true })
  links!: Promise<Link[]>

  @Field(() => Plan, { nullable: true })
  @ManyToOne(() => Plan, (plan) => plan.users, { lazy: true })
  @JoinColumn({ name: 'planId' })
  plan!: Promise<Plan>

  @RelationId((user: User) => user.plan)
  planId!: number

  @OneToMany(() => PremiumUsername, (premiumUsername) => premiumUsername.owner, { lazy: true })
  premiumUsernames!: Promise<PremiumUsername[]>

  @Field(() => [Payment], { nullable: true })
  @OneToMany(() => Payment, (payment) => payment.user, { lazy: true })
  payments!: Promise<Payment[]>

  @Field(() => [Code], { nullable: true })
  @OneToMany(() => Code, (code) => code.referrer, { lazy: true })
  codes!: Promise<Code[]>

  @Field(() => [Referral], { nullable: true })
  @OneToMany(() => Referral, (referral) => referral.referredBy, { lazy: true })
  referrals!: Promise<Referral[]>

  @OneToMany(() => Verification, (verification) => verification.user, { lazy: true })
  verifications!: Promise<Verification[]>

  @Field(() => AdminRole, { nullable: true })
  @ManyToOne(() => AdminRole, (role) => role.users, { nullable: true, lazy: true })
  @JoinColumn({ name: 'adminRoleId' })
  adminRole!: Promise<AdminRole>

  @RelationId((user: User) => user.adminRole)
  adminRoleId!: number

  @ManyToOne(() => Code, (code) => code.referredByUsers, { nullable: true, lazy: true })
  @JoinColumn({ name: 'registeredByCodeId' })
  registeredByCode!: Promise<Code>

  @RelationId((user: User) => user.registeredByCode)
  registeredByCodeId!: string
}
