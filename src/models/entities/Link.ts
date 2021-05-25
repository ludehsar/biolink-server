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
  order!: number

  @Field(() => String, { nullable: true })
  @Column({ type: 'date', nullable: true })
  startDate!: Date

  @Field(() => String, { nullable: true })
  @Column({ type: 'date', nullable: true })
  endDate!: Date

  @Field(() => Boolean, { nullable: true })
  @Column({ type: 'boolean', default: false })
  enablePasswordProtection!: boolean

  @Column({ nullable: true })
  password?: string

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
  @ManyToOne(() => User, (user) => user.links)
  @JoinColumn({ name: 'userId' })
  user!: User

  @RelationId((link: Link) => link.user)
  userId!: string

  @ManyToOne(() => Biolink, (biolink) => biolink.links, { nullable: true })
  @JoinColumn({ name: 'biolinkId' })
  biolink!: Biolink

  @RelationId((link: Link) => link.biolink)
  biolinkId!: string

  @OneToMany(() => TrackLink, (trackLink) => trackLink.link)
  trackLinks!: TrackLink[]
}
