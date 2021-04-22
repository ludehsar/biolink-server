import { Field, ObjectType } from 'type-graphql'
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
  Unique,
  UpdateDateColumn,
} from 'typeorm'

import { Category } from './Category'
import { Link } from './Link'
import { TrackLink } from './TrackLink'
import { User } from './User'
import { LinkSettings } from '../jsonTypes/LinkSettings'

@ObjectType()
@Entity()
@Unique(['username', 'deletedAt'])
export class Biolink extends BaseEntity {
  @Field(() => String, { nullable: true })
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Field(() => String, { nullable: true })
  @Column()
  username!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  profilePhotoUrl!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  coverPhotoUrl!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  displayName!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  location!: string

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  bio!: string

  @Field(() => LinkSettings, { nullable: true })
  @Column({ type: 'json', nullable: true })
  settings!: LinkSettings

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false })
  addedToDirectory!: boolean

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
  @ManyToOne(() => User, (user) => user.biolinks)
  @JoinColumn({ name: 'userId' })
  user!: User

  @RelationId((biolink: Biolink) => biolink.user)
  userId!: string

  @Field(() => [Link], { nullable: true })
  @OneToMany(() => Link, (link) => link.biolink)
  links!: Link[]

  @Field(() => [TrackLink], { nullable: true })
  @OneToMany(() => TrackLink, (trackLink) => trackLink.biolink)
  trackLinks!: TrackLink[]

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, (category) => category.biolinks)
  @JoinColumn({ name: 'categoryId' })
  category!: Category

  @RelationId((biolink: Biolink) => biolink.category)
  categoryId!: number
}
