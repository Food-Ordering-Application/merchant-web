import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Colxx, Separator } from '../../../components/common/CustomBootstrap'
import Bluebird from 'bluebird'
import { ORDER_URL, USER_URL } from 'src/constants'
import { accessToken } from 'mapbox-gl'
import { connect } from 'react-redux'
import { Row, Col, Button, Input } from 'reactstrap'
import { setStaffList } from '../../../redux/actions'
import DataList from './data-list'
import IntlMessages from '../../../helpers/IntlMessages'
import { NotificationManager } from 'src/components/common/react-notifications'

import './OrderList.scss'

const OrderList = (props) => {
  const merchantId = localStorage.getItem('merchant_id')
  const restaurantId = localStorage.getItem('restaurant_id')

  const [loadingOrderList, setLoadingOrderList] = useState(false)
  const [tableData, setTableData] = useState({ data: [] })
  const [selectedItems, setSelectedItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [orderList, setOrderList] = useState([])
  const [totalOrder, setTotalOrder] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [tableLoading, setTableLoading] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(7)

  const { history, staffs: staffList } = props

  useEffect(() => {
    fetchOrderList()
  }, [])

  useEffect(() => {
    mapDataToTable(currentPage - 1)
  }, [currentPage])

  useEffect(() => {
    mapDataToTable()
  }, [orderList])

  useEffect(() => {
    fetchOrderList()
    setCurrentPage(1)
  }, [currentMonth])

  const fetchOrder = async (orderId) => {
    try {
      const accessToken = localStorage.getItem('access_token')
      const { data } = await axios({
        method: 'GET',
        url: `${ORDER_URL}/${orderId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const {
        data: { order },
      } = data
      return order
    } catch (error) {
      console.log('Error in fetching order' + orderId)
      console.error(error)
      return {}
    }
  }

  const fetchOrderList = async () => {
    try {
      setLoadingOrderList(true)
      const month = currentMonth < 10 ? `0${currentMonth}` : `${currentMonth}`
      const accessToken = localStorage.getItem('access_token')
      const { data } = await axios({
        method: 'GET',
        url: `${ORDER_URL}/get-all-restaurant-orders`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          start: `2021-${month}-01`,
          end: `2021-${month}-30`,
          restaurantId, // `6587f789-8c76-4a2e-9924-c14fc30629ef`
          query: 'ALL',
          pageNumber: 1,
        },
      })

      if (!data) return
      const {
        data: { orders = [] },
      } = data

      setOrderList(orders)
      setTotalOrder(orders.length)

      // setStaffList(results, history)
    } catch (error) {
      console.log('Error in fetching order list')
      console.log(error)
    } finally {
      setLoadingOrderList(false)
    }
  }

  const mapDataToTable = async (page = 0) => {
    try {
      const pageSize = 10
      setTableLoading(true)
      const newOrderList = await Bluebird.map(
        new Array(pageSize).fill(0),
        async (_, index) => {
          try {
            const order = await fetchOrder(orderList[page * 10 + index].id)
            return order
          } catch (error) {
            return {}
          }
        }
      ).filter((item) => item.id)

      const newTableData = {
        status: true,
        totalItem: newOrderList.length,
        totalPage: Math.ceil(newOrderList.length / pageSize),
        pageSize,
        currentPage,
        data: newOrderList,
      }

      setTableData(newTableData)
    } catch (error) {
      console.error(error)
    } finally {
      setTableLoading(false)
    }
  }

  const onDeleteItems = async () => {
    try {
      setLoading(true)
      const accessToken = localStorage.getItem('access_token')

      await Bluebird.map(selectedItems, async (staffId) => {
        const { data } = await axios({
          method: 'DELETE',
          url: `${USER_URL}/${merchantId}/restaurant/${restaurantId}/staff/${staffId}`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        if (!data) return
      })

      setTableData((prevState) => {
        return {
          ...prevState,
          data: prevState.data.filter(
            (item) => !selectedItems.includes(item.id)
          ),
        }
      })
      NotificationManager.success(
        `Deleted ${selectedItems.length} staffs!`,
        'Success',
        3000
      )
      // getMenuItems({ merchantId, restaurantId, menuId })
    } catch (error) {
      console.log('Error in Delete Menu Items')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const onSelect = (ids) => {
    setSelectedItems(ids)
  }

  const redirectToCreateStaff = () => {
    history.push('/app/staffs/create')
  }

  const onPageChange = (page) => {
    console.log(page)
    setCurrentPage(page)
  }

  const onTimeSelect = (month) => {
    console.log(month)

    setCurrentMonth(month)
  }

  if (loadingOrderList) {
    return <div className='loading'></div>
  }

  // if (tableData.data.length === 0) {
  //   return (
  //     <div>
  //       <p>Hiện tại chưa có đơn hàng nào!</p>
  //     </div>
  //   )
  // }

  return (
    <div className='OrderList'>
      <Row>
        <Colxx xxs='12' className='mb-4'>
          {tableData.data.length > 0 && (
            <DataList
              history={history}
              data={tableData}
              // onDeleteItems={onDeleteItems}
              // onSelect={onSelect}
              totalPage={Math.ceil(totalOrder / 10)}
              currentPage={currentPage}
              onPageChange={onPageChange}
              loading={tableLoading}
              onTimeSelect={onTimeSelect}
              time={currentMonth}
            />
          )}
        </Colxx>
      </Row>
    </div>
  )
}

const mapStateToProps = ({ staffUser: { staffs, loadingStaffList } }) => ({
  staffs,
  loadingStaffList,
})

export default connect(mapStateToProps, { setStaffList })(OrderList)
