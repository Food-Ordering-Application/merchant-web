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
import MenuCreate from '../MenuCreate'

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
          // id: restaurantId = `8a9beb82-7c3f-45a5-883b-9d96a794d1f2`,
          id: restaurantId,
        },
      },
      restaurantMenu: { menus, loading, error, menu, menuItems = [] },
      getMenu,
      getMenuItems,
      getMenuGroup,
    } = this.props

    // BUGGG
    const merchantId = localStorage.getItem('merchant_id')
    const restaurantIdLocal = localStorage.getItem('restaurant_id')
    getMenu(merchantId, restaurantIdLocal)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.restaurantMenu.menuItems.length >
        this.props.restaurantMenu.menuItems.length ||
      nextProps.restaurantMenu.menus.length >
        this.props.restaurantMenu.menus.length ||
      nextProps.restaurantMenu.menuGroup.length >
        this.props.restaurantMenu.menuGroup.length ||
      nextState.tableData.data.length > this.state.tableData.data.length
    ) {
      return true
    }
    return false
  }

  componentDidUpdate(prevProps) {
    const {
      restaurantMenu: {
        menus,
        loading,
        error,
        menu,
        menuItems = [],
        menuGroup = [],
      },
      getMenuItems,
      getMenuGroup,
    } = this.props

    const pageSize = 10
    if (menus.length > 0) {
      console.log(menus)
      const menuId = menus[0].id
      const merchantId = localStorage.getItem('merchant_id')
      const {
        restaurantInfo: {
          restaurant: {
            // id: restaurantId = `8a9beb82-7c3f-45a5-883b-9d96a794d1f2`,
            id: restaurantId,
          },
        },
      } = this.props
      if (menuGroup.length === 0) {
        console.log('FETCH MENU GROUP')
        getMenuGroup({ merchantId, restaurantId, menuId })
      }
      if (menuItems.length === 0) {
        console.log('FETCH MENU ITEMS')
        getMenuItems({ merchantId, restaurantId, menuId })
      }
    }

    if (
      menuItems.length !== 0 &&
      this.state.tableData.data.length === 0 &&
      menuGroup.length > 0
    ) {
      const newMenuItems = menuItems.map(
        ({ id, name, imageUrl, description, menuGroupId, isActive, price }) => {
          const group = findMenuGroupById(menuGroupId, menuGroup)

          return {
            id,
            title: name,
            img: imageUrl,
            category: group.name || 'Unknown',
            statusColor: 'secondary',
            description,
            isActive,
            price,
            date: '',
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

      this.setState({
        tableData: newTableData,
      })
    }
  }

  render() {
    const { history, getMenu, restaurantMenu } = this.props
    const {
      loadingMenuItems = false,
      loadingGetMenus = false,
      menus = [],
    } = restaurantMenu
    const { tableData = {} } = this.state

    // console.log(menus)

    if (loadingMenuItems) {
      return <div className='loading' />
    }

    // if (menus.length === 0) {
    if (true) {
      // return <div>Create new menu</div>
      return <MenuCreate history={this.props.history} />
    }

    console.log(tableData)
    return (
      <Fragment>
        <Row>
          <Colxx xxs='12'>
            <Breadcrumb heading='menu.dishes' match={this.props.match} />
            <Separator className='mb-5' />
          </Colxx>
        </Row>
        <Row>
          <Colxx xxs='12' className='mb-4'>
            {/* {tableData.data.length > 0 && ( */}
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
