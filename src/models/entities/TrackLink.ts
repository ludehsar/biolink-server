import { Field, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm'

import { User } from './User'
import { Link } from './Link'
import { Biolink } from './Biolink'

@ObjectType()
@Entity()
export class TrackLink extends BaseEntity {
  @Field(() => String, { nullable: true })
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  countryCode!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  cityName!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  osName!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  browserName!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  referrerHost!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  referrerPath!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  deviceType!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  browserLanguage!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  utmSource!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  utmMedium!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  utmCampaign!: string

  @Field(() => Boolean, { nullable: true })
  @Column({ nullable: true })
  isUnique!: boolean

  @Field(() => String, { nullable: true })
  @CreateDateColumn()
  createdAt!: Date

  // Relationships
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.trackLinks)
  @JoinColumn({ name: 'userId' })
  user!: User

  @RelationId((trackLink: TrackLink) => trackLink.user)
  userId!: string

  @Field(() => Link, { nullable: true })
  @ManyToOne(() => Link, (link) => link.trackLinks)
  @JoinColumn({ name: 'linkId' })
  link!: Link

  @RelationId((trackLink: TrackLink) => trackLink.link)
  linkId!: string

  @Field(() => Biolink, { nullable: true })
  @ManyToOne(() => Biolink, (project) => project.trackLinks)
  @JoinColumn({ name: 'biolinkId' })
  biolink!: Biolink

  @RelationId((trackLink: TrackLink) => trackLink.biolink)
  biolinkId!: string
}
