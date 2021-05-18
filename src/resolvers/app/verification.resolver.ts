import { Arg, Ctx, Field, InputType, Mutation, Resolver } from 'type-graphql'
import { GraphQLUpload } from 'apollo-server-core'
import { IsNotEmpty } from 'class-validator'
import { GraphQLScalarType } from 'graphql'

import CurrentUser from '../../decorators/currentUser'
import { User } from '../../models/entities/User'
import { BooleanResponse, FileType } from './commonTypes'
import { createVerification } from '../../controllers/verification.controller'
import { MyContext } from '../../MyContext'

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

@Resolver()
export class VerificationResolver {
  @Mutation(() => BooleanResponse)
  async verifyBiolinkByUsername(
    @Arg('options') options: VerificationInput,
    @Arg('biolinkUsername') biolinkUsername: string,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<BooleanResponse> {
    return await createVerification(options, biolinkUsername, user, context)
  }
}
