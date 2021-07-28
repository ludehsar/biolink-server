import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { FileUpload, GraphQLUpload } from 'graphql-upload'
import { MyContext } from '../../types'
import { ConnectionArgs, NewMessageInput } from '../../input-types'
import { MessageConnection, MessageResponse } from '../../object-types'
import { createNewMessage, getLastMessagesPaginated, getMessagesPaginated } from '../../services'
import { CurrentUser } from '../../decorators'
import { User } from '../../entities'

@Resolver()
export class MessageResolver {
  @Mutation(() => MessageResponse)
  async sendMessage(
    @Arg('receiverId', () => String) receiverId: string,
    @Arg('options', () => NewMessageInput) options: NewMessageInput,
    @Arg('attachment', () => GraphQLUpload, { nullable: true }) attachment: FileUpload,
    @CurrentUser() user: User,
    @Ctx() context: MyContext
  ): Promise<MessageResponse> {
    return await createNewMessage(receiverId, options, user, context)
  }

  @Query(() => MessageConnection)
  async getAllMessages(
    @Arg('otherUserId', () => String) otherUserId: string,
    @Arg('options', () => ConnectionArgs) options: ConnectionArgs,
    @CurrentUser() user: User,
    @Ctx() context: MyContext
  ): Promise<MessageConnection> {
    return await getMessagesPaginated(otherUserId, options, user, context)
  }

  @Query(() => MessageConnection)
  async getLastMessages(
    @Arg('options', () => ConnectionArgs) options: ConnectionArgs,
    @CurrentUser() user: User
  ): Promise<MessageConnection> {
    return await getLastMessagesPaginated(options, user)
  }
}
