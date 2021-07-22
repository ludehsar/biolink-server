import { Field, Int, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@ObjectType()
@Entity()
export class Settings extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { nullable: true })
  id!: number

  @Field(() => String, { nullable: true })
  @Column({ unique: true })
  key!: string

  @Field(() => String, { nullable: true })
  @Column({ type: 'json', nullable: true })
  value!: any
}
