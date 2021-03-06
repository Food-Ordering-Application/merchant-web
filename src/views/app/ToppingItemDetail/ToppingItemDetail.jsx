import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Card, CardBody, CardTitle, Button } from 'reactstrap'
import axios from 'axios'

import { getToppingItems, getMenus } from '../../../redux/actions'
import { Colxx, Separator } from '../../../components/common/CustomBootstrap'

import './ToppingItemDetail.scss'

const ToppingItemDetail = (props) => {
  const {
    product,
    restaurantMenu: { menus = [], menuGroup, toppingItems },
    getToppingItems,
  } = props
  const merchantId = localStorage.getItem('merchant_id')
  const restaurantId = localStorage.getItem('restaurant_id')

  const [toppingItem, setToppingItem] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (menus.length === 0) {
      setLoading(true)
      const { getMenus } = props
      getMenus(merchantId, restaurantId)
    }
  }, [])

  useEffect(() => {
    if (menus.length === 0) return

    setLoading(false)
    if (toppingItems.length > 0) {
      console.log(toppingItems)
    } else {
      const menuId = menus[0].id
      getToppingItems({ merchantId, restaurantId, menuId })
    }
  }, [menus])

  useEffect(() => {
    if (toppingItems.length === 0) return
    const path = window.location.href.split('/')
    const menuItemId = path[path.length - 1]
    const foundMenuItem = toppingItems.find(({ id }) => id === menuItemId)
    setToppingItem(foundMenuItem)
  }, [toppingItems])

  const redirecToEditTopping = () => {
    const path = window.location.pathname
    const toppingItemId = toppingItem.id
    const menuId = menus[0].id
    let editPath = path.split('/toppings/')
    editPath = `${editPath[0]}/toppings/${menuId}/edit/${toppingItemId}`
    window.location.replace(editPath)
  }

  if (toppingItems.length === 0 || !toppingItem?.id || loading) {
    return <div className='loading'></div>
  }

  return (
    <div className='ToppingItemDetail'>
      <p className='title'>
        {toppingItem.name} <i className></i>{' '}
      </p>
      <Separator className='mb-4 mt-3' />

      <Row className='mt-4'>
        <Colxx md='6' className=''>
          <Card>
            <CardBody>
              <div className='section'>
                <p className='section-heading'>M?? t???</p>
                <p>{toppingItem.description}</p>
              </div>

              <div className='section'>
                <p className='section-heading'>
                  Gi??: <span className='text-orange'>{toppingItem.price}??</span>
                </p>
              </div>

              <div className='section'>
                <p className='section-heading'>
                  S??? l?????ng:{' '}
                  <span className='text-orange'>{toppingItem.maxQuantity}</span>
                </p>
              </div>

              <div className='section'>
                <p className='section-heading'>
                  {toppingItem.isActive ? '??ang k??ch ho???t' : '??ang ???n'}
                </p>
              </div>

              <div className='section'>
                <p className='section-heading'>
                  Tr???ng th??i:{' '}
                  <span className='font-weight-500'>
                    {toppingItem.state === 'IN_STOCK' ? 'C??n h??ng' : 'H???t h??ng'}
                  </span>
                </p>
              </div>

              <Button
                color='primary'
                style={{ marginLeft: 'auto', display: 'block' }}
                onClick={redirecToEditTopping}
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
export default connect(mapStateToProps, { getToppingItems, getMenus })(
  ToppingItemDetail
)
