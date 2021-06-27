import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Card, CardBody, CardTitle } from 'reactstrap'
import axios from 'axios'

import { getMenuItems } from '../../../redux/actions'
import { Colxx, Separator } from '../../../components/common/CustomBootstrap'

import './MenuItemDetail.scss'

const MenuItemDetail = (props) => {
  const {
    product,
    restaurantMenu: { menuItems, menuGroup },
    getMenuItems,
  } = props
  const merchantId = localStorage.getItem('merchant_id')
  const restaurantId = localStorage.getItem('restaurant_id')

  const [menuItem, setMenuItem] = useState({})

  useEffect(() => {
    if (menuItems.length > 0) {
      console.log(menuItems)
    } else {
      const path = window.location.href.split('/')

      const menuId = path[path.length - 3]
      console.log(path)
      getMenuItems({ merchantId, restaurantId, menuId })
    }
    const accessToken = localStorage.getItem('access_token')
  }, [])

  useEffect(() => {
    if (menuItems.length === 0) return
    const path = window.location.href.split('/')
    const menuItemId = path[path.length - 1]
    const foundMenuItem = menuItems.find(({ id }) => id === menuItemId)
    setMenuItem(foundMenuItem)
  }, [menuItems])

  // if (menuItems.length === 0 || !menuItem.id ) {
  //   return <div className='loading'></div>
  // }

  return (
    <div className='ProductDetail'>
      <p className='title'>Bún Thịt nướng</p>
      <Separator className='mb-4 mt-3' />
      <Row>
        <Colxx md='8'>
          <Card>
            <CardBody>
              <div className='product-img'>
                <img
                  src='https://firebasestorage.googleapis.com/v0/b/merchant-dashboard-5c894.appspot.com/o/images%2Fcach-lam-bun-thit-nuong-tai-nha-don-gian-dam-da-thom-ngon-nuc-mui-2-760x367.jpeg?alt=media&token=1262a330-c423-4de7-a8f6-c8cdc6c2c794'
                  alt=''
                />
              </div>
              {/* <div className='content'>{JSON.stringify(menuItem)}</div> */}
            </CardBody>
          </Card>
        </Colxx>
        <Colxx md='4'></Colxx>
      </Row>

      <Row className='mt-4'>
        <Colxx md='8'>
          <Card>
            <CardBody>
              <div className='section'>
                <p className='section-heading'>Mô tả</p>
                <p>Bún thịt nướng thập cẩm gồm: thịt, chả, nem, rau sống</p>
              </div>

              <div className='section'>
                <p className='section-heading'>
                  Giá: <span className='text-orange'>45000đ</span>
                </p>
              </div>

              <div className='section'>
                <p className='section-heading'>Đang kích hoạt</p>
              </div>

              <div className='section'>
                <p className='section-heading'>
                  Trạng thái: <span className='font-weight-500'>Còn hàng</span>
                </p>
              </div>
            </CardBody>
          </Card>
        </Colxx>
      </Row>
    </div>
  )
}

const mapStateToProps = ({ restaurantInfo, restaurantMenu }) => ({
  restaurantInfo,
  restaurantMenu,
})

// export default connect(mapStateToProps, mapDispatchToProps)(MenuItemDetail)
export default connect(mapStateToProps, { getMenuItems })(MenuItemDetail)
