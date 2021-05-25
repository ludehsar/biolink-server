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

import { VerificationStatus } from '../enums/VerificationStatus'
import { Biolink } from './Biolink'
import { Category } from './Category'
import { User } from './User'

@ObjectType()
@Entity()
export class Verification extends BaseEntity {
  @Field(() => String, { nullable: true })
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', enum: VerificationStatus, default: VerificationStatus.Pending })
  verificationStatus!: VerificationStatus

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
  @ManyToOne(() => User, (user) => user.verifications, { eager: true })
  @JoinColumn({ name: 'userId' })
  user!: User

  @RelationId((verification: Verification) => verification.user)
  userId!: string

  @Field(() => Biolink, { nullable: true })
  @OneToOne(() => Biolink, (biolink) => biolink.verification, { eager: true })
  @JoinColumn({ name: 'biolinkId' })
  biolink!: Biolink

  @RelationId((verification: Verification) => verification.biolink)
  biolinkId!: string

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, (category) => category.verifications, { eager: true })
  @JoinColumn({ name: 'categoryId' })
  category!: Category

  @RelationId((verification: Verification) => verification.category)
  categoryId!: string
}
