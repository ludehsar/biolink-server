import { Field, Int, ObjectType } from 'type-graphql'

import { ChatRoom } from '../../entities'
import PagingResult from './PagingResult'

@ObjectType()
export class PaginatedChatRoomResponse extends PagingResult(ChatRoom) {
  @Field(() => Int, { nullable: true })
  totalUnreadMessage!: number
}
