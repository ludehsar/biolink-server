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

const BusinessSettings: React.FC<CommonSettingsProps> = (props) => {
  const { className, id } = props
  return (
    <SettingsTabContainer {...{ className, id }}>
      <FormGroup>
        <FormLabel>Enable Invoice System</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Invoice Nr Prefix</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Name</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Address</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>City</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Country</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>ZIP Code</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Country</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Email</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Phone</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Tax Type</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Tax ID</FormLabel>
        <FormInput />
      </FormGroup>

      <FormCTAGroup>
        <FormSubmitButton>Update</FormSubmitButton>
      </FormCTAGroup>
    </SettingsTabContainer>
  )
}

export default BusinessSettings
