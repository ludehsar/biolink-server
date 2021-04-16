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

const PaymentSettings: React.FC<CommonSettingsProps> = (props) => {
  const { className, id } = props
  return (
    <SettingsTabContainer {...{ className, id }}>
      <FormGroup>
        <FormLabel>Enable Payment System</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Enabled Payment Types</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Brand Name</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Currency</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Enable Discount/Redeemable Codes</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Enable Taxes and Billing system</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Enable Paypal Payments</FormLabel>
        <FormInput />
      </FormGroup>

      <FormGroup>
        <FormLabel>Enable Stripe Payments</FormLabel>
        <FormInput />
      </FormGroup>

      <FormCTAGroup>
        <FormSubmitButton>Update</FormSubmitButton>
      </FormCTAGroup>
    </SettingsTabContainer>
  )
}

export default PaymentSettings
