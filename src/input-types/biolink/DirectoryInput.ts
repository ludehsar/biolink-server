import { InputType, Field } from 'type-graphql'
import { IsBoolean, IsOptional, ValidateIf } from 'class-validator'

@InputType()
export class DirectoryInput {
  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  addedToDirectory?: boolean

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((e) => e.directoryBio !== '')
  directoryBio?: string
}
