import { Field, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm'

import { Category } from './Category'
import { Link } from './Link'
import { TrackLink } from './TrackLink'
import { User } from './User'

@ObjectType()
@Entity()
export class Biolink extends BaseEntity {
  @Field(() => String, { nullable: true })
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Field(() => String, { nullable: true })
  @Column({ unique: true })
  username!: string

  @Field(() => String, { nullable: true })
  @CreateDateColumn()
  createdAt!: Date

  @Field(() => String, { nullable: true })
  @UpdateDateColumn()
  updatedAt!: Date

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
