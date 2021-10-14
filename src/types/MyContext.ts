import { Request, Response } from 'express'
import { User } from '../entities'

export type MyContext = {
  req: Request
  res: Response
  user?: User
  connection?: any
}
