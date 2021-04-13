import { Box, Label, Input } from '@admin-bro/design-system'
import styled from 'styled-components'

export const UserDetailsContainer = styled(Box)`
  background: ${({ theme }) => theme.colors.white};
  margin-bottom: 20px;
  padding: 2rem;
`

export const FlexContainer = styled(Box)`
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 0px;

  @media (min-width: 737px) {
    flex-direction: row;
    margin-bottom: 20px;
  }
`

export const GridContainer = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  grid-gap: 15px;
  margin-bottom: 20px;
`

export const UserDetailsItem = styled(Box)`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  margin: 6px;
`

export const UserDetailsItemLabel = styled(Label)`
  font-size: 16px;
  font-weight: 700;
`

export const UserDetailsItemValue = styled(Input)`
  border: none;
  margin: 2px 0;
  padding: 4px;
  &:hover,
  &:focus {
    text-decoration: none;
  }
`
