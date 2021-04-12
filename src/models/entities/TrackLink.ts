import { Field, ObjectType } from 'type-graphql'
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { User } from './User'
import { Link } from './Link'
import { Project } from './Project'

@ObjectType()
@Entity()
export class TrackLink extends BaseEntity {
  @Field(() => String, { nullable: true })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  countryCode!: String;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  cityName!: String;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  osName!: String;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  browserName!: String;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  referrerHost!: String;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  referrerPath!: String;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  deviceType!: String;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  browserLanguage!: String;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  utmSource!: String;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  utmMedium!: String;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  utmCampaign!: String;

  @Field(() => Boolean, { nullable: true })
  @Column({ nullable: true })
  isUnique!: boolean;

  @Field(() => String, { nullable: true })
  @CreateDateColumn()
  createdAt!: Date;

  // Relationships
  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, user => user.trackLinks)
  @JoinColumn()
  user!: User;

  @Field(() => Link, { nullable: true })
  @ManyToOne(() => Link, link => link.trackLinks)
  @JoinColumn()
  link!: Link;

  @Field(() => Project, { nullable: true })
  @ManyToOne(() => Project, project => project.trackLinks)
  @JoinColumn()
  project!: Project;
}
