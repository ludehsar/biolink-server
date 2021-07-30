import { FileUpload, GraphQLUpload } from 'graphql-upload'
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql'
import { CurrentUser } from '../../decorators'
import { User } from '../../entities'
import { VerificationInput } from '../../input-types'
import { DefaultResponse } from '../../object-types'
import { createVerification } from '../../services'
import { MyContext } from '../../types'

@Resolver()
export class VerificationResolver {
  @Mutation(() => DefaultResponse)
  async verifyBiolink(
    @Arg('biolinkId', { description: 'Biolink ID' }) biolinkId: string,
    @Arg('options') options: VerificationInput,
    @Arg('photoId', () => GraphQLUpload) photoId: FileUpload,
    @Arg('businessDocument', () => GraphQLUpload) businessDocument: FileUpload,
    @Arg('otherDocuments', () => GraphQLUpload) otherDocuments: FileUpload,
    @Ctx() context: MyContext,
    @CurrentUser() user: User
  ): Promise<DefaultResponse> {
    return await createVerification(
      options,
      photoId,
      businessDocument,
      otherDocuments,
      biolinkId,
      user,
      context
    )
  }
}
