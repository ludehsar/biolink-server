import { FormGroup, TextArea } from '@admin-bro/design-system'
import React from 'react'

import {
  FormCTAGroup,
  FormInput,
  FormLabel,
  FormSubmitButton,
  SettingsTabContainer,
} from './CommonSettings.styled'
import { CommonSettingsProps } from './CommonSettingsProps'

const LinkSettings: React.FC<CommonSettingsProps> = (props) => {
  const { className, id } = props
  return (
    <SettingsTabContainer {...{ className, id }}>
      <FormGroup>
        <FormLabel>Branding</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Enable the Link Shortener System</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Enable the Custom Domain System</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Enable the Usage of Main Domain</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Blacklisted Domains</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Blacklisted Keywords</FormLabel>
        <TextArea width="100%" />
      </FormGroup>

      <FormGroup>
        <FormLabel>Is Phishtank Enabled</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Is Google Safe Browse Enabled</FormLabel>
        <FormInput />
      </FormGroup>

      <FormCTAGroup>
        <FormSubmitButton>Update</FormSubmitButton>
      </FormCTAGroup>
    </SettingsTabContainer>
  )
}

export default LinkSettings
