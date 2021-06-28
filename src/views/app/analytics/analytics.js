import React, { Component, Fragment, useEffect, useState } from 'react'
import { injectIntl } from 'react-intl'
import { Row } from 'reactstrap'
import axios from 'axios'
import Bluebird from 'bluebird'

import { Colxx, Separator } from '../../../components/common/CustomBootstrap'
import Breadcrumb from '../../../containers/navs/Breadcrumb'

import ProfileStatuses from '../../../containers/dashboards/ProfileStatuses'
import SortableStaticticsRow from '../../../containers/dashboards/SortableStaticticsRow'
import SmallLineCharts from '../../../containers/dashboards/SmallLineCharts'
import SalesChartCard from '../../../containers/dashboards/SalesChartCard'
import ProductCategoriesDoughnut from '../../../containers/dashboards/ProductCategoriesDoughnut'
import WebsiteVisitsChartCard from '../../../containers/dashboards/WebsiteVisitsChartCard'
import ConversionRatesChartCard from '../../../containers/dashboards/ConversionRatesChartCard'
import OrderStockRadarChart from '../../../containers/dashboards/OrderStockRadarChart'
import ProductCategoriesPolarArea from '../../../containers/dashboards/ProductCategoriesPolarArea'
import OrderByMonthChartCard from '../../../containers/dashboards/OrderByMonthChartCard'
import { BASE_URL, USER_URL } from 'src/constants'
import OrderRevenueChartCard from 'src/containers/dashboards/OrderRevenueChartCard'
import RevenueInsightChartCard from 'src/containers/dashboards/RevenueInsightChartCard'
import OrderStatusChartCard from 'src/containers/dashboards/OrderStatusChartCard'
import OrderAreaChartCard from 'src/containers/dashboards/OrderAreaChartCard'
import OrderCountChartCard from 'src/containers/dashboards/OrderRevenuePieChartCard'

const ORDER_STATUS = {
  ORDERED: 'ORDERED',
  CONFIRMED: 'CONFIRMED',
  READY: 'READY',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
}

const Analytics = (props) => {
  const restaurantId = localStorage.getItem('restaurant_id')
  const merchantId = localStorage.getItem('merchant_id')
  const accessToken = localStorage.getItem('access_token')

  const [statisticType, setStatisticType] = useState('week')
  const [statisticMonth, setStatisticMonth] = useState('week')
  const [orderCountByMonth, setOrderCountByMonthData] = useState({
    labels: [],
    dataArr: [],
    labelsDataset: [],
  })
  const [orderRevenue, setOrderRevenue] = useState({
    labels: [],
    dataArr: [],
    labelsDataset: [],
  })
  const [revenueInsight, setRevenueInsight] = useState({
    labels: [],
    dataArr: [],
    labelsDataset: [],
  })
  const [orderCountInsight, setOrderCountInsight] = useState({
    labels: [],
    dataArr: [],
    labelsDataset: [],
  })
  const [ordersStatus, setOrderStatus] = useState({
    ordered: 0,
    confirmed: 0,
    ready: 0,
    completed: 0,
    cancelled: 0,
  })

  const [orderByArea, setOrderByArea] = useState({ dataArr: [], labels: [] })

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  useEffect(() => {
    fetchOrderByTime()
  }, [statisticType])

  const fetchAnalyticsData = async () => {
    fetchOrderByTime()
    fetchRevenueInsight()
    fetchOrderByArea()
    fetchAllOrder()
    fetchTopDishes()
  }

  const fetchTopDishes = async () => {
    try {
      // let restaurantId = `6587f789-8c76-4a2e-9924-c14fc30629ef` // Fixed
      let time

      const { data } = await axios({
        method: 'POST',
        url: `${USER_URL}/${merchantId}/restaurant/${restaurantId}/menu-insight`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          from: '2021-06-01',
          to: '2021-06-30',
          sortBy: 'totalOrder',
          limit: 5,
        },
      })
      if (!data) return

      // const {
      //   data: { statistics = [] },
      // } = data

      // const labels = statistics.map((item) => item.columnName)

      // const posCount = []
      // const saleCount = []
      // const allCount = []

      // const posRevenue = []
      // const saleRevenue = []
      // const allRevenue = []

      // statistics.forEach((item) => {
      //   const {
      //     columnName,
      //     allOrderCount,
      //     allOrderTotalRevenue,
      //     posOrderCount,
      //     posOrderTotalRevenue,
      //     saleOrderCount,
      //     saleOrderTotalRevenue,
      //   } = item

      //   posCount.push(posOrderCount)
      //   saleCount.push(saleOrderCount)
      //   allCount.push(allOrderCount)

      //   posRevenue.push(posOrderTotalRevenue)
      //   saleRevenue.push(saleOrderTotalRevenue)
      //   allRevenue.push(allOrderTotalRevenue)
      // })

      // setOrderCountByMonthData({
      //   labels,
      //   dataArr: [posCount, saleCount, allCount],
      //   labelsDataset: ['POS', 'Sale', 'All'],
      // })
      // setOrderRevenue({
      //   labels,
      //   dataArr: [posRevenue, saleRevenue, allRevenue],
      //   labelsDataset: ['POS', 'Sale', 'All'],
      // })
    } catch (error) {
      console.log('Error in fetchTopDishes')
      console.error(error)
    }
  }

  const fetchOrderByTime = async () => {
    try {
      // let restaurantId = `6587f789-8c76-4a2e-9924-c14fc30629ef` // Fixed
      let time
      if (statisticType === 'week') {
        time = {
          from: '2021-06-01',
          to: '2021-06-30',
        }
      } else {
        time = {
          from: '2021-06-21',
          to: '2021-06-27',
        }
      }
      const { data } = await axios({
        method: 'POST',
        url: `${USER_URL}/${merchantId}/restaurant/${restaurantId}/order-statistics`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          // from: '2021-06-01',
          // to: '2021-06-30',
          ...time,
          groupByInterval: statisticType,
        },
      })
      if (!data) return

      const {
        data: { statistics = [] },
      } = data

      const labels = statistics.map((item) => item.columnName)

      const posCount = []
      const saleCount = []
      const allCount = []

      const posRevenue = []
      const saleRevenue = []
      const allRevenue = []

      statistics.forEach((item) => {
        const {
          columnName,
          allOrderCount,
          allOrderTotalRevenue,
          posOrderCount,
          posOrderTotalRevenue,
          saleOrderCount,
          saleOrderTotalRevenue,
        } = item

        posCount.push(posOrderCount)
        saleCount.push(saleOrderCount)
        allCount.push(allOrderCount)

        posRevenue.push(posOrderTotalRevenue)
        saleRevenue.push(saleOrderTotalRevenue)
        allRevenue.push(allOrderTotalRevenue)
      })

      setOrderCountByMonthData({
        labels,
        dataArr: [posCount, saleCount, allCount],
        labelsDataset: ['POS', 'Sale', 'All'],
      })
      setOrderRevenue({
        labels,
        dataArr: [posRevenue, saleRevenue, allRevenue],
        labelsDataset: ['POS', 'Sale', 'All'],
      })
    } catch (error) {
      console.log('Error in fetchOrderByTime')
      console.error(error)
    }
  }

  const fetchRevenueInsight = async () => {
    try {
      // let restaurantId = `6587f789-8c76-4a2e-9924-c14fc30629ef` // Fixed
      const { data } = await axios({
        method: 'POST',
        url: `${USER_URL}/${merchantId}/restaurant/${restaurantId}/revenue-insight`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          from: '2021-06-01',
          to: '2021-06-30',
        },
      })
      if (!data) return

      const {
        data: { revenueInsight = {} },
      } = data

      const labelRevenueMapper = {
        actualRevenue: 'Doanh thu thực tế',
        feeTotal: 'Tổng chi phí',
        feePaid: 'Phí đã trả',
        feeBilling: 'Phí cần thanh toán',
        allOrderTotalRevenue: 'Doanh thu tất cả đơn',
        saleOrderTotalRevenue: 'Doanh thu đơn sale',
        saleOnlineOrderTotalRevenue: 'Doanh thu đơn online',
        saleCODOrderTotalRevenue: 'Doanh thu đơn COD',
        posOrderTotalRevenue: 'Doanh thu đơn POS',
      }

      const labelCountMapper = {
        feeTotal: 'Tổng chi phi',
        posOrderTotalRevenue: 'Doanh thu đơn POS',
        saleOnlineOrderTotalRevenue: 'Doanh thu đơn Online',
        saleCODOrderTotalRevenue: 'Doanh thu đơn COD',
      }

      const dataArr1 = []
      const labels1 = Object.keys(revenueInsight)
        .filter((item) => Object.keys(labelRevenueMapper).includes(item))
        .map((item) => {
          dataArr1.push(revenueInsight[item])
          return labelRevenueMapper[item]
        })
      const labelsDataset1 = Object.keys(revenueInsight)

      setRevenueInsight({
        labels: labels1,
        dataArr: dataArr1,
        labelsDataset: labelsDataset1,
      })

      const dataArr2 = []
      const labels2 = Object.keys(revenueInsight)
        .filter((item) => Object.keys(labelCountMapper).includes(item))
        .map((item) => {
          dataArr2.push(parseFloat(revenueInsight[item] / 100000).toFixed(2))
          return labelRevenueMapper[item]
        })
      const labelsDataset2 = Object.keys(revenueInsight)

      setOrderCountInsight({
        labels: labels2,
        dataArr: dataArr2,
        labelsDataset: labelsDataset2,
      })
    } catch (error) {
      console.log('Error in fetchOrderByTime')
      console.error(error)
    }
  }

  const fetchOrderByArea = async () => {
    try {
      // let restaurantId = `6587f789-8c76-4a2e-9924-c14fc30629ef`
      const { data } = await axios({
        method: 'GET',
        url: `${USER_URL}/${merchantId}/restaurant/${restaurantId}/statistic`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const {
        data: { statistic },
      } = data

      let numberArr = []
      const dataArr = []
      const labels = []

      statistic.forEach(({ areaId, areaname, cityId, cityname, numorders }) => {
        numberArr.push(parseInt(numorders))
        labels.push(areaname)
      })

      const total = numberArr.reduce((a, b) => a + b, 0)

      numberArr.forEach((item) => {
        dataArr.push([parseFloat((item / total) * 100).toFixed(2)])
      })

      setOrderByArea({
        dataArr,
        labels,
      })
    } catch (error) {
      console.log('Error in fetchOrderByArea')
      console.error(error)
    }
  }

  const fetchAllOrder = async () => {
    try {
      // let restaurantId = `6587f789-8c76-4a2e-9924-c14fc30629ef` // Fixed
      let orderArr = []
      const totalPage = new Array(3)

      await Bluebird.map(totalPage, async () => {
        const { data } = await axios({
          method: 'GET',
          url: `${BASE_URL}/order/get-all-restaurant-orders`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            restaurantId,
            query: 'ALL',
            pageNumber: 7,
            // orderStatus: ORDER_STATUS.COMPLETED,
          },
        })
        if (!data) return
        const {
          data: { orders = [] },
        } = data

        orderArr = [...orderArr, ...orders]
      })

      const cancelledOrders = []
      const confirmedOrders = []
      const readyOrders = []
      const completedeOrders = []
      const orderedOrders = []

      orderArr.forEach((order) => {
        const { status } = order
        switch (status) {
          case ORDER_STATUS.ORDERED: {
            orderedOrders.push(order)
            break
          }
          case ORDER_STATUS.CANCELLED: {
            cancelledOrders.push(order)
            break
          }
          case ORDER_STATUS.CONFIRMED: {
            confirmedOrders.push(order)
            break
          }
          case ORDER_STATUS.COMPLETED: {
            completedeOrders.push(order)
            break
          }
          case ORDER_STATUS.READY: {
            readyOrders.push(order)
            break
          }
          default: {
          }
        }
      })
      setOrderStatus({
        ordered: orderedOrders.length,
        confirmed: completedeOrders.length,
        ready: readyOrders.length,
        completed: completedeOrders.length,
        cancelled: cancelledOrders.length,
      })
    } catch (error) {
      console.log('Error in fetchAllOrders')
      console.error(error)
    }
  }

  const handleTypeChange = (value) => {
    setStatisticType(value)
  }

  const { messages } = props.intl

  const getDataArr = () => {
    const { completed, cancelled } = ordersStatus
    const total = completed + cancelled
    if (total === 0) return [0, 0]
    const completedRatio = (completed / total) * 100
    const cancelledRatio = (cancelled / total) * 100
    return [completedRatio, cancelledRatio]
  }

  return (
    <Fragment>
      <Row>
        <Colxx xxs='12'>
          <Breadcrumb heading='menu.analytics' match={props.match} />
          <Separator className='mb-5' />
        </Colxx>
      </Row>
      <Row>
        <Colxx sm='12' md='6' className='mb-4'>
          {/* <WebsiteVisitsChartCard /> */}
          <OrderByMonthChartCard
            {...orderCountByMonth}
            handleTypeChange={handleTypeChange}
          />
        </Colxx>
        <Colxx sm='12' md='6' className='mb-4'>
          {/* <ConversionRatesChartCard /> */}
          <OrderRevenueChartCard
            {...orderRevenue}
            handleTypeChange={handleTypeChange}
          />
        </Colxx>
      </Row>

      <Row>
        <Colxx sm='12' md='12' className='mb-4'>
          {/* <WebsiteVisitsChartCard /> */}
          <RevenueInsightChartCard
            {...revenueInsight}
            handleTypeChange={handleTypeChange}
          />
        </Colxx>
      </Row>

      <Row>
        <Colxx sm='12' md='6' className='mb-4'>
          <OrderStatusChartCard
            labels={['Hoàn thành đơn (%)', 'Hủy đơn (%)']}
            dataArr={getDataArr()}
            labelsDataset={['completed', 'cancelled']}
            handleTypeChange={handleTypeChange}
          />
        </Colxx>
        <Colxx sm='12' md='6' className='mb-4'>
          <OrderAreaChartCard
            {...orderByArea}
            handleTypeChange={handleTypeChange}
          />
        </Colxx>
      </Row>

      <Row>
        <Colxx sm='12' md='6' className='mb-4'>
          <OrderCountChartCard
            {...orderCountInsight}
            handleTypeChange={handleTypeChange}
          />
        </Colxx>
      </Row>

      {/* <Row>
        <Colxx xl='4' lg='6' md='12' className='mb-4'>
          <ProductCategoriesDoughnut />
        </Colxx>
        <Colxx xl='4' lg='6' md='12' className='mb-4'>
          <ProfileStatuses cardClass='dashboard-progress' />
        </Colxx>
        <Colxx xl='4' lg='12' md='12'>
          <SmallLineCharts itemClass='dashboard-small-chart-analytics' />
        </Colxx>
      </Row> */}

      {/* <SortableStaticticsRow messages={messages} /> */}

      {/* <Row>
          <Colxx xxs='12' lg='6' className='mb-4'>
            <ProductCategoriesPolarArea />
          </Colxx>
          <Colxx xxs='12' lg='6' className='mb-4'>
            <OrderStockRadarChart />
          </Colxx>
        </Row> */}

      {/* <Row>
        <Colxx xxs='12' className='mb-4'>
          <SalesChartCard day />
        </Colxx>

        <Colxx xxs='12' className='mb-4'>
          <SalesChartCard month />
        </Colxx>
      </Row> */}
    </Fragment>
  )
}
export default injectIntl(Analytics)
