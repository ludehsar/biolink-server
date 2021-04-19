import { FormGroup } from '@admin-bro/design-system'
import { withNotice } from 'admin-bro'
import { Formik, Form } from 'formik'
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
import { savePaymentSettings } from '../actions/paymentSettingsAction'
import { PaymentSystemSettings } from '../../../models/jsonTypes/PaymentSystemSettings'

const PaymentSettings: React.FC<CommonSettingsProps> = (props) => {
  const { className, id, value, addNotice } = props

  const handleSubmit = async (values: PaymentSystemSettings): Promise<void> => {
    await savePaymentSettings(values).catch(() => {
      addNotice({
        message: 'Unable to save data to the database.',
        type: 'error',
      })
      return
    })
    addNotice({
      message: 'Successfully updated settings',
      type: 'success',
    })
  }

  return (
    <SettingsTabContainer {...{ className, id }}>
      <Formik
        enableReinitialize={true}
        initialValues={{
          enablePaymentSystem: (value as PaymentSystemSettings)?.enablePaymentSystem || 'no',
          enabledPaymentType: (value as PaymentSystemSettings)?.enabledPaymentType || 'both',
          brandName: (value as PaymentSystemSettings)?.brandName || '',
          currency: (value as PaymentSystemSettings)?.currency || 'usd',
          enableDiscountOrRedeemableCode:
            (value as PaymentSystemSettings)?.enableDiscountOrRedeemableCode || 'no',
          enableTaxesAndBilling: (value as PaymentSystemSettings)?.enableTaxesAndBilling || 'no',
          enablePaypal: (value as PaymentSystemSettings)?.enablePaypal || 'no',
          enableStripe: (value as PaymentSystemSettings)?.enableStripe || 'no',
        }}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values as PaymentSystemSettings)
          setSubmitting(false)
          return
        }}
      >
        {({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit} method="post">
            <FormGroup>
              <FormLabel>Enable Payment System</FormLabel>
              <FormInput
                as="select"
                name="enablePaymentSystem"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.enablePaymentSystem}
              >
                <FormInput as="option" value={'yes'}>
                  Yes
                </FormInput>
                <FormInput as="option" value={'no'}>
                  No
                </FormInput>
              </FormInput>
              <FormHelper>
                Disabling the payment system will remove all the options for the users to upgrade
                their accounts or see any payment related information.
              </FormHelper>
            </FormGroup>

            <FormGroup>
              <FormLabel>Enabled Payment Types</FormLabel>
              <FormInput
                as="select"
                name="enabledPaymentType"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.enabledPaymentType}
              >
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
              <FormInput
                type="text"
                name="brandName"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.brandName}
              />
              <FormHelper>
                The brand name will be used for displaying the brand when users purchase via payment
                gates (ex: paypal).
              </FormHelper>
            </FormGroup>

            <FormGroup>
              <FormLabel>Currency</FormLabel>
              <FormInput
                as="select"
                name="currency"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.currency}
              >
                <FormInput as="option" value="usd">
                  USD
                </FormInput>
              </FormInput>
              <FormHelper>Currency code for the payments (ex: USD)</FormHelper>
            </FormGroup>

            <FormGroup>
              <FormLabel>Enable Discount/Redeemable Codes</FormLabel>
              <FormInput
                as="select"
                name="enableDiscountOrRedeemableCode"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.enableDiscountOrRedeemableCode}
              >
                <FormInput as="option" value={'yes'}>
                  Yes
                </FormInput>
                <FormInput as="option" value={'no'}>
                  No
                </FormInput>
              </FormInput>
              <FormHelper>
                Enabling the discount codes system will enable users to add a discount code created
                from the admin panel, before they checkout.
              </FormHelper>
            </FormGroup>

            <FormGroup>
              <FormLabel>Enable Taxes and Billing system</FormLabel>
              <FormInput
                as="select"
                name="enableTaxesAndBilling"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.enableTaxesAndBilling}
              >
                <FormInput as="option" value={'yes'}>
                  Yes
                </FormInput>
                <FormInput as="option" value={'no'}>
                  No
                </FormInput>
              </FormInput>
              <FormHelper>
                Enabling this feature will require users to fill in their Billing info before
                checking out.
              </FormHelper>
            </FormGroup>

            <FormGroup>
              <FormLabel>Enable Paypal Payments</FormLabel>
              <FormInput
                as="select"
                name="enablePaypal"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.enablePaypal}
              >
                <FormInput as="option" value={'yes'}>
                  Yes
                </FormInput>
                <FormInput as="option" value={'no'}>
                  No
                </FormInput>
              </FormInput>
            </FormGroup>

            <FormGroup>
              <FormLabel>Enable Stripe Payments</FormLabel>
              <FormInput
                as="select"
                name="enableStripe"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.enableStripe}
              >
                <FormInput as="option" value={'yes'}>
                  Yes
                </FormInput>
                <FormInput as="option" value={'no'}>
                  No
                </FormInput>
              </FormInput>
            </FormGroup>

            <FormCTAGroup>
              <FormSubmitButton type="submit" disabled={isSubmitting}>
                Update
              </FormSubmitButton>
            </FormCTAGroup>
          </Form>
        )}
      </Formik>
    </SettingsTabContainer>
  )
}

export default withNotice(PaymentSettings)
