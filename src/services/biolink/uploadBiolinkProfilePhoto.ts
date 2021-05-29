import { User, Biolink } from 'entities'
import { createWriteStream } from 'fs'
import { FileUpload } from 'graphql-upload'
import { BiolinkResponse, ErrorResponse } from 'object-types'
import path from 'path'
import randToken from 'rand-token'
import { captureUserActivity } from 'services'
import { MyContext, ErrorCode } from 'types'

export const uploadBiolinkProfilePhoto = async (
  id: string,
  profilePhoto: FileUpload,
  context: MyContext,
  user: User
): Promise<BiolinkResponse> => {
  const biolink = await Biolink.findOne(id)

  if (!biolink) {
    return {
      errors: [
        {
          errorCode: ErrorCode.BIOLINK_COULD_NOT_BE_FOUND,
          message: 'Biolink not found',
        },
      ],
    }
  }

  if (!user || biolink.userId !== user.id) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHORIZED,
          message: 'User not authorized',
        },
      ],
    }
  }

  const { createReadStream, filename } = profilePhoto

  const profilePhotoExt = filename.split('.').pop()

  const errors: ErrorResponse[] = []

  const profilePhotoName = `${randToken.generate(20)}-${Date.now().toString()}.${profilePhotoExt}`

  const directory = path.join(__dirname, `../../../assets/profilePhotos/${profilePhotoName}`)

  createReadStream()
    .pipe(createWriteStream(directory))
    .on('error', () => {
      errors.push({
        errorCode: ErrorCode.UPLOAD_ERROR,
        message: 'Unable to upload profile photo',
      })
    })

  if (errors.length > 0) {
    return {
      errors,
    }
  }

  biolink.profilePhotoUrl = window.location.origin + '/static/profilePhotos/' + profilePhotoName
  await biolink.save()

  await captureUserActivity(user, context, `Uploaded ${biolink.username} profile photo`)

  return { biolink }
}
