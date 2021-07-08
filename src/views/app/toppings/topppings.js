import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Row } from 'reactstrap'
import IntlMessages from '../../../helpers/IntlMessages'

import {
  getMenus,
  getMenu,
  getMenuItems,
  getMenuGroup,
} from '../../../redux/actions'

import { Colxx, Separator } from '../../../components/common/CustomBootstrap'
import Breadcrumb from '../../../containers/navs/Breadcrumb'
import { findMenuGroupById } from './utils'

const DataList = React.lazy(() =>
  import(/* webpackChunkName: "product-data-list" */ './data-list')
)

class Dishes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tableData: {
        data: [],
      },
    }
  }

  componentDidMount() {
    const {
      history,
      // authUser: {
      //   user: { id: merchantId }
      // },
      restaurantInfo: {
        restaurant: {
          id: restaurantId = localStorage.getItem('restaurant_id'),
        },
      },
      restaurantMenu: { menus, loading, error, menu, menuItems = [] },
      getMenu,
      getMenuItems,
      getMenuGroup,
    } = this.props

    const merchantId = localStorage.getItem('merchant_id')
    const menuId = menus[0]?.id || `93e90bca-09f6-4cf2-9915-883fccb14276`

    // console.log(restaurantId)
    getMenu(merchantId, restaurantId)
    getMenuGroup({ merchantId, restaurantId, menuId })
    getMenuItems({ merchantId, restaurantId, menuId })
  }

  componentDidUpdate() {
    const {
      restaurantMenu: {
        menus,
        loading,
        error,
        menu,
        menuItems = [],
        menuGroup = [],
      },
    } = this.props
    const pageSize = 10
    if (
      menuItems.length !== 0 &&
      this.state.tableData.data.length === 0 &&
      menuGroup.length > 0
    ) {
      const newMenuItems = menuItems.map(
        ({ id, name, imageUrl, description, menuGroupId }) => {
          const group = findMenuGroupById(menuGroupId, menuGroup)

          return {
            id,
            title: name,
            img: imageUrl,
            // category: group.name || 'Unknown',
            category: group.name || 'Unknown',
            statusColor: 'secondary',
            description,
            sales: 574,
            stock: 16,
            date: '01.04.2021',
          }
        }
      )

      const newTableData = {
        status: true,
        totalItem: menuItems.length,
        totalPage: Math.ceil(menuItems.length / pageSize),
        pageSize,
        currentPage: '1',
        data: newMenuItems,
      }

      // {
      //   "status": true,
      //   "totalItem": 20,
      //   "totalPage": 2,
      //   "pageSize": "10",
      //   "currentPage": "1",
      //   "data": [
      //       {
      //           "id": 18,
      //           "title": "Cơm chiên",
      //           "img": "/assets/img/bebinca-thumb.jpg",
      //           "category": "Món chính",
      //           "status": "Đang chuẩn bị",
      //           "statusColor": "secondary",
      //           "description": "Homemade cheesecake with fresh berries and mint",
      //           "sales": 574,
      //           "stock": 16,
      //           "date": "01.04.2021"
      //       },
      this.setState({
        tableData: newTableData,
      })
    }
  }

  render() {
    const { history, getMenu } = this.props
    const { tableData = {} } = this.state

    return (
      <Fragment>
        <Row>
          <Colxx xxs='12'>
            <h1>Món ăn</h1>
            <Separator className='mb-5' />
          </Colxx>
        </Row>
        <Row>
          <Colxx xxs='12' className='mb-4'>
            <p>
              <IntlMessages id='menu.dishes' />
            </p>
            {tableData.data.length > 0 && (
              <DataList history={history} data={tableData} />
            )}
          </Colxx>
        </Row>
      </Fragment>
    )
  }
}

// export default Dishes

const mapStateToProps = ({ authUser, restaurantInfo, restaurantMenu }) => {
  return {
    authUser,
    restaurantInfo,
    restaurantMenu,
  }
}

export default connect(mapStateToProps, {
  getMenu,
  getMenuItems,
  getMenuGroup,
})(Dishes)
