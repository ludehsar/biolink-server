import { Message } from '../entities'

export interface MessagePayload {
  message: Message
  userIds: string[]
}
