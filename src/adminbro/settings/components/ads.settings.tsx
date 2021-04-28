import { FormGroup } from '@admin-bro/design-system'
import { Formik, Form } from 'formik'
import { withNotice } from 'admin-bro'
import React from 'react'

import {
  Title,
  FormCTAGroup,
  FormHelper,
  FormLabel,
  FormSubmitButton,
  FormTextArea,
  MainTabContainer,
} from '../../shared/components/Common.styled'
import { CommonSettingsProps } from './CommonSettingsProps'
import { saveAdsSettings } from '../actions/adsSettingsAction'
import { AdsSystemSettings } from '../../../models/jsonTypes/AdsSystemSettings'

const AdsSettings: React.FC<CommonSettingsProps> = (props) => {
  const { className, id, value, addNotice } = props

  const handleSubmit = async (values: AdsSystemSettings): Promise<void> => {
    await saveAdsSettings(values).catch(() => {
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
        <FormHelper>These fields accept text or html.</FormHelper>
      </Title>
      <Formik
        enableReinitialize={true}
        initialValues={{
          header: (value as AdsSystemSettings)?.header || '',
          footer: (value as AdsSystemSettings)?.footer || '',
          biolinkPageHeader: (value as AdsSystemSettings)?.biolinkPageHeader || '',
          biolinkPageFooter: (value as AdsSystemSettings)?.biolinkPageFooter || '',
        }}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values as AdsSystemSettings)
          setSubmitting(false)
          return
        }}
      >
        {({ values, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
          <Form onSubmit={handleSubmit} method="post">
            <FormGroup>
              <FormLabel>Header</FormLabel>
              <FormTextArea
                name="header"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.header}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Footer</FormLabel>
              <FormTextArea
                name="footer"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.footer}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Biolink Page Header</FormLabel>
              <FormTextArea
                name="biolinkPageHeader"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.biolinkPageHeader}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>Biolink Page Footer</FormLabel>
              <FormTextArea
                name="biolinkPageFooter"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.biolinkPageFooter}
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

export default withNotice(AdsSettings)
