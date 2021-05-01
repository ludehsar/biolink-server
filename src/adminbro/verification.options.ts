import { ResourceOptions } from 'admin-bro'

import { Verification } from '../models/entities/Verification'

export const verificationOptions: ResourceOptions = {
  listProperties: [
    'userId',
    'biolinkId',
    'categoryId',
    'verificationStatus',
    'firstName',
    'lastName',
    'mobileNumber',
  ],
  filterProperties: [
    'userId',
    'biolinkId',
    'categoryId',
    'verificationStatus',
    'username',
    'firstName',
    'lastName',
    'mobileNumber',
    'workNumber',
    'email',
    'websiteLink',
    'instagramUrl',
    'twitterUrl',
    'linkedinUrl',
    'photoIdUrl',
    'businessDocumentUrl',
    'otherDocumentsUrl',
    'createdAt',
  ],
  showProperties: [
    'userId',
    'biolinkId',
    'categoryId',
    'verificationStatus',
    'username',
    'firstName',
    'lastName',
    'mobileNumber',
    'workNumber',
    'email',
    'websiteLink',
    'instagramUrl',
    'twitterUrl',
    'linkedinUrl',
    'photoIdUrl',
    'businessDocumentUrl',
    'otherDocumentsUrl',
    'createdAt',
  ],
  editProperties: ['verificationStatus'],
  properties: {
    username: {
      isTitle: true,
    },
  },
  actions: {
    new: {
      isVisible: false,
    },
    edit: {
      showInDrawer: true,
    },
  },
  navigation: {
    icon: 'Identification',
  },
}

export const verificationResource = Verification
