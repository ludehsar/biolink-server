import { User, Biolink, Username } from '../../entities'
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

  // Create Username
  let username = await Username.findOne({ where: { username: options.username } })

  if (!username) {
    username = await Username.create({ username: options.username }).save()
  }

  // Creates biolink
  const biolink = Biolink.create()
  biolink.username = Promise.resolve(username)

  biolink.user = Promise.resolve(user)

  await biolink.save()

  username.owner = Promise.resolve(user)
  username.biolink = Promise.resolve(biolink)
  username.expireDate = null

  await username.save()

  // Capture user log
  await captureUserActivity(user, context, `Created new biolink ${biolink.username}`, true)

  return { biolink }
}
