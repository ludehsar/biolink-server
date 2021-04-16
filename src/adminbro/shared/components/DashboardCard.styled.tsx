import styled from 'styled-components'
import { Box, Icon, Text, H4 } from '@admin-bro/design-system'

export const CardTitle = styled(Text)`
  color: ${({ theme }) => theme.colors.grey80};
`

export const CardIcon = styled(Icon)``

export const CardDetails = styled(Box)`
  margin-top: 1rem;
`

export const CardValue = styled(H4)`
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  line-height: 1.2;
`

export const CardSeeMore = styled(Box)`
  background-color: ${({ theme }) => theme.colors.primary80};
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  &:hover {
    cursor: pointer;
  }
`
