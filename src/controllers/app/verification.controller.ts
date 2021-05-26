import { createWriteStream } from 'fs'
import randToken from 'rand-token'
import path from 'path'

import { User } from '../../models/entities/User'
import { Biolink } from '../../models/entities/Biolink'
import { Plan } from '../../models/entities/Plan'
import { Verification } from '../../models/entities/Verification'
import { Category } from '../../models/entities/Category'
import { BooleanResponse, ErrorResponse } from '../../typeDefs/common.typeDef'
import { MyContext } from '../../MyContext'
import { captureUserActivity } from './logs.controller'
import { VerificationInput } from '../../typeDefs/verification.typeDef'
import { ErrorCode } from '../../constants/errorCodes'

export const createVerification = async (
  options: VerificationInput,
  biolinkUsername: string,
  user: User,
  context: MyContext
): Promise<BooleanResponse> => {
  if (!user) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
          message: 'User not authenticated',
        },
      ],
      executed: false,
    }
  }

  const biolink = await Biolink.findOne({ where: { username: biolinkUsername } })

  if (!biolink) {
    return {
      errors: [
        {
          errorCode: ErrorCode.BIOLINK_COULD_NOT_BE_FOUND,
          message: 'No biolink specified',
        },
      ],
      executed: false,
    }
  }

  if (biolink.verificationId) {
    return {
      errors: [
        {
          errorCode: ErrorCode.BIOLINK_ALREADY_VERIFIED,
          message: 'This biolink is already processed for verification',
        },
      ],
      executed: false,
    }
  }

  const userPlan = await Plan.findOne({ where: { id: user.planId } })

  if (!userPlan) {
    return {
      errors: [
        {
          errorCode: ErrorCode.PLAN_COULD_NOT_BE_FOUND,
          message: 'Unrecognized plan',
        },
      ],
      executed: false,
    }
  }

  if (!userPlan.settings.verifiedCheckmarkEnabled) {
    return {
      errors: [
        {
          errorCode: ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST,
          message: 'Current plan does not support for verification. Please upgrade',
        },
      ],
      executed: false,
    }
  }

  const category = await Category.findOne({ where: { id: options.categoryId } })

  if (!category) {
    return {
      errors: [
        {
          errorCode: ErrorCode.CATEGORY_COULD_NOT_BE_FOUND,
          message: 'Unrecognized category',
        },
      ],
      executed: false,
    }
  }

  const { createReadStream: photoIdCreateReadStream, filename: photoIdFilename } = options.photoId

  const photoIdExt = photoIdFilename.split('.').pop()

  const errors: ErrorResponse[] = []

  const photoIdUrl = `${randToken.generate(20)}-${Date.now().toString()}.${photoIdExt}`

  const photoIdDir = path.join(__dirname, `../../../assets/photoIds/${photoIdUrl}`)

  photoIdCreateReadStream()
    .pipe(createWriteStream(photoIdDir))
    .on('error', () => {
      errors.push({
        errorCode: ErrorCode.UPLOAD_ERROR,
        message: 'Unable to upload PhotoId',
      })
    })

  const { createReadStream: businessDocumentCreateReadStream, filename: businessDocumentFilename } =
    options.businessDocument

  const businessDocumentExt = businessDocumentFilename.split('.').pop()

  const businessDocumentUrl = `${randToken.generate(
    20
  )}-${Date.now().toString()}.${businessDocumentExt}`

  const businessDocumentDir = path.join(
    __dirname,
    `../../../assets/businessDocuments/${businessDocumentUrl}`
  )

  businessDocumentCreateReadStream()
    .pipe(createWriteStream(businessDocumentDir))
    .on('error', () => {
      errors.push({
        errorCode: ErrorCode.UPLOAD_ERROR,
        message: 'Unable to upload business documents',
      })
    })

  const { createReadStream: otherDocumentsCreateReadStream, filename: otherDocumentsFilename } =
    options.otherDocuments

  const otherDocumentsExt = otherDocumentsFilename.split('.').pop()

  const otherDocumentsUrl = `${randToken.generate(
    20
  )}-${Date.now().toString()}.${otherDocumentsExt}`

  const otherDocumentsDir = path.join(
    __dirname,
    `../../../assets/otherDocuments/${otherDocumentsUrl}`
  )

  otherDocumentsCreateReadStream()
    .pipe(createWriteStream(otherDocumentsDir))
    .on('error', () => {
      errors.push({
        errorCode: ErrorCode.UPLOAD_ERROR,
        message: 'Unable to upload other documents',
      })
    })

  if (errors.length > 0) {
    return {
      errors,
      executed: false,
    }
  }

  const verification = Verification.create({
    username: options.username,
    firstName: options.firstName,
    lastName: options.lastName,
    mobileNumber: options.mobileNumber,
    workNumber: options.workNumber,
    email: options.email,
    websiteLink: options.websiteLink,
    photoIdUrl,
    businessDocumentUrl,
    otherDocumentsUrl,
    instagramUrl: options.instagramAccount,
    twitterUrl: options.twitterAccount,
    linkedinUrl: options.linkedinAccount,
  })

  verification.biolink = Promise.resolve(biolink)
  verification.category = Promise.resolve(category)
  verification.user = Promise.resolve(user)

  await verification.save()

  // Capture user log
  await captureUserActivity(user, context, 'Successfully applied for verification')

  return { executed: true }
}
