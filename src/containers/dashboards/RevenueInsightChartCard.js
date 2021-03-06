import React, { useState } from 'react'
// import zoom from 'chartjs-plugin-zoom'

import {
  Card,
  CardBody,
  CardTitle,
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Dropdown,
} from 'reactstrap'

import IntlMessages from '../../helpers/IntlMessages'
import { BarChart } from '../../components/charts'
import Select from 'react-select'

import './RevenueInsightChartCard.scss'

const barChartData2 = {
  labels: ['a', 'b', 'c', 'd', 'e'],
  datasets: [
    {
      label: 'My First Dataset',
      data: [65, 59, 80, 81, 56, 55, 40],
      //   data: [400, 500, 600, 700, 900],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)',
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)',
      ],
      borderWidth: 1,
    },
    {
      label: 'My Second Dataset',
      data: [55, 49, 20, 71, 86, 35, 30],
      //   data: [400, 500, 600, 700, 900],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)',
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)',
      ],
      borderWidth: 1,
    },
  ],
}

const BACKGROUND_COLOR_1 = [
  'rgba(255, 99, 132, 0.6)',
  'rgba(255, 159, 64, 0.6)',
  'rgba(255, 205, 86, 0.6)',
  'rgba(75, 192, 192, 0.6)',
  'rgba(54, 162, 235, 0.6)',
  'rgba(153, 102, 255, 0.6)',
  'rgba(201, 203, 207, 0.6)',
]

const BORDER_COLOR_1 = [
  'rgb(255, 99, 132)',
  'rgb(255, 159, 64)',
  'rgb(255, 205, 86)',
  'rgb(75, 192, 192)',
  'rgb(54, 162, 235)',
  'rgb(153, 102, 255)',
  'rgb(201, 203, 207)',
]

const BACKGROUND_COLORS = [
  'rgba(255, 99, 132, 0.6)',
  'rgba(255, 205, 86, 0.6)',
  'rgba(75, 192, 192, 0.6)',
]
const BORDER_COLORS = [
  'rgba(255, 99, 132)',
  'rgba(255, 205, 86)',
  'rgba(75, 192, 192)',
]

const selectOptions = [
  { label: 'Tu???n n??y', value: 'week' },
  { label: 'Th??ng n??y', value: 'day' },
]

const selectMonthOptions = [
  { label: 'Th??ng 1', value: '1' },
  { label: 'Th??ng 2', value: '2' },
  { label: 'Th??ng 3', value: '3' },
  { label: 'Th??ng 4', value: '4' },
  { label: 'Th??ng 5', value: '5' },
  { label: 'Th??ng 6', value: '6' },
  { label: 'Th??ng 7', value: '7' },
  { label: 'Th??ng 8', value: '8' },
  { label: 'Th??ng 9', value: '9' },
  { label: 'Th??ng 10', value: '10' },
  { label: 'Th??ng 11', value: '11' },
  { label: 'Th??ng 12', value: '12' },
]

const RevenueInsightChartCard = (props) => {
  const { labels, data, dataArr, labelsDataset, options } = props

  const [dropdownOpen, setDropdownOpen] = useState(false)

  const toggle = () => setDropdownOpen((prevState) => !prevState)

  let chartData = {
    labels: labels.map((item) => item.replace('-', `/`)),
    // labels: 'hihi',
    // labels: '',
    datasets: [
      {
        // label: 'hihi',
        data: dataArr.map((item) => parseFloat(item / 100000).toFixed(2)),
        backgroundColor: 'rgb(0, 191, 250, 0.6)',
        borderColor: 'rgb(0, 191, 250)',
        borderWidth: 1,
      },
    ],
  }

  // chartData.datasets = chartData.datasets.map((item, index) => {
  //   return {
  //     ...item,
  //     backgroundColor: BACKGROUND_COLORS[index],
  //     borderColor: BORDER_COLORS[index],
  //     borderWidth: 1,
  //   }
  // })

  const onTimeChange = ({ value }) => {
    const { handleTimeChange } = props
    handleTimeChange(value)
  }

  return (
    <Card className='h-100 RevenueInsightChartCard'>
      <CardBody>
        <CardTitle>
          <IntlMessages id='analytics.revenue-insight' />
          {' (tri???u ?????ng)'}
        </CardTitle>

        <div className='select-group-control'>
          {/* <Select
            className='select-week-day my-react-select'
            classNamePrefix='my-select'
            value={selectOptions.filter((option) => option.value === 'week')}
            onChange={onSelectChange}
            options={selectOptions}
          /> */}

          <Select
            classNamePrefix='my-select'
            className='select-month my-react-select'
            value={selectMonthOptions.filter(
              (option) => +option.value === +props.month
            )}
            onChange={onTimeChange}
            options={selectMonthOptions}
          />
        </div>

        <div className='chart-container'>
          {labels.length === 0 ? (
            //   {true ? (
            <div className='chart-loading no-select '></div>
          ) : (
            <BarChart
              //   data={barChartData}
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                  display: false,
                },
                // width: '400px',
                // height: '400px',
                tooltips: {
                  callbacks: {
                    label: function (tooltipItem) {
                      return tooltipItem.yLabel
                    },
                  },
                },
              }}
            />
          )}
        </div>
      </CardBody>
    </Card>
  )
}

export default RevenueInsightChartCard
