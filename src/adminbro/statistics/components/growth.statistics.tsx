import React from 'react'

import { MainTabContainer } from '../../shared/components/Common.styled'
import {
  BiolinkStatisticsForAdminProps,
  LinkStatisticsForAdminProps,
  StatisticsForAdminsProps,
  UserStatisticsForAdminProps,
} from '../../../controllers/app/analytics.controller'
import SingleStatistics from '../../shared/components/SingleStatistics'

interface GrowthStatisticsProps {
  data?: StatisticsForAdminsProps
  userRegistrationStartDate: Date
  setUserRegistrationStartDate: React.Dispatch<React.SetStateAction<Date>>
  userRegistrationEndDate: Date
  setUserRegistrationEndDate: React.Dispatch<React.SetStateAction<Date>>
  biolinkCreationStartDate: Date
  setBiolinkCreationStartDate: React.Dispatch<React.SetStateAction<Date>>
  biolinkCreationEndDate: Date
  setBiolinkCreationEndDate: React.Dispatch<React.SetStateAction<Date>>
  linkCreationStartDate: Date
  setLinkCreationStartDate: React.Dispatch<React.SetStateAction<Date>>
  linkCreationEndDate: Date
  setLinkCreationEndDate: React.Dispatch<React.SetStateAction<Date>>
  className?: string | undefined
}

const GrowthStatistics: React.FC<GrowthStatisticsProps> = ({
  data,
  userRegistrationStartDate,
  setUserRegistrationStartDate,
  userRegistrationEndDate,
  setUserRegistrationEndDate,
  biolinkCreationStartDate,
  setBiolinkCreationStartDate,
  biolinkCreationEndDate,
  setBiolinkCreationEndDate,
  linkCreationStartDate,
  setLinkCreationStartDate,
  linkCreationEndDate,
  setLinkCreationEndDate,
  className,
}) => {
  const userChartData = (data as UserStatisticsForAdminProps)?.newRegisteredUsers?.map(
    (singleData) => ({
      x: singleData.user_createdat,
      y: singleData.user_count,
    })
  )

  const biolinkChartData = (data as BiolinkStatisticsForAdminProps)?.newBiolinks?.map(
    (singleData) => ({
      x: singleData.biolink_createdat,
      y: singleData.biolink_count,
    })
  )

  const linkChartData = (data as LinkStatisticsForAdminProps)?.newLinks?.map((singleData) => ({
    x: singleData.link_createdat,
    y: singleData.link_count,
  }))

  return (
    <MainTabContainer {...{ className }}>
      <SingleStatistics
        title="New Users Registered"
        label="Users"
        data={userChartData}
        startDate={userRegistrationStartDate}
        setStartDate={setUserRegistrationStartDate}
        endDate={userRegistrationEndDate}
        setEndDate={setUserRegistrationEndDate}
      />
      <SingleStatistics
        title="New Biolinks"
        label="Biolinks"
        data={biolinkChartData}
        startDate={biolinkCreationStartDate}
        setStartDate={setBiolinkCreationStartDate}
        endDate={biolinkCreationEndDate}
        setEndDate={setBiolinkCreationEndDate}
      />
      <SingleStatistics
        title="New Links"
        label="Links"
        data={linkChartData}
        startDate={linkCreationStartDate}
        setStartDate={setLinkCreationStartDate}
        endDate={linkCreationEndDate}
        setEndDate={setLinkCreationEndDate}
      />
    </MainTabContainer>
  )
}

export default GrowthStatistics
