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

const MainSettings: React.FC<CommonSettingsProps> = (props) => {
  const { className, id } = props
  return (
    <SettingsTabContainer {...{ className, id }}>
      <FormGroup>
        <FormLabel>Website Title</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Default Language</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Website Logo</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Favicon</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Default Timezone</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Email Confirmation</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Enable New User Registration</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Terms and Conditions URL</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Privacy Policy URL</FormLabel>
        <FormInput />
      </FormGroup>

      <FormCTAGroup>
        <FormSubmitButton>Update</FormSubmitButton>
      </FormCTAGroup>
    </SettingsTabContainer>
  )
}

export default MainSettings
