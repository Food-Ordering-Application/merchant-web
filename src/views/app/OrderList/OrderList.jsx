import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Colxx, Separator } from '../../../components/common/CustomBootstrap'
import Bluebird from 'bluebird'
import { ORDER_URL, USER_URL } from 'src/constants'
import { accessToken } from 'mapbox-gl'
import { connect } from 'react-redux'
import { Row, Col, Button } from 'reactstrap'
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
  const { history, staffs: staffList } = props

  useEffect(() => {
    fetchOrderList()
  }, [])

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
      console.log(order)
      return order
    } catch (error) {
      console.log('Error in fetching order' + orderId)
      console.log(error)
      return {}
    }
  }

  const fetchOrderList = async () => {
    try {
      setLoadingOrderList(true)
      const accessToken = localStorage.getItem('access_token')
      const { data } = await axios({
        method: 'GET',
        url: `${ORDER_URL}/get-all-restaurant-orders`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          start: '2021-05-22',
          end: '2021-07-22',
          restaurantId: `6587f789-8c76-4a2e-9924-c14fc30629ef`,
          query: 'ALL',
          pageNumber: 1,
        },
      })

      if (!data) return
      console.log(data)
      const {
        data: { orders = [] },
      } = data

      const { setOrderList } = props

      const pageSize = 10

      const newOrderList = await Bluebird.map(
        new Array(pageSize).fill(0),
        async (_, index) => {
          const order = await fetchOrder(orders[index].id)
          return order
        }
      )
      console.log(newOrderList)
      // const pageSize = size
      const newTableData = {
        status: true,
        totalItem: newOrderList.length,
        totalPage: Math.ceil(newOrderList.length / pageSize),
        pageSize,
        currentPage: '1',
        data: newOrderList,
      }

      setTableData(newTableData)
      // setStaffList(results, history)
    } catch (error) {
      console.log('Error in fetching staff list')
      console.log(error)
    } finally {
      setLoadingOrderList(false)
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

  if (loadingOrderList) {
    return <div className='loading'></div>
  }

  if (tableData.data.length === 0) {
    return (
      <div>
        <p>Nhà hàng chưa có đơn hàng nào!</p>
        {/* <Button
          color='primary'
          size='lg'
          className='top-right-button mr-2'
          onClick={redirectToCreateStaff}
        >
          <IntlMessages id='pages.add-new' />
        </Button> */}
      </div>
    )
  }

  return (
    <div className='OrderList'>
      <Row>
        <Colxx xxs='12'>
          <Separator className='mb-5' />
        </Colxx>
      </Row>
      <Row>
        <Colxx xxs='12' className='mb-4'>
          {tableData.data.length > 0 && (
            <DataList
              history={history}
              data={tableData}
              onDeleteItems={onDeleteItems}
              onSelect={onSelect}
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
