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

const SocialSettings: React.FC<CommonSettingsProps> = (props) => {
  const { className, id } = props
  return (
    <SettingsTabContainer {...{ className, id }}>
      <FormGroup>
        <FormLabel>Youtube</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Facebook</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Twitter</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Instagram</FormLabel>
        <FormInput />
      </FormGroup>

      <FormCTAGroup>
        <FormSubmitButton>Update</FormSubmitButton>
      </FormCTAGroup>
    </SettingsTabContainer>
  )
}

export default SocialSettings
