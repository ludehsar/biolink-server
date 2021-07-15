import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { MyContext } from '../../types'
import { ConnectionArgs, NewMessageInput } from '../../input-types'
import { MessageConnection, MessageResponse } from '../../object-types'
import { createNewMessage, getMessagesPaginated } from '../../services'
import { CurrentUser } from '../../decorators'
import { User } from '../../entities'

@Resolver()
export class MessageResolver {
  @Mutation(() => MessageResponse)
  async sendMessage(
    @Arg('receiverId', () => String) receiverId: string,
    @Arg('options', () => NewMessageInput) options: NewMessageInput,
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
}
