import { ResourceOptions } from 'admin-bro'

import { Verification } from '../entities/Verification'

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
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[10] &&
            currentAdmin.role.roleSettings[10].canCreate === true)
        )
      },
    },
    bulkDelete: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[10] &&
            currentAdmin.role.roleSettings[10].canDelete === true)
        )
      },
    },
    delete: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[10] &&
            currentAdmin.role.roleSettings[10].canDelete === true)
        )
      },
    },
    edit: {
      showInDrawer: true,
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[10] &&
            currentAdmin.role.roleSettings[10].canEdit === true)
        )
      },
    },
    list: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[10] &&
            currentAdmin.role.roleSettings[10].canShowList === true)
        )
      },
    },
    search: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[10] &&
            currentAdmin.role.roleSettings[10].canShowList === true)
        )
      },
    },
    show: {
      isAccessible: ({ currentAdmin }): boolean => {
        if (!currentAdmin) return false
        return (
          currentAdmin.role.roleName === 'Administrator' ||
          (currentAdmin.role.roleSettings[10] &&
            currentAdmin.role.roleSettings[10].canShow === true)
        )
      },
    },
  },
  navigation: {
    icon: 'Identification',
  },
}

export const verificationResource = Verification
