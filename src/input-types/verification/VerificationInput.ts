import { IsNotEmpty } from 'class-validator'
import { FileUpload, GraphQLUpload } from 'graphql-upload'
import { InputType, Field } from 'type-graphql'

@InputType()
export class VerificationInput {
  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  username!: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  firstName!: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  lastName!: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  mobileNumber!: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  workNumber!: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  email!: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  websiteLink!: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  instagramAccount!: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  twitterAccount!: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  linkedinAccount!: string

  @Field(() => GraphQLUpload, { nullable: true })
  @IsNotEmpty()
  photoId!: FileUpload

  @Field(() => GraphQLUpload, { nullable: true })
  @IsNotEmpty()
  businessDocument!: FileUpload

  @Field(() => GraphQLUpload, { nullable: true })
  @IsNotEmpty()
  otherDocuments!: FileUpload

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  categoryId!: string
}
