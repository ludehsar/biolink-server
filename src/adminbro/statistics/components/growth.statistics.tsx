import React from 'react'

import { MainTabContainer } from '../../shared/components/Common.styled'

interface GrowthStatisticsProps {
  className?: string | undefined
}

const GrowthStatistics: React.FC<GrowthStatisticsProps> = ({ className }) => {
  return <MainTabContainer {...{ className }}>Hello</MainTabContainer>
}

export default GrowthStatistics
