import { Field, ObjectType } from 'type-graphql'
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

import { User, Biolink, Category } from '../entities'
import { VerificationStatus } from '../enums'

@ObjectType()
@Entity()
export class Verification extends BaseEntity {
  @Field(() => String, { nullable: true })
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', enum: VerificationStatus, default: VerificationStatus.Pending })
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

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  username!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  firstName!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  lastName!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  mobileNumber!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  workNumber!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  email!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  websiteLink!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  instagramUrl!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  twitterUrl!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  linkedinUrl!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  photoIdUrl!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  businessDocumentUrl!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  otherDocumentsUrl!: string

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
  @ManyToOne(() => User, (user) => user.verifications, { lazy: true, cascade: true })
  @JoinColumn({ name: 'userId' })
  user!: Promise<User>

  @RelationId((verification: Verification) => verification.user)
  userId!: string

  @Field(() => Biolink, { nullable: true })
  @OneToOne(() => Biolink, (biolink) => biolink.verification, { lazy: true, cascade: true })
  @JoinColumn({ name: 'biolinkId' })
  biolink!: Promise<Biolink>

  @RelationId((verification: Verification) => verification.biolink)
  biolinkId!: string

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, (category) => category.verifications, { lazy: true })
  @JoinColumn({ name: 'categoryId' })
  category!: Promise<Category>

  @RelationId((verification: Verification) => verification.category)
  categoryId!: string
}
