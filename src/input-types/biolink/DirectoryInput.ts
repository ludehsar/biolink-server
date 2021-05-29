import { InputType, Field } from 'type-graphql'
import { IsBoolean } from 'class-validator'

@InputType()
export class DirectoryInput {
  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  addedToDirectory?: boolean

  @Field({ nullable: true })
  directoryBio?: string
}
