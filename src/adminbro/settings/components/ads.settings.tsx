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

const AdsSettings: React.FC<CommonSettingsProps> = (props) => {
  const { className, id } = props
  return (
    <SettingsTabContainer {...{ className, id }}>
      <FormGroup>
        <FormLabel>Header</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Footer</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Biolink Page Header</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Biolink Page Footer</FormLabel>
        <FormInput />
      </FormGroup>

      <FormCTAGroup>
        <FormSubmitButton>Update</FormSubmitButton>
      </FormCTAGroup>
    </SettingsTabContainer>
  )
}

export default AdsSettings
