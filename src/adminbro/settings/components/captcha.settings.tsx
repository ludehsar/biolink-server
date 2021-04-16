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

const CaptchaSettings: React.FC<CommonSettingsProps> = (props) => {
  const { className, id } = props
  return (
    <SettingsTabContainer {...{ className, id }}>
      <FormGroup>
        <FormLabel>Captcha Type</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Enable Captcha on the Login Page</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Enable Captcha on the Register Page</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Enable Captcha on the Lost Password Page</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Enable Captcha on the Resend Activation Page</FormLabel>
        <FormInput />
      </FormGroup>

      <FormCTAGroup>
        <FormSubmitButton>Update</FormSubmitButton>
      </FormCTAGroup>
    </SettingsTabContainer>
  )
}

export default CaptchaSettings
