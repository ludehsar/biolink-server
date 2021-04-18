import { NoticeMessage } from 'admin-bro'

export interface CommonSettingsProps {
  className?: string | undefined
  id?: string | undefined
  value?: any
  addNotice: (notice: NoticeMessage) => void
}
