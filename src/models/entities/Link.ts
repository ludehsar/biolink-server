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
  UpdateDateColumn,
} from 'typeorm'

import { EnabledStatus } from '../enums/EnabledStatus'
import { User } from './User'
import { TrackLink } from './TrackLink'
import { Biolink } from './Biolink'
import { LinkType } from '../enums/LinkType'

@ObjectType()
@Entity()
export class Link extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', enum: LinkType, default: LinkType.Link })
  linkType!: LinkType

  @Field(() => String, { nullable: true })
  @Column()
  url!: string

  @Field(() => String, { nullable: true })
  @Column({ unique: true, nullable: true })
  shortenedUrl!: string

  @Field(() => Int, { nullable: true })
  @Column({ default: 0 })
  clicks!: number

  @Field(() => Int, { nullable: true })
  @Column({ default: 0 })
  order!: number

  @Field(() => String, { nullable: true })
  @Column({ type: 'date', nullable: true })
  startDate!: Date

  @Field(() => String, { nullable: true })
  @Column({ type: 'date', nullable: true })
  endDate!: Date

  @Field(() => String, { nullable: true, deprecationReason: 'Status currently is disabled' })
  @Column({ type: 'enum', enum: EnabledStatus, default: EnabledStatus.Disabled })
  status!: EnabledStatus

  @Field(() => String, { nullable: true })
  @CreateDateColumn()
  createdAt!: Date

  @Field(() => String, { nullable: true })
  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt?: Date

  // Relationships
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.links)
  @JoinColumn({ name: 'userId' })
  user!: User

  @RelationId((link: Link) => link.user)
  userId!: string

  @Field(() => Biolink, { nullable: true })
  @ManyToOne(() => Biolink, (biolink) => biolink.links)
  @JoinColumn({ name: 'biolinkId' })
  biolink!: Biolink

  @RelationId((link: Link) => link.biolink)
  biolinkId!: string

  @Field(() => TrackLink, { nullable: true })
  @OneToMany(() => TrackLink, (trackLink) => trackLink.user)
  trackLinks!: TrackLink[]
}
