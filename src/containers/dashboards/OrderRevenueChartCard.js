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
import { AreaChart } from '../../components/charts'

import './OrderRevenueChartCard.scss'
import { ThemeColors } from 'src/helpers/ThemeColors'
import { chartTooltip } from 'src/components/charts/util'

const selectOptions = [
  { label: 'Tháng này', value: 'week' },
  { label: 'Tuần này', value: 'day' },
]

const selectMonthOptions = [
  { label: 'Tháng 1', value: '1' },
  { label: 'Tháng 2', value: '2' },
  { label: 'Tháng 3', value: '3' },
  { label: 'Tháng 4', value: '4' },
  { label: 'Tháng 5', value: '5' },
  { label: 'Tháng 6', value: '6' },
  { label: 'Tháng 7', value: '7' },
  { label: 'Tháng 8', value: '8' },
  { label: 'Tháng 9', value: '9' },
  { label: 'Tháng 10', value: '10' },
  { label: 'Tháng 11', value: '11' },
  { label: 'Tháng 12', value: '12' },
]

const colors = ThemeColors()

const conversionChartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Hello',
      data: [65, 60, 68, 60, 58, 63, 60],
      borderColor: colors.themeColor2,
      pointBackgroundColor: colors.foregroundColor,
      pointBorderColor: colors.themeColor2,
      pointHoverBackgroundColor: colors.themeColor2,
      pointHoverBorderColor: colors.foregroundColor,
      pointRadius: 4,
      pointBorderWidth: 2,
      pointHoverRadius: 5,
      fill: true,
      borderWidth: 2,
      backgroundColor: colors.themeColor2_10,
    },
    {
      label: '',
      data: [10, 6, 28, 40, 48, 73, 10],
      borderColor: colors.themeColor2,
      pointBackgroundColor: colors.foregroundColor,
      pointBorderColor: colors.themeColor2,
      pointHoverBackgroundColor: colors.themeColor2,
      pointHoverBorderColor: colors.foregroundColor,
      pointRadius: 4,
      pointBorderWidth: 2,
      pointHoverRadius: 5,
      fill: true,
      borderWidth: 2,
      backgroundColor: colors.themeColor2_10,
    },
  ],
}

let defaultData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'POS',
      // data: [65, 60, 68, 60, 58, 63, 60],
      borderColor: colors.themeColor2,
      pointBackgroundColor: colors.foregroundColor,
      pointBorderColor: colors.themeColor2,
      pointHoverBackgroundColor: colors.themeColor2,
      pointHoverBorderColor: colors.foregroundColor,
      pointRadius: 4,
      pointBorderWidth: 2,
      pointHoverRadius: 5,
      fill: true,
      borderWidth: 2,
      backgroundColor: colors.themeColor2_10,
    },
    {
      label: 'Sale',
      // data: [10, 6, 28, 40, 48, 73, 10],
      borderColor: 'rgba(255, 205, 86)',
      pointBackgroundColor: colors.foregroundColor,
      pointBorderColor: 'rgba(255, 205, 86)',
      pointHoverBackgroundColor: 'rgba(255, 205, 86)',
      pointHoverBorderColor: colors.foregroundColor,
      pointRadius: 4,
      pointBorderWidth: 2,
      pointHoverRadius: 5,
      fill: true,
      borderWidth: 2,
      backgroundColor: 'rgba(255, 205, 86, 0.6)',
    },
    {
      label: 'All',
      // data: [10, 6, 28, 40, 48, 73, 10],
      borderColor: colors.themeColor2,
      pointBackgroundColor: colors.foregroundColor,
      pointBorderColor: colors.themeColor2,
      pointHoverBackgroundColor: colors.themeColor2,
      pointHoverBorderColor: colors.foregroundColor,
      pointRadius: 4,
      pointBorderWidth: 2,
      pointHoverRadius: 5,
      fill: true,
      borderWidth: 2,
      backgroundColor: colors.themeColor2_10,
    },
  ],
}

const OrderRevenueChartCard = (props) => {
  const { labels, data, dataArr, labelsDataset, options } = props

  const [dropdownOpen, setDropdownOpen] = useState(false)

  const toggle = () => setDropdownOpen((prevState) => !prevState)

  let chartData = {
    labels: labels.map((item) => item.replace('-', `/`)),
    datasets: [
      {
        label: labelsDataset[0],
        data: dataArr[0],

        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: colors.foregroundColor,
        pointBorderColor: 'rgb(255, 99, 132)',
        pointHoverBackgroundColor: 'rgb(255, 99, 132)',
        pointHoverBorderColor: colors.foregroundColor,
        pointRadius: 4,
        pointBorderWidth: 2,
        pointHoverRadius: 5,
        fill: true,
        borderWidth: 2,
        backgroundColor: 'rgb(255, 99, 132, 0.6)',
        // backgroundColor: 'transparent',
      },
      {
        label: labelsDataset[1],
        data: dataArr[1],

        borderColor: 'rgba(255, 205, 86)',
        pointBackgroundColor: colors.foregroundColor,
        pointBorderColor: 'rgba(255, 205, 86)',
        pointHoverBackgroundColor: 'rgba(255, 205, 86)',
        pointHoverBorderColor: colors.foregroundColor,
        pointRadius: 4,
        pointBorderWidth: 2,
        pointHoverRadius: 5,
        fill: true,
        borderWidth: 2,
        backgroundColor: 'rgba(255, 205, 86, 0.6)',
        // backgroundColor: 'transparent',
      },
      {
        label: labelsDataset[2],
        data: dataArr[2],

        borderColor: 'rgba(75, 192, 192)',
        pointBackgroundColor: colors.foregroundColor,
        pointBorderColor: 'rgba(75, 192, 192)',
        pointHoverBackgroundColor: 'rgba(75, 192, 192)',
        pointHoverBorderColor: colors.foregroundColor,
        pointRadius: 4,
        pointBorderWidth: 2,
        pointHoverRadius: 5,
        fill: true,
        borderWidth: 2,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  }

  chartData.datasets = chartData.datasets.map((item, index) => {
    let { data } = item
    if (data) data = data.map((item) => parseFloat(item / 1000000).toFixed(2))
    return {
      ...item,
      data: data || 0,
    }
  })

  // chartData.datasets = chartData.datasets.map((item, index) => {
  //   let { data } = item
  //   if (data) data = data.map((item) => parseFloat(item / 1000000).toFixed(2))
  //   return {
  //     ...item,
  //     data: data || 0,
  //     // data: item.data.map((item) => parseFloat(item / 1000).toFixed(0)),
  //     backgroundColor: BACKGROUND_COLORS[index],
  //     borderColor: BORDER_COLORS[index],
  //     borderWidth: 1,
  //   }
  // })

  const onSelectChange = ({ value }) => {
    const { handleTypeChange } = props
    handleTypeChange(value)
  }

  const onTimeChange = ({ value }) => {
    const { handleTimeChange } = props
    handleTimeChange(value)
  }

  return (
    <Card className='h-100 OrderRevenueChartCard'>
      <CardBody>
        <CardTitle>
          <IntlMessages id='analytics.order-revenue' /> {' (triệu đồng)'}
        </CardTitle>

        <div className='select-group-control'>
          <Select
            className='select-week-day my-react-select'
            classNamePrefix='my-select'
            value={selectOptions.filter(
              (option) => option.value === props.type
            )}
            onChange={onSelectChange}
            options={selectOptions}
          />

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
            // <BarChart
            //   //   data={barChartData}
            //   data={chartData}
            //   // options={options}
            //   options={{
            //     scales: {
            //       yAxes: [
            //         {
            //           display: true,
            //           ticks: {
            //             min: 500,
            //             beginAtZero: true, // minimum value will be 0.
            //           },
            //         },
            //       ],
            //     },
            //   }}
            // />
            <AreaChart
              options={{
                legend: {
                  display: false,
                },
                responsive: true,
                maintainAspectRatio: false,
                tooltips: chartTooltip,
                scales: {
                  yAxes: [
                    {
                      gridLines: {
                        display: true,
                        lineWidth: 1,
                        color: 'rgba(0,0,0,0.1)',
                        drawBorder: false,
                      },
                      ticks: {
                        beginAtZero: true,
                        stepSize: 0.2,
                        min: 0,
                        // max: 70,
                        padding: 20,
                      },
                    },
                  ],
                  xAxes: [
                    {
                      gridLines: {
                        display: false,
                      },
                    },
                  ],
                },
              }}
              shadow
              data={chartData}
            />
          )}
        </div>
      </CardBody>
    </Card>
  )
}

export default OrderRevenueChartCard
