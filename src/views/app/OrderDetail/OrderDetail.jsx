import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Row, Card, CardBody } from 'reactstrap'
import { BASE_URL } from 'src/constants'
import moment from 'moment'
import { Colxx } from '../../../components/common/CustomBootstrap'

import { PAYMENT_STATUS_MAPPER, STATUS_MAPPER } from 'src/helpers/Utils'

import './OrderDetail.scss'

const ToppingItem = ({ name, price, quantity }) => {
  return (
    <div style={{ marginBottom: 20, marginLeft: 40 }}>
      <p>
        <span>- {name}</span> <span>Giá: {price}đ</span>{' '}
        <span> Số lượng: {quantity}</span>
      </p>
    </div>
  )
}

const OrderItem = ({
  discount,
  name,
  price,
  quantity,
  subTotal,
  orderItemToppings,
}) => {
  return (
    <Card style={{ marginBottom: 20 }}>
      <CardBody>
        <p className='d-flex align-items-center'>
          <span
            class='iconify icon'
            data-icon='emojione:face-savoring-food'
            data-inline='false'
            data-width='22'
            data-height='22'
          ></span>
          <span className='bold'> Món: {name}</span>
        </p>
        <p>
          <span>Giá: {price}đ</span> <span> Số lượng: {quantity}</span>
        </p>

        {orderItemToppings.map((item) => (
          <ToppingItem {...item} key={item.id} />
        ))}
        <p>Tổng tiền: {subTotal}đ</p>
      </CardBody>
    </Card>
  )
}

const OrderDetail = (props) => {
  const { id: orderIdParam } = useParams()
  const [orderDetail, setOrderDetail] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    console.log('DID MOUNT')
    fetchOrderData()
  }, [])

  const fetchOrderData = async () => {
    console.log('fetch')
    setLoading(true)
    const order = await getOrder(orderIdParam)
    if (!order) return
    console.log(order)
    const newOrderDetail = {
      id: order.id,
      createdAt: moment(order.createdAt).format('hh:mm:ss DD/MM/YYYY'),
      invoice: order.invoice,
      orderItems: order.orderItems,
      grandTotal: order.grandTotal,
      status: order.status,
    }
    console.log(newOrderDetail)
    // console.log('detail:', newOrderDetail)
    setOrderDetail(newOrderDetail)
    setLoading(false)
  }

  const getOrder = async (orderId) => {
    const accessToken = await localStorage.getItem('access_token')
    try {
      const { data } = await axios({
        method: 'GET',
        url: `${BASE_URL}/order/${orderId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const {
        data: { order },
      } = data
      return order
    } catch (error) {
      console.log('Error in getOrder')
      console.error(error)
      return null
    }
  }

  if (loading) {
    return <div className='loading'></div>
  }

  if (!orderDetail.id) {
    return (
      <div className='OrderDetail'>
        <p>Đơn hàng này bị lỗi hoặc không tồn tại.</p>
      </div>
    )
  }

  const {
    invoice: {
      payment: { method, status: paymentStatus },
    },
    orderItems,
  } = orderDetail

  return (
    <div className='OrderDetail'>
      <Row style={{ marginBottom: 20 }}>
        <Colxx md='12'>
          <Card>
            <CardBody>
              {/* <p>{JSON.stringify(orderDetail, null, '\t')}</p> */}

              <p>
                <span className='bold'>Thời điểm tạo đơn:</span>{' '}
                {orderDetail.createdAt}
              </p>
              <p>
                <span className='bold'>Tổng tiền:</span>{' '}
                {orderDetail.grandTotal}đ
              </p>
              <p>
                <span className='bold'>Trạng thái:</span>{' '}
                {STATUS_MAPPER[orderDetail.status]}
              </p>

              <p>
                <span className='bold'> Phương thức thanh toán:</span> {method}{' '}
                - Trạng thái: {PAYMENT_STATUS_MAPPER[paymentStatus]}
              </p>
            </CardBody>
          </Card>
        </Colxx>
      </Row>

      <Row style={{ marginLeft: 30 }}>
        <Colxx md='12'>
          {orderItems.map((orderItem) => (
            <OrderItem {...orderItem} key={orderItem.id} />
          ))}
        </Colxx>
      </Row>
    </div>
  )
}

export default OrderDetail
