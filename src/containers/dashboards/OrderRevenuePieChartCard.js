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

import './OrderRevenuePieChartCard.scss'
import Pie from 'src/components/charts/Pie'

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

const selectOptions = [
  { label: 'Tuần này', value: 'week' },
  { label: 'Tháng này', value: 'day' },
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

const OrderRevenuePieChartCard = (props) => {
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

  const onSelectChange = ({ value }) => {
    const { handleTypeChange } = props
    handleTypeChange(value)
  }

  return (
    <Card className='h-100 OrderRevenuePieChartCard'>
      <CardBody>
        <CardTitle>
          <IntlMessages id='analytics.revenue-by-order-type' />
          {' (triệu đồng)'}
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
            value={selectMonthOptions.filter((option) => option.value === '6')}
            onChange={onSelectChange}
            options={selectMonthOptions}
          />
        </div>

        <div className='chart-container'>
          {labels.length === 0 ? (
            //   {true ? (
            <div className='chart-loading no-select '></div>
          ) : (
            <Pie
              type='pie'
              data={{
                labels,
                datasets: [
                  {
                    label: 'My First Dataset',
                    data: dataArr,
                    backgroundColor: [
                      'rgb(255, 99, 132)',
                      'rgb(75, 192, 192)',
                      'rgb(255, 205, 86)',
                      'rgb(54, 162, 235)',
                      '#F5BAAB',
                      '#FC9944',
                      '#6CFF00',
                      '#A600FF',
                      '#FF00B0',
                    ],
                    hoverOffset: 4,
                  },
                ],
              }}
            />
          )}
        </div>
      </CardBody>
    </Card>
  )
}

export default OrderRevenuePieChartCard
