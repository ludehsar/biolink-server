import { FormGroup } from '@admin-bro/design-system'
import { withNotice } from 'admin-bro'
import React from 'react'

import {
  Title,
  FormCTAGroup,
  FormHelper,
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
      <Title>
        <FormHelper>Social links to be displayed in the footer of the website.</FormHelper>
      </Title>
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

export default withNotice(SocialSettings)
