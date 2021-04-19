import { FormGroup } from '@admin-bro/design-system'
import { Formik, Form } from 'formik'
import { withNotice } from 'admin-bro'
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
import { saveBusinessSettings } from '../actions/businessSettingsAction'
import { BusinessSystemSettings } from '../../../models/jsonTypes/BusinessSystemSettings'

const BusinessSettings: React.FC<CommonSettingsProps> = (props) => {
  const { className, id, value, addNotice } = props

  const handleSubmit = async (values: BusinessSystemSettings): Promise<void> => {
    await saveBusinessSettings(values).catch(() => {
      addNotice({
        message: 'Unable to save data to the database.',
        type: 'error',
      })
      return
    })
    addNotice({
      message: 'Successfully updated main settings',
      type: 'success',
    })
  }

  return (
    <SettingsTabContainer {...{ className, id }}>
      <Title>
        Business Details
        <FormHelper>These details will be used when generating invoices for the user.</FormHelper>
      </Title>
      <Formik
        enableReinitialize={true}
        initialValues={{
          enableInvoice: (value as BusinessSystemSettings)?.enableInvoice || 'no',
          invoiceNrPrefix: (value as BusinessSystemSettings)?.invoiceNrPrefix || '',
          name: (value as BusinessSystemSettings)?.name || '',
          address: (value as BusinessSystemSettings)?.address || '',
          city: (value as BusinessSystemSettings)?.city || '',
          country: (value as BusinessSystemSettings)?.country || '',
          zipCode: (value as BusinessSystemSettings)?.zipCode || '',
          email: (value as BusinessSystemSettings)?.email || '',
          phone: (value as BusinessSystemSettings)?.phone || '',
          taxType: (value as BusinessSystemSettings)?.taxType || '',
          taxId: (value as BusinessSystemSettings)?.taxId || '',
        }}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values as BusinessSystemSettings)
          setSubmitting(false)
          return
        }}
      >
        {({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit} method="post">
            <FormGroup>
              <FormLabel>Enable Invoice System</FormLabel>
              <FormInput
                as="select"
                name="enableInvoice"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.enableInvoice}
              >
                <FormInput as="option" value={'yes'}>
                  Yes
                </FormInput>
                <FormInput as="option" value={'no'}>
                  No
                </FormInput>
              </FormInput>
              <FormHelper>
                This option will determine if users will be able to see invoices for their payments
                or not.
              </FormHelper>
            </FormGroup>

            <FormGroup>
              <FormLabel>Invoice Nr Prefix</FormLabel>
              <FormInput
                type="text"
                name="invoiceNrPrefix"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.invoiceNrPrefix}
              />
              <FormHelper>
                Your Nr Prefix for all the invoices generated on the system. Ex: INV-
              </FormHelper>
            </FormGroup>

            <FormGroup>
              <FormLabel>Name</FormLabel>
              <FormInput
                type="text"
                name="name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Address</FormLabel>
              <FormInput
                type="text"
                name="address"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.address}
              />
            </FormGroup>

            <FormRow>
              <FormCol6>
                <FormGroup>
                  <FormLabel>City</FormLabel>
                  <FormInput
                    type="text"
                    name="city"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.city}
                  />
                </FormGroup>
              </FormCol6>
              <FormCol4>
                <FormGroup>
                  <FormLabel>Country</FormLabel>
                  <FormInput
                    type="text"
                    name="country"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.country}
                  />
                </FormGroup>
              </FormCol4>
              <FormCol2>
                <FormGroup>
                  <FormLabel>ZIP Code</FormLabel>
                  <FormInput
                    type="text"
                    name="zipCode"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.zipCode}
                  />
                </FormGroup>
              </FormCol2>
            </FormRow>

            <FormRow>
              <FormCol6>
                <FormGroup>
                  <FormLabel>Email</FormLabel>
                  <FormInput
                    type="text"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                </FormGroup>
              </FormCol6>
              <FormCol6>
                <FormGroup>
                  <FormLabel>Phone</FormLabel>
                  <FormInput
                    type="text"
                    name="phone"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.phone}
                  />
                </FormGroup>
              </FormCol6>
            </FormRow>

            <FormRow>
              <FormCol6>
                <FormGroup>
                  <FormLabel>Tax Type</FormLabel>
                  <FormInput
                    type="text"
                    name="taxType"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.taxType}
                  />
                </FormGroup>
              </FormCol6>
              <FormCol6>
                <FormGroup>
                  <FormLabel>Tax ID</FormLabel>
                  <FormInput
                    type="text"
                    name="taxId"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.taxId}
                  />
                </FormGroup>
              </FormCol6>
            </FormRow>

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

export default withNotice(BusinessSettings)
