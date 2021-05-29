import { FormGroup } from '@admin-bro/design-system'
import { withNotice } from 'admin-bro'
import { Formik, Form } from 'formik'
import React from 'react'

import {
  FormCTAGroup,
  FormInput,
  FormLabel,
  FormSubmitButton,
  MainTabContainer,
} from '../../shared/components/Common.styled'
import { saveCaptchaSettings } from '../actions/captchaSettingsAction'
import { CommonSettingsProps } from './CommonSettingsProps'
import { CaptchaSystemSettings } from 'json-types'

const CaptchaSettings: React.FC<CommonSettingsProps> = (props) => {
  const { className, id, value, addNotice } = props

  const handleSubmit = async (values: CaptchaSystemSettings): Promise<void> => {
    await saveCaptchaSettings(values).catch(() => {
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
          captchaType: (value as CaptchaSystemSettings)?.captchaType || 'basic',
          enableCaptchaOnLoginPage:
            (value as CaptchaSystemSettings)?.enableCaptchaOnLoginPage || 'no',
          enableCaptchaOnRegisterPage:
            (value as CaptchaSystemSettings)?.enableCaptchaOnRegisterPage || 'no',
          enableCaptchaOnLostPasswordPage:
            (value as CaptchaSystemSettings)?.enableCaptchaOnLostPasswordPage || 'no',
          enableCaptchaOnResendActivationPage:
            (value as CaptchaSystemSettings)?.enableCaptchaOnResendActivationPage || 'no',
        }}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values as CaptchaSystemSettings)
          setSubmitting(false)
          return
        }}
      >
        {({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit} method="post">
            <FormGroup>
              <FormLabel>Captcha Type</FormLabel>
              <FormInput
                as="select"
                name="captchaType"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.captchaType}
              >
                <FormInput as="option" value="basic">
                  Basic Captcha
                </FormInput>
                <FormInput as="option" value="recaptcha">
                  Google ReCaptcha v2 Checkbox
                </FormInput>
              </FormInput>
            </FormGroup>

            <FormGroup>
              <FormLabel>Enable Captcha on the Login Page</FormLabel>
              <FormInput
                as="select"
                name="enableCaptchaOnLoginPage"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.enableCaptchaOnLoginPage}
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
              <FormLabel>Enable Captcha on the Register Page</FormLabel>
              <FormInput
                as="select"
                name="enableCaptchaOnRegisterPage"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.enableCaptchaOnRegisterPage}
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
              <FormLabel>Enable Captcha on the Lost Password Page</FormLabel>
              <FormInput
                as="select"
                name="enableCaptchaOnLostPasswordPage"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.enableCaptchaOnLostPasswordPage}
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
              <FormLabel>Enable Captcha on the Resend Activation Page</FormLabel>
              <FormInput
                as="select"
                name="enableCaptchaOnResendActivationPage"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.enableCaptchaOnResendActivationPage}
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

export default withNotice(CaptchaSettings)
