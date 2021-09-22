import { createWriteStream } from 'fs'
import { FileUpload } from 'graphql-upload'
import path from 'path'
import randToken from 'rand-token'

import { appConfig } from '../../config'
import { User, Biolink } from '../../entities'
import { BiolinkResponse, ErrorResponse } from '../../object-types'
import { captureUserActivity } from '../../services'
import { MyContext, ErrorCode } from '../../types'

export const uploadBiolinkCoverPhoto = async (
  id: string,
  coverPhoto: FileUpload,
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

  const { createReadStream, filename } = coverPhoto

  const coverPhotoExt = filename.split('.').pop()

  const errors: ErrorResponse[] = []

  const coverPhotoName = `${randToken.generate(20)}-${Date.now().toString()}.${coverPhotoExt}`

  const directory = path.join(__dirname, `../../../assets/coverPhotos/${coverPhotoName}`)

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

  biolink.coverPhotoUrl = appConfig.BACKEND_URL + '/static/coverPhotos/' + coverPhotoName
  await biolink.save()

  await captureUserActivity(user, context, `Uploaded ${biolink.username} cover photo`, true)

  return { biolink }
}
