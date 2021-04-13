import styled from 'styled-components'
import { Box, Icon, Text, H4 } from '@admin-bro/design-system'

export const CardBox = styled(Box)`
  position: relative;
  display: flex;
  flex-direction: row;
  min-width: 0;
  word-wrap: break-word;
  height: 100% !important;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.white};
  background-clip: border-box;
  border: 1px solid ${({ theme }) => theme.colors.grey20};
  border-radius: 0.25em;
`

export const CardBody = styled(Box)`
  flex: 1 1 auto;
  min-height: 1px;
  padding: 1.25em;
`

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
