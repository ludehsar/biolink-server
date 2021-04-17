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
        <FormInput as="select">
          <FormInput as="option" value="basic">
            Basic Captcha
          </FormInput>
          <FormInput as="option" value="recaptcha">
            Google ReCaptcha v2 Checkbox
          </FormInput>
        </FormInput>
      </FormGroup>

      <FormGroup>
        <FormLabel>Enable Captcha on the Login Page</FormLabel>
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
        <FormLabel>Enable Captcha on the Register Page</FormLabel>
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
        <FormLabel>Enable Captcha on the Lost Password Page</FormLabel>
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
        <FormLabel>Enable Captcha on the Resend Activation Page</FormLabel>
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

export default CaptchaSettings
