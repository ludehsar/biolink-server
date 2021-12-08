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

import { Link, Biolink } from '../entities'

@ObjectType()
@Entity()
export class TrackLink extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  @Field(() => String, { nullable: true })
  id!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  ipAddress!: string

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
  referer!: string

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

  @Field(() => String, { nullable: true })
  @CreateDateColumn()
  createdAt!: Date

  // Relationships
  @Field(() => Link, { nullable: true })
  @ManyToOne(() => Link, (link) => link.trackLinks, { nullable: true, lazy: true, cascade: true })
  @JoinColumn({ name: 'linkId' })
  link!: Promise<Link> | Link

  @RelationId((trackLink: TrackLink) => trackLink.link)
  linkId!: string

  @Field(() => Biolink, { nullable: true })
  @ManyToOne(() => Biolink, (biolink) => biolink.trackLinks, {
    nullable: true,
    lazy: true,
    cascade: true,
  })
  @JoinColumn({ name: 'biolinkId' })
  biolink!: Promise<Biolink> | Biolink

  @RelationId((trackLink: TrackLink) => trackLink.biolink)
  biolinkId!: string
}
