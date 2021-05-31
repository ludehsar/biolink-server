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
  @Column({ nullable: true })
  linkTitle?: string

  @Field(() => String, { nullable: true })
  @Column()
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

  @Column({ nullable: true })
  password?: string

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
  @ManyToOne(() => User, (user) => user.links, { lazy: true })
  @JoinColumn({ name: 'userId' })
  user!: Promise<User>

  @RelationId((link: Link) => link.user)
  userId!: string

  @Field(() => Biolink, { nullable: true })
  @ManyToOne(() => Biolink, (biolink) => biolink.links, { nullable: true, lazy: true })
  @JoinColumn({ name: 'biolinkId' })
  biolink?: Promise<Biolink>

  @RelationId((link: Link) => link.biolink)
  biolinkId!: string

  @OneToMany(() => TrackLink, (trackLink) => trackLink.link, { lazy: true })
  trackLinks!: Promise<TrackLink[]>
}
