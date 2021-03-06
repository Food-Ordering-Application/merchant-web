import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Card, CardBody, CardTitle, Button } from 'reactstrap'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { getToppingItems, getMenus, getMenuGroup } from '../../../redux/actions'
import { Colxx, Separator } from '../../../components/common/CustomBootstrap'

import './MenuGroupDetail.scss'

const MenuGroupDetail = (props) => {
  const { id: menuGroupId } = useParams()
  const {
    product,
    restaurantMenu: { menus = [], menuGroup = [], toppingItems },
    getMenuGroup,
    history,
  } = props
  const merchantId = localStorage.getItem('merchant_id')
  const restaurantId = localStorage.getItem('restaurant_id')

  const [loading, setLoading] = useState(false)

  const [menuGroupDetail, setMenuGroupDetail] = useState({})

  useEffect(() => {
    if (menuGroup.length === 0 && menus.length === 0) {
      setLoading(true)
      const { getMenus } = props
      getMenus(merchantId, restaurantId)
    }
  }, [])

  useEffect(() => {
    if (menus.length === 0) return

    setLoading(false)
    if (menuGroup.length > 0) {
      return
    } else {
      const menuId = menus[0].id
      getMenuGroup({ merchantId, restaurantId, menuId })
    }
  }, [menus])

  useEffect(() => {
    if (menuGroup.length === 0) return
    const foundMenuGroup = menuGroup.find(({ id }) => id === menuGroupId)
    setMenuGroupDetail(foundMenuGroup)
  }, [menuGroup])

  const redirecToEditMenuGroup = () => {
    const menuId = menus[0].id
    history.push(`/app/menu-group/edit/${menuGroupId}`)
  }

  if (Object.keys(menuGroupDetail).length === 0) {
    return <div className='loading'></div>
  }

  return (
    <div className='MenuGroupDetail'>
      <p className='title'>
        {menuGroupDetail.name} <i className></i>{' '}
      </p>
      <Separator className='mb-4 mt-3' />

      <Row className='mt-4'>
        <Colxx md='6' className=''>
          <Card>
            <CardBody>
              <div className='section'>
                <p className='section-heading'>
                  Ch??? s???:{' '}
                  <span className='font-weight-500'>
                    {menuGroupDetail.index}
                  </span>
                </p>
              </div>

              <div className='section'>
                <p className='section-heading'>
                  Tr???ng th??i:{' '}
                  <span className='font-weight-500'>
                    {menuGroupDetail.isActive ? '??ang k??ch ho???t' : '??ang ???n'}
                  </span>
                </p>
              </div>

              <Button
                color='primary'
                style={{ marginLeft: 'auto', display: 'block' }}
                onClick={redirecToEditMenuGroup}
              >
                Ch???nh s???a
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
})(MenuGroupDetail)
