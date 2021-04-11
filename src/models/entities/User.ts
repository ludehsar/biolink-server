import { Field, Int, ObjectType } from 'type-graphql'
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { Billing } from '../jsonTypes/Billing'
import { Domain } from './Domain'
import { UserRole } from '../enums/UserRole'
import { Plan } from './Plan'
import { Project } from './Project'
import { Link } from './Link'
import { Category } from './Category'

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
  facebookId!: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'date', nullable: true })
  planExpirationDate!: Date;

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'boolean', default: false })
  planTrialDone!: boolean;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  paymentSubscriptionId!: String;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  country!: String;

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

  @Field(() => Link, { nullable: true })
  @OneToMany(() => Link, link => link.user)
  links!: Link[];

  @Field(() => Plan, { nullable: true })
  @ManyToOne(() => Plan, plan => plan.users)
  @JoinColumn()
  plan!: Plan;

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, category => category.users)
  @JoinColumn()
  category!: Category;
}
