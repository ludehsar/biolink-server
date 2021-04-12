import { Field, Int, ObjectType } from 'type-graphql'
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { Billing } from '../jsonTypes/Billing'
import { Domain } from './Domain'
import { UserRole } from '../enums/UserRole'
import { Plan } from './Plan'
import { Project } from './Project'
import { Link } from './Link'
import { Category } from './Category'
import { ActiveStatus } from '../enums/ActiveStatus'
import { TrackLink } from './TrackLink'
import { UserLogs } from './UserLogs'

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => String, { nullable: true })
  @Column({ unique: true })
  email!: string;

  @Field(() => String, { nullable: true })
  @Column({ unique: true })
  username!: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'date', nullable: true })
  emailVerifiedAt!: Date;

  @Column({ nullable: true, unique: true })
  emailActivationCode!: string;

  @Field(() => String, { nullable: true })
  @Column()
  encryptedPassword!: string;

  @Column({ nullable: true, unique: true })
  forgotPasswordCode!: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  name!: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
  userRole!: UserRole;

  @Field(() => Billing, { nullable: true })
  @Column({ type: 'json', nullable: true })
  billing!: Billing;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  tokenCode!: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  authenticatorSecret!: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  facebookId!: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', enum: ActiveStatus, default: ActiveStatus.Inactive })
  activeStatus!: UserRole;

  @Field(() => String, { nullable: true })
  @Column({ type: 'date', nullable: true })
  planExpirationDate!: Date;

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'boolean', default: false })
  planTrialDone!: boolean;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  paymentSubscriptionId!: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  language!: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  timezone!: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  lastIPAddress!: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  lastUserAgent!: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  country!: string;

  @Field(() => Int, { nullable: true })
  @Column({ default: 0 })
  totalLogin!: number;

  @Field(() => String, { nullable: true })
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String, { nullable: true })
  @UpdateDateColumn()
  updatedAt!: Date;

  // Relationships
  @Field(() => Project, { nullable: true })
  @OneToMany(() => Project, project => project.user)
  projects!: Project[];

  @Field(() => Domain, { nullable: true })
  @OneToMany(() => Domain, domain => domain.user)
  domains!: Domain[];

  @Field(() => UserLogs, { nullable: true })
  @OneToMany(() => UserLogs, log => log.user)
  logs!: UserLogs[];

  @Field(() => Link, { nullable: true })
  @OneToMany(() => Link, link => link.user)
  links!: Link[];

  @Field(() => TrackLink, { nullable: true })
  @OneToMany(() => TrackLink, trackLink => trackLink.user)
  trackLinks!: TrackLink[];

  @Field(() => Plan, { nullable: true })
  @ManyToOne(() => Plan, plan => plan.users)
  @JoinColumn()
  plan!: Plan;

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, category => category.users)
  @JoinColumn()
  category!: Category;
}
