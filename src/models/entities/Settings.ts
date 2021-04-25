import { Field } from 'type-graphql'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Settings extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Field(() => String, { nullable: true })
  @Column({ unique: true })
  key!: string

  @Field(() => String, { nullable: true })
  @Column({ type: 'json', nullable: true })
  value!: string
}
