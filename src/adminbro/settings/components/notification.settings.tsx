import { FormGroup } from '@admin-bro/design-system'
import React from 'react'

import {
  FormCTAGroup,
  FormHelper,
  FormInput,
  FormLabel,
  FormSubmitButton,
  FormTextArea,
  SettingsTabContainer,
} from './CommonSettings.styled'
import { CommonSettingsProps } from './CommonSettingsProps'

const NotificationSettings: React.FC<CommonSettingsProps> = (props) => {
  const { className, id } = props
  return (
    <SettingsTabContainer {...{ className, id }}>
      <FormGroup>
        <FormLabel>Emails to be Notified</FormLabel>
        <FormTextArea />
        <FormHelper>
          Emails that will receive a notification when one of the actions from below are performed.
          Add valid email addresses separated by a comma.
        </FormHelper>
      </FormGroup>

      <FormGroup>
        <FormLabel>New User</FormLabel>
        <FormInput as="select">
          <FormInput as="option" value={1}>
            Yes
          </FormInput>
          <FormInput as="option" value={0}>
            No
          </FormInput>
        </FormInput>
      </FormGroup>

      <FormGroup>
        <FormLabel>New Payment</FormLabel>
        <FormInput as="select">
          <FormInput as="option" value={1}>
            Yes
          </FormInput>
          <FormInput as="option" value={0}>
            No
          </FormInput>
        </FormInput>
      </FormGroup>

      <FormGroup>
        <FormLabel>New Custom Domain</FormLabel>
        <FormInput as="select">
          <FormInput as="option" value={1}>
            Yes
          </FormInput>
          <FormInput as="option" value={0}>
            No
          </FormInput>
        </FormInput>
      </FormGroup>

      <FormCTAGroup>
        <FormSubmitButton>Update</FormSubmitButton>
      </FormCTAGroup>
    </SettingsTabContainer>
  )
}

export default NotificationSettings
