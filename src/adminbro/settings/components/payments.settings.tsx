import { FormGroup } from '@admin-bro/design-system'
import { withNotice } from 'admin-bro'
import React from 'react'

import {
  FormCTAGroup,
  FormHelper,
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
        <FormInput as="select">
          <FormInput as="option" value={1}>
            Yes
          </FormInput>
          <FormInput as="option" value={0}>
            No
          </FormInput>
        </FormInput>
        <FormHelper>
          Disabling the payment system will remove all the options for the users to upgrade their
          accounts or see any payment related information.
        </FormHelper>
      </FormGroup>

      <FormGroup>
        <FormLabel>Enabled Payment Types</FormLabel>
        <FormInput as="select">
          <FormInput as="option" value="one-time">
            One Time
          </FormInput>
          <FormInput as="option" value="recurring">
            Recurring
          </FormInput>
          <FormInput as="option" value="both">
            Both
          </FormInput>
        </FormInput>
      </FormGroup>

      <FormGroup>
        <FormLabel>Brand Name</FormLabel>
        <FormInput />
        <FormHelper>
          The brand name will be used for displaying the brand when users purchase via payment gates
          (ex: paypal).
        </FormHelper>
      </FormGroup>

      <FormGroup>
        <FormLabel>Currency</FormLabel>
        <FormInput as="select">
          <FormInput as="option" value="usd">
            USD
          </FormInput>
        </FormInput>
        <FormHelper>Currency code for the payments (ex: USD)</FormHelper>
      </FormGroup>

      <FormGroup>
        <FormLabel>Enable Discount/Redeemable Codes</FormLabel>
        <FormInput as="select">
          <FormInput as="option" value={1}>
            Yes
          </FormInput>
          <FormInput as="option" value={0}>
            No
          </FormInput>
        </FormInput>
        <FormHelper>
          Enabling the discount codes system will enable users to add a discount code created from
          the admin panel, before they checkout.
        </FormHelper>
      </FormGroup>

      <FormGroup>
        <FormLabel>Enable Taxes and Billing system</FormLabel>
        <FormInput as="select">
          <FormInput as="option" value={1}>
            Yes
          </FormInput>
          <FormInput as="option" value={0}>
            No
          </FormInput>
        </FormInput>
        <FormHelper>
          Enabling this feature will require users to fill in their Billing info before checking
          out.
        </FormHelper>
      </FormGroup>

      <FormGroup>
        <FormLabel>Enable Paypal Payments</FormLabel>
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
        <FormLabel>Enable Stripe Payments</FormLabel>
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

export default withNotice(PaymentSettings)
