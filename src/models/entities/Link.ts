import { Field, Int, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { LinkSettings } from '../jsonTypes/LinkSettings'
import { EnabledStatus } from '../enums/EnabledStatus'
import { Project } from './Project'
import { User } from './User'
import { LinkType } from '../enums/LinkType'
import { TrackLink } from './TrackLink'

@ObjectType()
@Entity()
export class Link extends BaseEntity {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', enum: LinkType, default: LinkType.Link })
  scheme!: LinkType

  @Field(() => String, { nullable: true })
  @Column()
  url!: string

  @Field(() => Int, { nullable: true })
  @Column({ default: 0 })
  clicks!: number

  @Field(() => LinkSettings, { nullable: true })
  @Column({ type: 'json', nullable: true })
  settings!: LinkSettings

  @Field(() => Int, { nullable: true })
  @Column({ default: 0 })
  order!: number

  @Field(() => String, { nullable: true })
  @Column({ type: 'date', nullable: true })
  startDate!: Date

  @Field(() => String, { nullable: true })
  @Column({ type: 'date', nullable: true })
  endDate!: Date

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', enum: EnabledStatus, default: EnabledStatus.Disabled })
  status!: EnabledStatus

  @Field(() => String, { nullable: true })
  @CreateDateColumn()
  createdAt!: Date

  @Field(() => String, { nullable: true })
  @UpdateDateColumn()
  updatedAt!: Date

  // Relationships
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.links)
  @JoinColumn()
  user!: User

  @Field(() => Project, { nullable: true })
  @ManyToOne(() => Project, (project) => project.links)
  @JoinColumn()
  project!: Project

  @Field(() => Link, { nullable: true })
  @OneToMany(() => Link, (link) => link.biolink)
  links!: Link[]

  @Field(() => Link, { nullable: true })
  @ManyToOne(() => Link, (biolink) => biolink.links)
  @JoinColumn()
  biolink!: Link

  @Field(() => TrackLink, { nullable: true })
  @OneToMany(() => TrackLink, (trackLink) => trackLink.user)
  trackLinks!: TrackLink[]
}
