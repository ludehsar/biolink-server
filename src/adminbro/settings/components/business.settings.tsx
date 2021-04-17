import { FormGroup } from '@admin-bro/design-system'
import React from 'react'

import {
  FormCTAGroup,
  FormHelper,
  FormInput,
  FormLabel,
  FormSubmitButton,
  SettingsTabContainer,
  Title,
} from './CommonSettings.styled'
import { FormCol2, FormCol4, FormCol6, FormRow } from './business.settings.styled'
import { CommonSettingsProps } from './CommonSettingsProps'

const BusinessSettings: React.FC<CommonSettingsProps> = (props) => {
  const { className, id } = props
  return (
    <SettingsTabContainer {...{ className, id }}>
      <Title>
        Business Details
        <FormHelper>These details will be used when generating invoices for the user.</FormHelper>
      </Title>
      <FormGroup>
        <FormLabel>Enable Invoice System</FormLabel>
        <FormInput as="select">
          <FormInput as="option" value={1}>
            Yes
          </FormInput>
          <FormInput as="option" value={0}>
            No
          </FormInput>
        </FormInput>
        <FormHelper>
          This option will determine if users will be able to see invoices for their payments or
          not.
        </FormHelper>
      </FormGroup>

      <FormGroup>
        <FormLabel>Invoice Nr Prefix</FormLabel>
        <FormInput />
        <FormHelper>
          Your Nr Prefix for all the invoices generated on the system. Ex: INV-
        </FormHelper>
      </FormGroup>

      <FormGroup>
        <FormLabel>Name</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Address</FormLabel>
        <FormInput />
      </FormGroup>

      <FormRow>
        <FormCol6>
          <FormGroup>
            <FormLabel>City</FormLabel>
            <FormInput />
          </FormGroup>
        </FormCol6>
        <FormCol4>
          <FormGroup>
            <FormLabel>Country</FormLabel>
            <FormInput />
          </FormGroup>
        </FormCol4>
        <FormCol2>
          <FormGroup>
            <FormLabel>ZIP Code</FormLabel>
            <FormInput />
          </FormGroup>
        </FormCol2>
      </FormRow>

      <FormGroup>
        <FormLabel>Country</FormLabel>
        <FormInput />
      </FormGroup>

      <FormRow>
        <FormCol6>
          <FormGroup>
            <FormLabel>Email</FormLabel>
            <FormInput />
          </FormGroup>
        </FormCol6>
        <FormCol6>
          <FormGroup>
            <FormLabel>Phone</FormLabel>
            <FormInput />
          </FormGroup>
        </FormCol6>
      </FormRow>

      <FormRow>
        <FormCol6>
          <FormGroup>
            <FormLabel>Tax Type</FormLabel>
            <FormInput />
          </FormGroup>
        </FormCol6>
        <FormCol6>
          <FormGroup>
            <FormLabel>Tax ID</FormLabel>
            <FormInput />
          </FormGroup>
        </FormCol6>
      </FormRow>

      <FormCTAGroup>
        <FormSubmitButton>Update</FormSubmitButton>
      </FormCTAGroup>
    </SettingsTabContainer>
  )
}

export default BusinessSettings
