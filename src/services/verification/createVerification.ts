import { createWriteStream } from 'fs'
import randToken from 'rand-token'
import path from 'path'
import { User, Biolink, Plan, Category, Verification } from 'entities'
import { VerificationInput } from 'input-types'
import { ErrorResponse } from 'object-types'
import { captureUserActivity } from 'services'
import { MyContext, ErrorCode } from 'types'

export const createVerification = async (
  options: VerificationInput,
  biolinkUsername: string,
  user: User,
  context: MyContext
): Promise<ErrorResponse[]> => {
  const errors: ErrorResponse[] = []

  if (!user) {
    errors.push({
      errorCode: ErrorCode.USER_NOT_AUTHENTICATED,
      message: 'User not authenticated',
    })

    return errors
  }

  const biolink = await Biolink.findOne({ where: { username: biolinkUsername } })

  if (!biolink) {
    errors.push({
      errorCode: ErrorCode.BIOLINK_COULD_NOT_BE_FOUND,
      message: 'No biolink specified',
    })

    return errors
  }

  if (biolink.verificationId) {
    errors.push({
      errorCode: ErrorCode.BIOLINK_ALREADY_VERIFIED,
      message: 'This biolink is already processed for verification',
    })

    return errors
  }

  const userPlan = await Plan.findOne({ where: { id: user.planId } })

  if (!userPlan) {
    errors.push({
      errorCode: ErrorCode.PLAN_COULD_NOT_BE_FOUND,
      message: 'Unrecognized plan',
    })

    return errors
  }

  if (!userPlan.settings.verifiedCheckmarkEnabled) {
    errors.push({
      errorCode: ErrorCode.CURRENT_PLAN_DO_NOT_SUPPORT_THIS_REQUEST,
      message: 'Current plan does not support for verification. Please upgrade',
    })

    return errors
  }

  const category = await Category.findOne({ where: { id: options.categoryId } })

  if (!category) {
    errors.push({
      errorCode: ErrorCode.CATEGORY_COULD_NOT_BE_FOUND,
      message: 'Unrecognized category',
    })

    return errors
  }

  const { createReadStream: photoIdCreateReadStream, filename: photoIdFilename } = options.photoId

  const photoIdExt = photoIdFilename.split('.').pop()

  const photoIdName = `${randToken.generate(20)}-${Date.now().toString()}.${photoIdExt}`

  const photoIdDir = path.join(__dirname, `../../../assets/photoIds/${photoIdName}`)

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

  const businessDocumentName = `${randToken.generate(
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

  const { createReadStream: otherDocumentsCreateReadStream, filename: otherDocumentsFilename } =
    options.otherDocuments

  const otherDocumentsExt = otherDocumentsFilename.split('.').pop()

  const otherDocumentsName = `${randToken.generate(
    20
  )}-${Date.now().toString()}.${otherDocumentsExt}`

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

  if (errors.length > 0) {
    return errors
  }

  const verification = Verification.create({
    username: options.username,
    firstName: options.firstName,
    lastName: options.lastName,
    mobileNumber: options.mobileNumber,
    workNumber: options.workNumber,
    email: options.email,
    websiteLink: options.websiteLink,
    photoIdUrl: window.location.origin + '/static/photoIds/' + photoIdName,
    businessDocumentUrl:
      window.location.origin + '/static/businessDocuments/' + businessDocumentName,
    otherDocumentsUrl: window.location.origin + '/static/otherDocuments/' + otherDocumentsName,
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

  return errors
}
