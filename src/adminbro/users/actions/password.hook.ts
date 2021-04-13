import { ActionRequest, ActionResponse } from 'admin-bro'
import * as argon2 from 'argon2'

export const before = async (request: ActionRequest): Promise<ActionRequest> => {
  if (request.payload?.password) {
    request.payload = {
      ...request.payload,
      encryptedPassword: await argon2.hash(request.payload.password),
      password: undefined,
    }
  }
  return request
}

export const after = async (response: ActionResponse): Promise<ActionResponse> => {
  if (response.record && response.record.errors) {
    response.record.errors.password = response.record.errors.encryptedPassword
  }
  return response
}
