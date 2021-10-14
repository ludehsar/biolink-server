import { FileUpload } from 'graphql-upload'

export interface MessageUpdateBody {
  message?: string
  attachment?: FileUpload
}
