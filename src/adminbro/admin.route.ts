import AdminBroExpress from '@admin-bro/express'
import AdminBro from 'admin-bro'
import { Router } from 'express'

const buildAdminRouter = (admin: AdminBro): Router => {
  // const router = AdminBroExpress.buildAuthenticatedRouter(
  //   admin,
  //   {
  //     authenticate: async (email, password) => {
  //       const user = await User.findOne({ email })
  //       if (user) {
  //         const matched = await argon2.verify(user.encryptedPassword, password)
  //         if (matched && user.userRole === UserRole.Admin) {
  //           return user
  //         }
  //       }
  //       return false
  //     },
  //     cookiePassword: appKey,
  //   },
  //   null,
  //   {
  //     resave: false,
  //     saveUninitialized: true,
  //   } as SessionOptions
  // )
  const router = AdminBroExpress.buildRouter(admin)

  return router
}

export default buildAdminRouter
