import { Field, InputType } from 'type-graphql'

@InputType()
export class FileType {
  @Field()
  filename!: string

  @Field()
  mimetype!: string

  @Field()
  encoding!: string
}
