import { IsEmail, IsNotEmpty, IsPhoneNumber, IsUrl } from 'class-validator'
import { FileUpload, GraphQLUpload } from 'graphql-upload'
import { InputType, Field } from 'type-graphql'

@InputType()
export class VerificationInput {
  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  username?: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  firstName?: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  lastName?: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsPhoneNumber()
  mobileNumber?: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsPhoneNumber()
  workNumber?: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsEmail()
  email?: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsUrl()
  websiteLink?: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsUrl()
  instagramAccount?: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsUrl()
  twitterAccount?: string

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsUrl()
  linkedinAccount?: string

  @Field(() => GraphQLUpload, { nullable: true })
  @IsNotEmpty()
  photoId?: FileUpload

  @Field(() => GraphQLUpload, { nullable: true })
  @IsNotEmpty()
  businessDocument?: FileUpload

  @Field(() => GraphQLUpload, { nullable: true })
  @IsNotEmpty()
  otherDocuments?: FileUpload

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  categoryId?: string
}
