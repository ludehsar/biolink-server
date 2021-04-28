import { FormGroup } from '@admin-bro/design-system'
import { withNotice } from 'admin-bro'
import { Formik, Form } from 'formik'
import React from 'react'

import {
  Title,
  FormCTAGroup,
  FormHelper,
  FormInput,
  FormLabel,
  FormSubmitButton,
  MainTabContainer,
} from '../../shared/components/Common.styled'
import { CommonSettingsProps } from './CommonSettingsProps'
import { saveSocialSettings } from '../actions/socialSettingsAction'
import { SocialSystemSettings } from '../../../models/jsonTypes/SocialSystemSettings'

const SocialSettings: React.FC<CommonSettingsProps> = (props) => {
  const { className, id, value, addNotice } = props

  const handleSubmit = async (values: SocialSystemSettings): Promise<void> => {
    await saveSocialSettings(values).catch(() => {
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
      <Title>
        <FormHelper>Social links to be displayed in the footer of the website.</FormHelper>
      </Title>
      <Formik
        enableReinitialize={true}
        initialValues={{
          youtube: (value as SocialSystemSettings)?.youtube || '',
          facebook: (value as SocialSystemSettings)?.facebook || '',
          twitter: (value as SocialSystemSettings)?.twitter || '',
          instagram: (value as SocialSystemSettings)?.instagram || '',
        }}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values as SocialSystemSettings)
          setSubmitting(false)
          return
        }}
      >
        {({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit} method="post">
            <FormGroup>
              <FormLabel>Youtube</FormLabel>
              <FormInput
                type="text"
                name="youtube"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.youtube}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Facebook</FormLabel>
              <FormInput
                type="text"
                name="facebook"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.facebook}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Twitter</FormLabel>
              <FormInput
                type="text"
                name="twitter"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.twitter}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Instagram</FormLabel>
              <FormInput
                type="text"
                name="instagram"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.instagram}
              />
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

export default withNotice(SocialSettings)
