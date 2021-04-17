import { Box } from '@admin-bro/design-system'
import styled from 'styled-components'

export const FormRow = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  margin-left: -15px;
  margin-right: -15px;
`

export const FormCol12 = styled(Box)`
  flex: 0 0 100%;
  max-width: 100%;
  padding-left: 15px;
  padding-right: 15px;
`

export const FormCol6 = styled(Box)`
  flex: 0 0 100%;
  max-width: 100%;
  padding-left: 15px;
  padding-right: 15px;

  @media (min-width: 992px) {
    flex: 0 0 50%;
    max-width: 50%;
  }
`

export const FormCol4 = styled(Box)`
  flex: 0 0 100%;
  max-width: 100%;
  padding-left: 15px;
  padding-right: 15px;

  @media (min-width: 992px) {
    flex: 0 0 33.3333333333%;
    max-width: 33.3333333333%;
  }
`

export const FormCol2 = styled(Box)`
  flex: 0 0 100%;
  max-width: 100%;
  padding-left: 15px;
  padding-right: 15px;

  @media (min-width: 992px) {
    flex: 0 0 16.6666666667%;
    max-width: 16.6666666667%;
  }
`
