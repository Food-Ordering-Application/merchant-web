import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Card, CardBody, CardTitle, Button } from 'reactstrap'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import {
  getToppingItems,
  getMenus,
  getMenuGroup,
  getToppingGroup,
} from '../../../redux/actions'
import { Colxx, Separator } from '../../../components/common/CustomBootstrap'

import './ToppingGroupDetail.scss'

const ToppingGroupDetail = (props) => {
  const { id: toppingGroupId } = useParams()
  const {
    product,
    restaurantMenu: {
      menus = [],
      menuGroup = [],
      toppingItems,
      toppingGroups = [],
    },
    getMenuGroup,
    getToppingGroup,
    history,
  } = props
  const merchantId = localStorage.getItem('merchant_id')
  const restaurantId = localStorage.getItem('restaurant_id')

  const [loading, setLoading] = useState(false)

  const [toppingGroupDetail, setToppingGroupDetail] = useState({})

  useEffect(() => {
    if (toppingGroups.length === 0 && menus.length === 0) {
      setLoading(true)
      const { getMenus } = props
      getMenus(merchantId, restaurantId)
    }
  }, [])

  useEffect(() => {
    if (menus.length === 0) return

    setLoading(false)
    if (toppingGroups.length > 0) {
      return
    } else {
      const menuId = menus[0].id
      getToppingGroup({ merchantId, restaurantId, menuId })
    }
  }, [menus])

  useEffect(() => {
    if (toppingGroups.length === 0) return
    const foundToppingGroup = toppingGroups.find(
      ({ id }) => id === toppingGroupId
    )
    setToppingGroupDetail(foundToppingGroup)
  }, [toppingGroups])

  const redirecToEditMenuGroup = () => {
    const menuId = menus[0].id
    history.push(`/app/topping-group/edit/${toppingGroupId}`)
  }

  if (Object.keys(toppingGroupDetail).length === 0) {
    return <div className='loading'></div>
  }

  return (
    <div className='ToppingGroupDetail'>
      <p className='title'>
        {toppingGroupDetail.name} <i className></i>{' '}
      </p>
      <Separator className='mb-4 mt-3' />

      <Row className='mt-4'>
        <Colxx md='6' className=''>
          <Card>
            <CardBody>
              <div className='section'>
                <p className='section-heading'>
                  Chỉ số:{' '}
                  <span className='font-weight-500'>
                    {toppingGroupDetail.index}
                  </span>
                </p>
              </div>

              <div className='section'>
                <p className='section-heading'>
                  Trạng thái:{' '}
                  <span className='font-weight-500'>
                    {toppingGroupDetail.isActive ? 'Đang kích hoạt' : 'Đang ẩn'}
                  </span>
                </p>
              </div>

              <Button
                color='primary'
                style={{ marginLeft: 'auto', display: 'block' }}
                onClick={redirecToEditMenuGroup}
              >
                Chỉnh sửa
              </Button>
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
export default connect(mapStateToProps, {
  getMenus,
  getMenuGroup,
  getToppingGroup,
})(ToppingGroupDetail)
