import { Field, Int, ObjectType } from 'type-graphql'
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

import { PageType } from '../enums/PageType'

@ObjectType()
@Entity()
export class Page extends BaseEntity {
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', enum: PageType, default: PageType.Internal })
  type!: PageType;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  externalUrl!: String;

  @Field(() => String, { nullable: true })
  @Column({ unique: true })
  title!: String;

  @Field(() => String, { nullable: true })
  @Column({ unique: true, nullable: true })
  slug!: String;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  content!: String;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  shortDescription!: String;

  @Field(() => String, { nullable: true })
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String, { nullable: true })
  @UpdateDateColumn()
  updatedAt!: Date;
}
