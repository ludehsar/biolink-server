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
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
  Unique,
  UpdateDateColumn,
} from 'typeorm'

import { BiolinkSettings } from '../json-types'
import { User, Link, TrackLink, Category, Verification, Follow } from '../entities'
import { VerificationStatus } from '../enums'
import { appConfig } from '../config'
import { Username } from './Username'

@ObjectType()
@Entity()
@Unique(['username', 'deletedAt'])
export class Biolink extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { nullable: true })
  id!: string

  @Column({ nullable: true, default: appConfig.BACKEND_URL + '/static/defaultProfilePhoto.png' })
  @Field(() => String, {
    nullable: true,
    defaultValue: appConfig.BACKEND_URL + '/static/defaultProfilePhoto.png',
  })
  profilePhotoUrl!: string

  @Column({ nullable: true, default: appConfig.BACKEND_URL + '/static/defaultCoverPhoto.jpg' })
  @Field(() => String, {
    nullable: true,
    defaultValue: appConfig.BACKEND_URL + '/static/defaultCoverPhoto.jpg',
  })
  coverPhotoUrl!: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  displayName!: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  city!: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  state!: string

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  country!: string

  @Column({ type: 'float', nullable: true })
  @Field(() => Float, { nullable: true })
  latitude!: number

  @Column({ type: 'float', nullable: true })
  @Field(() => Float, { nullable: true })
  longitude!: number

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  bio!: string

  @Column({ type: 'json', nullable: true })
  @Field(() => BiolinkSettings, { nullable: true })
  settings!: BiolinkSettings

  @Field(() => String, { nullable: true })
  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.NotApplied,
    nullable: true,
  })
  verificationStatus!: VerificationStatus

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @Column({ type: 'boolean', nullable: true, default: false })
  verifiedGovernmentId!: boolean

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @Column({ type: 'boolean', nullable: true, default: false })
  verifiedEmail!: boolean

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @Column({ type: 'boolean', nullable: true, default: false })
  verifiedPhoneNumber!: boolean

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @Column({ type: 'boolean', nullable: true, default: false })
  verifiedWorkEmail!: boolean

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @Column({ type: 'boolean', nullable: true, default: false })
  featured!: boolean

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @Column({ type: 'boolean', nullable: true, default: false })
  changedUsername!: boolean

  @CreateDateColumn()
  @Field(() => String, { nullable: true })
  createdAt!: Date

  @UpdateDateColumn()
  @Field(() => String, { nullable: true })
  updatedAt!: Date

  @DeleteDateColumn()
  @Field(() => String, { nullable: true })
  deletedAt?: Date

  // Relationships
  @Field(() => Username, { nullable: true })
  @OneToOne(() => Username, (username) => username.biolink, {
    nullable: true,
    lazy: true,
  })
  @JoinColumn({ name: 'usernameId' })
  username?: Promise<Username> | Username | null

  @RelationId((biolink: Biolink) => biolink.username)
  usernameId!: string

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.biolinks, { lazy: true, cascade: true })
  @JoinColumn({ name: 'userId' })
  user!: Promise<User>

  @RelationId((biolink: Biolink) => biolink.user)
  userId!: string

  @Field(() => [Link], { nullable: true })
  @OneToMany(() => Link, (link) => link.biolink, { lazy: true })
  links!: Promise<Link[]>

  @OneToMany(() => TrackLink, (trackLink) => trackLink.biolink, { lazy: true })
  trackLinks!: Promise<TrackLink[]>

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, (category) => category.biolinks, {
    nullable: true,
    lazy: true,
  })
  @JoinColumn({ name: 'categoryId' })
  category?: Promise<Category>

  @RelationId((biolink: Biolink) => biolink.category)
  categoryId!: number

  @OneToOne(() => Verification, (verification) => verification.biolink, {
    nullable: true,
    lazy: true,
  })
  @JoinColumn({ name: 'verificationId' })
  verification!: Promise<Verification>

  @RelationId((biolink: Biolink) => biolink.verification)
  verificationId!: string

  @OneToMany(() => Follow, (follow) => follow.followee, { lazy: true })
  followees!: Promise<Follow[]>
}
