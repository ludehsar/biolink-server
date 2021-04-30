import { FormGroup } from '@admin-bro/design-system'
import { Formik, Form } from 'formik'
import { withNotice } from 'admin-bro'
import React from 'react'

import {
  Col2,
  Col4,
  Col6,
  FormCTAGroup,
  FormHelper,
  FormInput,
  FormLabel,
  Row,
  FormSubmitButton,
  MainTabContainer,
  Title,
} from '../../shared/components/Common.styled'
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
    <MainTabContainer {...{ className, id }}>
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

            <Row>
              <Col6>
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
              </Col6>
              <Col4>
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
              </Col4>
              <Col2>
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
              </Col2>
            </Row>

            <Row>
              <Col6>
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
              </Col6>
              <Col6>
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
              </Col6>
            </Row>

            <Row>
              <Col6>
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
              </Col6>
              <Col6>
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
              </Col6>
            </Row>

            <FormCTAGroup>
              <FormSubmitButton type="submit" disabled={isSubmitting}>
                Update
              </FormSubmitButton>
            </FormCTAGroup>
          </Form>
        )}
      </Formik>
    </MainTabContainer>
  )
}

export default withNotice(BusinessSettings)
