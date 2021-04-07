import { AdminBroOptions } from 'admin-bro'

import { userOptions, userResource } from './user.resource'

const options: AdminBroOptions = {
  resources: [
    {
      resource: userResource,
      options: userOptions
    }
  ],
  rootPath: '/admin'
}

export default options
