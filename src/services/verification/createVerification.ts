import { createWriteStream } from 'fs'
import randToken from 'rand-token'
import path from 'path'
import { validate } from 'class-validator'
import { User, Plan, Category, Verification, Biolink } from '../../entities'
import { VerificationInput } from '../../input-types'
import { DefaultResponse, ErrorResponse } from '../../object-types'
import { captureUserActivity } from '../../services'
import { MyContext, ErrorCode } from '../../types'
import { BACKEND_URL } from '../../config'
import { VerificationStatus } from '../../enums'
import { isMalicious } from '../../utilities'
import { FileUpload } from 'graphql-upload'

export const createVerification = async (
  options: VerificationInput,
  photoId: FileUpload,
  businessDocument: FileUpload,
  otherDocuments: FileUpload,
  biolinkId: string,
  user: User,
  context: MyContext
): Promise<DefaultResponse> => {
  const validationErrors = await validate(options)
  if (validationErrors.length > 0) {
    return {
      errors: validationErrors.map((err) => ({
        field: err.property,
        errorCode: ErrorCode.REQUEST_VALIDATION_ERROR,
        message: 'Not correctly formatted',
      })),
    }
  }

  if (!user) {
    return {
      errors: [
        {
          errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
          message: 'User not authenticated',
        },
      ],
    }
  }

  const biolink = await Biolink.findOne(biolinkId)

  if (!biolink) {
    return {
      errors: [
        {
          errorCode: ErrorCode.BIOLINK_COULD_NOT_BE_FOUND,
          message: 'No biolink specified',
        },
      ],
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
    }
  }

  const availableLinks = []
  if (options.instagramAccount) availableLinks.push(options.instagramAccount)
  if (options.linkedinAccount) availableLinks.push(options.linkedinAccount)
  if (options.twitterAccount) availableLinks.push(options.twitterAccount)
  if (options.websiteLink) availableLinks.push(options.websiteLink)

  const malicious = await isMalicious(availableLinks)
  if (malicious) {
    return {
      errors: [
        {
          errorCode: ErrorCode.LINK_IS_MALICIOUS,
          message: 'Malicious link detected',
        },
      ],
    }
  }

  const userPlanSettings = userPlan.settings

  if (!userPlanSettings.verifiedCheckmarkEnabled) {
    return {
      errors: [
        {
          errorCode: ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST,
          message: 'Current plan does not support for verification. Please upgrade',
        },
      ],
    }
  }

  const category = await Category.findOne(options.categoryId)

  if (!category) {
    return {
      errors: [
        {
          errorCode: ErrorCode.CATEGORY_COULD_NOT_BE_FOUND,
          message: 'Unrecognized category',
        },
      ],
    }
  }

  const errors: ErrorResponse[] = []

  let photoIdName = ''
  let businessDocumentName = ''
  let otherDocumentsName = ''
  if (photoId) {
    const { createReadStream: photoIdCreateReadStream, filename: photoIdFilename } = photoId

    const photoIdExt = photoIdFilename.split('.').pop()

    photoIdName = `${randToken.generate(20)}-${Date.now().toString()}.${photoIdExt}`

    const photoIdDir = path.join(__dirname, `../../../assets/photoIds/${photoIdName}`)

    photoIdCreateReadStream()
      .pipe(createWriteStream(photoIdDir))
      .on('error', () => {
        errors.push({
          errorCode: ErrorCode.UPLOAD_ERROR,
          message: 'Unable to upload PhotoId',
        })
      })
  }

  if (businessDocument) {
    const {
      createReadStream: businessDocumentCreateReadStream,
      filename: businessDocumentFilename,
    } = businessDocument

    const businessDocumentExt = businessDocumentFilename.split('.').pop()

    businessDocumentName = `${randToken.generate(
      20
    )}-${Date.now().toString()}.${businessDocumentExt}`

    const businessDocumentDir = path.join(
      __dirname,
      `../../../assets/businessDocuments/${businessDocumentName}`
    )

    businessDocumentCreateReadStream()
      .pipe(createWriteStream(businessDocumentDir))
      .on('error', () => {
        errors.push({
          errorCode: ErrorCode.UPLOAD_ERROR,
          message: 'Unable to upload business documents',
        })
      })
  }

  if (otherDocuments) {
    const { createReadStream: otherDocumentsCreateReadStream, filename: otherDocumentsFilename } =
      otherDocuments

    const otherDocumentsExt = otherDocumentsFilename.split('.').pop()

    otherDocumentsName = `${randToken.generate(20)}-${Date.now().toString()}.${otherDocumentsExt}`

    const otherDocumentsDir = path.join(
      __dirname,
      `../../../assets/otherDocuments/${otherDocumentsName}`
    )

    otherDocumentsCreateReadStream()
      .pipe(createWriteStream(otherDocumentsDir))
      .on('error', () => {
        errors.push({
          errorCode: ErrorCode.UPLOAD_ERROR,
          message: 'Unable to upload other documents',
        })
      })
  }

  if (errors.length > 0) {
    return {
      errors,
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
    photoIdUrl: BACKEND_URL + '/static/photoIds/' + photoIdName,
    businessDocumentUrl: BACKEND_URL + '/static/businessDocuments/' + businessDocumentName,
    otherDocumentsUrl: BACKEND_URL + '/static/otherDocuments/' + otherDocumentsName,
    instagramUrl: options.instagramAccount,
    twitterUrl: options.twitterAccount,
    linkedinUrl: options.linkedinAccount,
  })

  verification.biolink = Promise.resolve(biolink)
  verification.category = Promise.resolve(category)
  verification.user = Promise.resolve(user)

  biolink.verificationStatus = VerificationStatus.Pending

  await biolink.save()
  await verification.save()

  // Capture user log
  await captureUserActivity(user, context, 'Successfully applied for verification', true)

  return {}
}
