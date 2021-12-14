import { Service } from 'typedi'
import { Repository } from 'typeorm'
import { buildPaginator } from 'typeorm-cursor-pagination'
import { InjectRepository } from 'typeorm-typedi-extensions'
import { ApolloError } from 'apollo-server-errors'

import { ChatRoom, ChatRoomToUser, User } from '../entities'
import { ErrorCode } from '../types'
import { ChatRoomUpdateBody } from '../interfaces/ChatRoomUpdateBody'
import { ConnectionArgs } from '../input-types'
import { PaginatedUserResponse } from '../object-types/common/PaginatedUserResponse'
import { UserService } from './user.service'
import { PaginatedChatRoomResponse } from '../object-types/common/PaginatedChatRoomResponse'

@Service()
export class ChatRoomService {
  constructor(
    @InjectRepository(ChatRoom) private readonly chatRoomRepository: Repository<ChatRoom>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(ChatRoomToUser)
    private readonly chatRoomAndUserRelationRepository: Repository<ChatRoomToUser>,
    private readonly userService: UserService
  ) {}

  /**
   * Get chat room by id
   * @param {string} roomId
   * @returns {Promise<ChatRoom>}
   */
  async getChatRoomById(roomId: string): Promise<ChatRoom> {
    const chatRoom = await this.chatRoomRepository.findOne(roomId)

    if (!chatRoom) {
      throw new ApolloError(
        'Currently free chatRoom is not available',
        ErrorCode.PLAN_COULD_NOT_BE_FOUND
      )
    }

    return chatRoom
  }

  /**
   * Get chat room by user ids
   * @param {string[]} userIds
   * @returns {Promise<ChatRoom>}
   */
  async findOrCreateChatRoomByUserIds(userIds: string[]): Promise<ChatRoom> {
    const chatRooms = await this.chatRoomAndUserRelationRepository.query(
      `
        SELECT "chat_room".*
        FROM "chat_room_to_user" "relation"
        LEFT JOIN "chat_room" ON "relation"."chatRoomId" = "chat_room"."id"
        WHERE "relation"."userId" IN (${userIds.map((uid) => "'" + uid + "'")})
        GROUP BY "relation"."chatRoomId", "chat_room"."id"
        HAVING COUNT(DISTINCT "relation"."userId") = $1
      `,
      [userIds.length]
    )

    if (!chatRooms || (chatRooms as ChatRoom[]).length <= 0) {
      const chatRoom = await this.createChatRoom({}, userIds)

      return chatRoom
    }

    return chatRooms[0]
  }

  /**
   * Get chat room users
   * @param {string} roomId
   * @param {ConnectionArgs} options
   * @returns {Promise<PaginatedUserLogResponse>}
   */
  async getChatRoomUsers(roomId: string, options: ConnectionArgs): Promise<PaginatedUserResponse> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.chatRoomToUserRelations', 'chatRoomToUser')
      .where(`chatRoomToUser.chatRoomId = :chatRoomId`, {
        chatRoomId: roomId,
      })

    const paginator = buildPaginator({
      entity: User,
      alias: 'user',
      paginationKeys: ['id'],
      query: {
        afterCursor: options.afterCursor,
        beforeCursor: options.beforeCursor,
        limit: options.limit,
        order: options.order,
      },
    })

    return await paginator.paginate(queryBuilder)
  }

  /**
   * Get all chat rooms by user id
   * @param {string} userId
   * @param {ConnectionArgs} options
   * @returns {Promise<PaginatedChatRoomResponse>}
   */
  async getChatRoomsByUserId(
    userId: string,
    options: ConnectionArgs
  ): Promise<PaginatedChatRoomResponse> {
    const queryBuilder = this.chatRoomRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.chatRoomToUserRelations', 'chatRoomToUser')
      .where(`chatRoomToUser.userId = :userId`, {
        userId,
      })
      .andWhere('"room"."lastMessageSentId" IS NOT NULL')

    const paginator = buildPaginator({
      entity: ChatRoom,
      alias: 'room',
      paginationKeys: ['lastMessageSentDate'],
      query: {
        afterCursor: options.afterCursor,
        beforeCursor: options.beforeCursor,
        limit: options.limit,
        order: options.order,
      },
    })

    const { cursor, data } = await paginator.paginate(queryBuilder)

    const { totalUnreadMessage } = await this.chatRoomAndUserRelationRepository
      .createQueryBuilder('relation')
      .select('SUM(relation.totalUnreadMessages)', 'totalUnreadMessage')
      .where('relation.userId = :userId', { userId })
      .getRawOne()

    return {
      cursor,
      data,
      totalUnreadMessage,
    }
  }

  /**
   * Check if an user is a member of the room
   * @param {string} roomId
   * @param {string} userId
   * @returns {Promise<boolean>}
   */
  async isMemberOfRoom(roomId: string, userId: string): Promise<boolean> {
    return !!(await this.chatRoomAndUserRelationRepository
      .createQueryBuilder('relation')
      .where('relation.chatRoomId = :roomId', { roomId })
      .andWhere('relation.userId = :userId', { userId })
      .getOne())
  }

  /**
   * Create a chatRoom
   * @param {ChatRoomUpdateBody} updateBody
   * @param {string[]} userIds
   * @returns {Promise<ChatRoom>}
   */
  async createChatRoom(updateBody: ChatRoomUpdateBody, userIds: string[]): Promise<ChatRoom> {
    let chatRoom = await this.chatRoomRepository.create().save()

    chatRoom = await this.updateChatRoomById(chatRoom.id, updateBody)

    await this.addOrRemoveUsersFromChatRoomByRoomId(chatRoom.id, userIds)

    return chatRoom
  }

  /**
   * Update chat room by room id
   * @param {string} roomId
   * @param {ChatRoomUpdateBody} updateBody
   * @returns {Promise<ChatRoom>}
   */
  async updateChatRoomById(roomId: string, updateBody: ChatRoomUpdateBody): Promise<ChatRoom> {
    const chatRoom = await this.getChatRoomById(roomId)

    if (updateBody.lastMessageSentDate !== undefined)
      chatRoom.lastMessageSentDate = updateBody.lastMessageSentDate
    if (updateBody.lastMessageSentId !== undefined)
      chatRoom.lastMessageSentId = updateBody.lastMessageSentId
    if (updateBody.roomName !== undefined) chatRoom.roomName = updateBody.roomName

    return chatRoom
  }

  /**
   * Add or remove users from chat room by room id
   * @param {string} roomId
   * @param {string[]} userIds
   * @returns {Promise<ChatRoom>}
   */
  async addOrRemoveUsersFromChatRoomByRoomId(roomId: string, userIds: string[]): Promise<ChatRoom> {
    if (userIds.length > 250) {
      throw new ApolloError('Cannot add more than 250 users in a room', ErrorCode.DATABASE_ERROR)
    }

    const room = await this.getChatRoomById(roomId)

    userIds.forEach(async (userId) => {
      const user = await this.userService.getUserById(userId)
      let relation = await this.chatRoomAndUserRelationRepository.findOne({
        where: {
          chatRoom: room,
          user,
        },
      })

      if (!relation) {
        relation = this.chatRoomAndUserRelationRepository.create()
        relation.chatRoom = Promise.resolve(room)
        relation.user = Promise.resolve(user)
        await relation.save()
      }
    })

    await this.chatRoomAndUserRelationRepository
      .createQueryBuilder('relation')
      .delete()
      .where('"relation"."userId" not in (:...userIds)', { userIds })
      .execute()

    return room
  }
}
