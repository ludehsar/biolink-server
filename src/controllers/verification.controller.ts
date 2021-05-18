import { createWriteStream } from 'fs'
import randToken from 'rand-token'

import { User } from '../models/entities/User'
import { Biolink } from '../models/entities/Biolink'
import { Plan } from '../models/entities/Plan'
import { Verification } from '../models/entities/Verification'
import { Category } from '../models/entities/Category'
import { BooleanResponse, FieldError } from '../typeDefs/common.typeDef'
import { MyContext } from '../MyContext'
import { captureUserActivity } from './logs.controller'
import { VerificationInput } from '../typeDefs/verification.typeDef'

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
          message: 'User not authorized',
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
          message: 'Unrecognized category',
        },
      ],
      executed: false,
    }
  }

  const { createReadStream: photoIdCreateReadStream, filename: photoIdFilename } = options.photoId

  const photoIdExt = photoIdFilename.split('.').pop()

  const errors: FieldError[] = []

  const photoIdUrl =
    __dirname +
    `../../assets/photoIds/${randToken.generate(20)}-${Date.now().toLocaleString()}.${photoIdExt}`

  photoIdCreateReadStream()
    .pipe(createWriteStream(__dirname + `../../assets/photoIds/${photoIdUrl}`))
    .on('error', () => {
      errors.push({
        message: 'Unable to upload PhotoId',
      })
    })

  const { createReadStream: businessDocumentCreateReadStream, filename: businessDocumentFilename } =
    options.businessDocument

  const businessDocumentExt = businessDocumentFilename.split('.').pop()

  const businessDocumentUrl = `${randToken.generate(
    20
  )}-${Date.now().toLocaleString()}.${businessDocumentExt}`

  businessDocumentCreateReadStream()
    .pipe(createWriteStream(__dirname + `../../assets/business-documents/${businessDocumentUrl}`))
    .on('error', () => {
      errors.push({
        message: 'Unable to upload business documents',
      })
    })

  const { createReadStream: otherDocumentsCreateReadStream, filename: otherDocumentsFilename } =
    options.otherDocuments

  const otherDocumentsExt = otherDocumentsFilename.split('.').pop()

  const otherDocumentsUrl = `${randToken.generate(
    20
  )}-${Date.now().toLocaleString()}.${otherDocumentsExt}`

  otherDocumentsCreateReadStream()
    .pipe(createWriteStream(__dirname + `../../assets/business-documents/${otherDocumentsUrl}`))
    .on('error', () => {
      errors.push({
        message: 'Unable to upload other documents',
      })
    })

  if (errors.length > 0) {
    return {
      errors,
      executed: false,
    }
  }

  await Verification.create({
    biolink,
    category,
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
    user,
  }).save()

  // Capture user log
  await captureUserActivity(user, context, 'Successfully applied for verification')

  return { executed: true }
}
