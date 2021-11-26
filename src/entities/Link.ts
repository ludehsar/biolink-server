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

import { User, Biolink, TrackLink } from '../entities'
import { LinkType } from '../enums'
import { appConfig } from '../config'

@ObjectType()
@Entity()
export class Link extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  @Field(() => String, { nullable: true })
  id!: string

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', enum: LinkType, default: LinkType.Link })
  linkType!: LinkType

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  linkTitle?: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  linkColor?: string

  @Column({ nullable: true, default: appConfig.BACKEND_URL + '/static/defaultLinkImage.jpg' })
  @Field(() => String, {
    nullable: true,
    defaultValue: appConfig.BACKEND_URL + '/static/defaultLinkImage.jpg',
  })
  linkImageUrl?: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  platform?: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  iconColorful?: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  iconMinimal?: string

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'boolean', nullable: true, default: false })
  featured?: boolean

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  url!: string

  @Field(() => String, { nullable: true })
  @Column({ unique: true, nullable: true })
  shortenedUrl!: string

  @Field(() => Int, { nullable: true })
  @Column({ default: 0 })
  order!: number

  @Field(() => String, { nullable: true })
  @Column({ type: 'date', nullable: true })
  startDate?: Date

  @Field(() => String, { nullable: true })
  @Column({ type: 'date', nullable: true })
  endDate?: Date

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'boolean', default: false })
  enablePasswordProtection!: boolean

  @Column({ type: 'text', nullable: true })
  password!: string | null

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  note?: string

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
  @ManyToOne(() => User, (user) => user.links, { lazy: true, cascade: true })
  @JoinColumn({ name: 'userId' })
  user!: Promise<User>

  @RelationId((link: Link) => link.user)
  userId!: string

  @Field(() => Biolink, { nullable: true })
  @ManyToOne(() => Biolink, (biolink) => biolink.links, {
    nullable: true,
    lazy: true,
  })
  @JoinColumn({ name: 'biolinkId' })
  biolink?: Promise<Biolink>

  @RelationId((link: Link) => link.biolink)
  biolinkId!: string

  @OneToMany(() => TrackLink, (trackLink) => trackLink.link, { lazy: true })
  trackLinks!: Promise<TrackLink[]>
}
