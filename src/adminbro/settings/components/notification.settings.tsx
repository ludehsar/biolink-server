import { FormGroup } from '@admin-bro/design-system'
import React from 'react'

import {
  FormCTAGroup,
  FormInput,
  FormLabel,
  FormSubmitButton,
  SettingsTabContainer,
} from './CommonSettings.styled'
import { CommonSettingsProps } from './CommonSettingsProps'

const NotificationSettings: React.FC<CommonSettingsProps> = (props) => {
  const { className, id } = props
  return (
    <SettingsTabContainer {...{ className, id }}>
      <FormGroup>
        <FormLabel>Emails to be Notified</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>New User</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>New Payment</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>New Custom Domain</FormLabel>
        <FormInput />
      </FormGroup>

      <FormCTAGroup>
        <FormSubmitButton>Update</FormSubmitButton>
      </FormCTAGroup>
    </SettingsTabContainer>
  )
}

export default NotificationSettings
