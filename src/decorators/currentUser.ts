import { createParamDecorator } from 'type-graphql'

import { User } from '../entities'
import { MyContext } from '../types'
import { getAuthUser } from '../utilities'

export default function CurrentUser(): ParameterDecorator {
  return createParamDecorator<MyContext>(async ({ context }): Promise<User | null> => {
    return await getAuthUser(context.req, context.res)
  })
}
