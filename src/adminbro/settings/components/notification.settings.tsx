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
  FormTextArea,
  MainTabContainer,
} from '../../shared/components/Common.styled'
import { CommonSettingsProps } from './CommonSettingsProps'
import { saveEmailNotificationSettings } from '../actions/notificationSettingsAction'
import { NotificationSystemSettings } from '../../../models/jsonTypes/NotificationSystemSettings'

const NotificationSettings: React.FC<CommonSettingsProps> = (props) => {
  const { className, id, value, addNotice } = props

  const handleSubmit = async (values: NotificationSystemSettings): Promise<void> => {
    await saveEmailNotificationSettings(values).catch(() => {
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
    <MainTabContainer {...{ className, id }}>
      <Formik
        enableReinitialize={true}
        initialValues={{
          emailsToBeNotified: ((value as NotificationSystemSettings)?.emailsToBeNotified || [])
            .join('\n')
            .toString(),
          emailOnNewUser: (value as NotificationSystemSettings)?.emailOnNewUser || 'no',
          emailOnNewPayment: (value as NotificationSystemSettings)?.emailOnNewPayment || 'no',
          emailOnNewCustomDomain:
            (value as NotificationSystemSettings)?.emailOnNewCustomDomain || 'no',
        }}
        onSubmit={(values, { setSubmitting }) => {
          const emailsToBeNotified = values.emailsToBeNotified.split('\n')
          emailsToBeNotified.sort()

          const newValues = {
            ...values,
            emailsToBeNotified,
          }

          handleSubmit(newValues as NotificationSystemSettings)
          setSubmitting(false)
          return
        }}
      >
        {({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit} method="post">
            <FormGroup>
              <FormLabel>Emails to be Notified</FormLabel>
              <FormTextArea
                name="emailsToBeNotified"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.emailsToBeNotified}
              />
              <FormHelper>
                Emails that will receive a notification when one of the actions from below are
                performed. Add valid email addresses separated by new lines.
              </FormHelper>
            </FormGroup>

            <FormGroup>
              <FormLabel>New User</FormLabel>
              <FormInput
                as="select"
                name="emailOnNewUser"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.emailOnNewUser}
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
              <FormLabel>New Payment</FormLabel>
              <FormInput
                as="select"
                name="emailOnNewPayment"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.emailOnNewPayment}
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
              <FormLabel>New Custom Domain</FormLabel>
              <FormInput
                as="select"
                name="emailOnNewCustomDomain"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.emailOnNewCustomDomain}
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
    </MainTabContainer>
  )
}

export default withNotice(NotificationSettings)
