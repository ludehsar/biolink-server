import { IsNotEmpty } from 'class-validator'
import { GraphQLUpload } from 'apollo-server-express'
import { GraphQLScalarType } from 'graphql'
import { InputType, Field } from 'type-graphql'

import { FileType } from './common.typeDef'

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

  @Field(() => GraphQLUpload as GraphQLScalarType, { nullable: true })
  @IsNotEmpty()
  photoId!: FileType

  @Field(() => GraphQLUpload as GraphQLScalarType, { nullable: true })
  @IsNotEmpty()
  businessDocument!: FileType

  @Field(() => GraphQLUpload as GraphQLScalarType, { nullable: true })
  @IsNotEmpty()
  otherDocuments!: FileType

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  categoryId!: string
}
