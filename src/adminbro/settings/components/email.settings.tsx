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
} from '../../shared/components/Common.styled'
import { saveEmailSettings } from '../actions/emailSettingsAction'
import { CommonSettingsProps } from './CommonSettingsProps'
import { EmailSystemSettings } from '../../../models/jsonTypes/EmailSystemSettings'

const EmailSettings: React.FC<CommonSettingsProps> = (props) => {
  const { className, id, value, addNotice } = props

  const handleSubmit = async (values: EmailSystemSettings): Promise<void> => {
    await saveEmailSettings(values).catch(() => {
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
          fromName: (value as EmailSystemSettings)?.fromName || '',
        }}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values as EmailSystemSettings)
          setSubmitting(false)
          return
        }}
      >
        {({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit} method="post">
            <FormGroup>
              <FormLabel>From Name</FormLabel>
              <FormInput
                type="text"
                name="fromName"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.fromName}
              />
              <FormHelper>This name will be used while sending mail to the users.</FormHelper>
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

export default withNotice(EmailSettings)
