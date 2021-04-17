import { FormGroup } from '@admin-bro/design-system'
import React from 'react'

import {
  FileUploader,
  FormCTAGroup,
  FormHelper,
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
        <FormInput as="select">
          <FormInput as="option" value="english">
            English
          </FormInput>
        </FormInput>
      </FormGroup>

      <FormGroup>
        <FormLabel>Website Logo</FormLabel>
        <FileUploader />
      </FormGroup>

      <FormGroup>
        <FormLabel>Favicon</FormLabel>
        <FileUploader />
      </FormGroup>

      <FormGroup>
        <FormLabel>Default Timezone</FormLabel>
        <FormInput as="select">
          <FormInput as="option" value="utc">
            UTC
          </FormInput>
        </FormInput>
      </FormGroup>

      <FormGroup>
        <FormLabel>Email Confirmation</FormLabel>
        <FormInput as="select">
          <FormInput as="option" value={1}>
            Yes
          </FormInput>
          <FormInput as="option" value={0}>
            No
          </FormInput>
        </FormInput>
        <FormHelper>
          Send out email confirmation when a user registers or changes his email address.
        </FormHelper>
      </FormGroup>

      <FormGroup>
        <FormLabel>Enable New User Registration</FormLabel>
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
