import { Field, Int, ObjectType } from 'type-graphql'
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@ObjectType()
@Entity()
export class BlackList extends BaseEntity {
  @Field(() => Int, { nullable: true })
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, unique: true })
  email!: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, unique: true })
  username!: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, unique: true })
  badWords!: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  reason!: string;

  @Field(() => String, { nullable: true })
  @CreateDateColumn()
  createdAt!: Date;

  @Field(() => String, { nullable: true })
  @UpdateDateColumn()
  updatedAt!: Date;
}
