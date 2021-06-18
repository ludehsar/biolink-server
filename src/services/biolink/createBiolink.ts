import { User, Biolink } from '../../entities'
import { NewBiolinkInput } from '../../input-types'
import { BiolinkResponse } from '../../object-types'
import { captureUserActivity } from '../../services'
import { ErrorCode, MyContext } from '../../types'
import { createBiolinkValidated } from '../../validations'

export const createBiolink = async (
  options: NewBiolinkInput,
  context: MyContext,
  user: User
): Promise<BiolinkResponse> => {
  const errors = await createBiolinkValidated(options, user)

  if (errors.length > 0) {
    return {
      errors,
    }
  }

  if (options.username?.startsWith('0')) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USERNAME_ALREADY_EXISTS,
          message: 'Username already taken',
        },
      ],
    }
  }

  // Creates biolink
  const biolink = Biolink.create({
    username: options.username,
  })

  biolink.user = Promise.resolve(user)

  await biolink.save()

  // Capture user log
  await captureUserActivity(user, context, `Created new biolink ${biolink.username}`)

  return { biolink }
}
