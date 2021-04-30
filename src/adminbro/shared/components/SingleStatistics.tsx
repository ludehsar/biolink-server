import React from 'react'
import { DatePicker } from '@admin-bro/design-system'
import { Line } from 'react-chartjs-2'
import moment from 'moment'

import { Col6, Container, Row, Title } from './Common.styled'

interface NewUsersStatisticsProps {
  title: string
  label: string
  data?: {
    y: number
    x: Date
  }[]
  startDate: Date
  setStartDate: React.Dispatch<React.SetStateAction<Date>>
  endDate: Date
  setEndDate: React.Dispatch<React.SetStateAction<Date>>
}

const options = {
  responsive: true,
  scales: {
    xAxes: [
      {
        display: true,
        type: 'time',
        distribution: 'linear',
      },
    ],
  },
}

const SingleStatistics: React.FC<NewUsersStatisticsProps> = ({
  title,
  label,
  data,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  const onStartDateChange = (date: string): void => {
    setStartDate(moment(date).toDate())
  }

  const onEndDateChange = (date: string): void => {
    setEndDate(moment(date).toDate())
  }

  return (
    <Container pb={60}>
      <Title>{title}</Title>
      <Row mb={30}>
        <Col6 p={10}>
          <DatePicker
            selected={startDate}
            onChange={onStartDateChange}
            value={startDate.toString()}
            showTimeInput={true}
          />
        </Col6>
        <Col6 p={10}>
          <DatePicker
            selected={endDate}
            onChange={onEndDateChange}
            minDate={startDate}
            value={endDate.toString()}
            showTimeInput={true}
          />
        </Col6>
      </Row>
      <Line
        type="line"
        data={{
          datasets: [
            {
              label,
              data,
              fill: false,
              backgroundColor: '#77acf1',
              borderColor: '#3edbf0',
            },
          ],
        }}
        options={options}
      />
    </Container>
  )
}

export default SingleStatistics
