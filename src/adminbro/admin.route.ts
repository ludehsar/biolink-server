import AdminBroExpress from '@admin-bro/express'
import AdminBro from 'admin-bro'
import { Router } from 'express'

const buildAdminRouter = (admin: AdminBro): Router => {
  // const router = AdminBroExpress.buildAuthenticatedRouter(
  //   admin,
  //   {
  //     authenticate: async (email, password): Promise<CurrentAdmin | boolean> => {
  //       const user = await User.findOne({ email })
  //       if (user) {
  //         const matched = await argon2.verify(user.encryptedPassword, password)
  //         if (matched && user.adminRoleId != null) {
  //           const role = await AdminRole.findOne(user.adminRoleId)

  //           if (!role || role.roleName !== 'Administrator') return false

  //           return {
  //             id: user.id,
  //             email: user.email,
  //             title: role.roleName,
  //             role,
  //           }
  //         }
  //       }
  //       return false
  //     },
  //     cookiePassword: appConfig.appKey,
  //   },
  //   null,
  //   {
  //     resave: false,
  //     saveUninitialized: false,
  //   } as SessionOptions
  // )
  const router = AdminBroExpress.buildRouter(admin)

  return router
}

export default buildAdminRouter
