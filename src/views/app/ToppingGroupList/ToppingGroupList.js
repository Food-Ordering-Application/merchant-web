import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Row } from 'reactstrap'
import IntlMessages from '../../../helpers/IntlMessages'
import Bluebird from 'bluebird'
import axios from 'axios'
import {
  getMenus,
  getMenu,
  getMenuItems,
  getMenuGroup,
  getToppingItems,
  getToppingGroup,
} from '../../../redux/actions'

import { Colxx, Separator } from '../../../components/common/CustomBootstrap'
import Breadcrumb from '../../../containers/navs/Breadcrumb'
import { findMenuGroupById as findToppingGroupById } from '../dishes/utils'
import { NotificationManager } from 'src/components/common/react-notifications'
import { useEffect } from 'react'
import { useState } from 'react'
import { USER_URL } from 'src/constants'

import DataList from './data-list'

const ToppingGroupList = (props) => {
  const [tableData, setTableData] = useState({ data: [] })
  const [selectedItems, setSelectedItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const {
    restaurantMenu: {
      menus,
      loading: fetchLoading,
      error,
      menu,
      menuItems = [],
      menuGroup = [],
      toppingItems = [],
      toppingGroups = [],
      loadingToppingItems,
      totalToppingItems,
      totalToppingGroups,
    },
    location: { pathname },
    restaurantInfo,
    history,
    getToppingItems,
    getToppingGroup,
  } = props

  const merchantId = localStorage.getItem('merchant_id')
  const restaurantId =
    restaurantInfo.restaurant.id || localStorage.getItem('restaurant_id')

  useEffect(() => {
    const merchantId = localStorage.getItem('merchant_id')

    if (menus.length === 0) {
      const { getMenus } = props
      getMenus(merchantId, restaurantId)
    }
  }, [])

  useEffect(() => {
    if (menus.length === 0) return
    const menuId = menus[0].id
    if (toppingGroups.length === 0) {
      getToppingGroup({ merchantId, restaurantId, menuId })
    }
  }, [menus])

  useEffect(() => {
    const pageSize = 10
    if (toppingGroups.length !== 0) {
      setLoading(false)
    }
    if (toppingGroups.length > 0) {
      const newTableData = {
        status: true,
        totalItem: toppingGroups.length,
        totalPage: Math.ceil(totalToppingGroups / pageSize),
        pageSize,
        currentPage: 1,
        data: toppingGroups,
      }

      setTableData(newTableData)
    }
  }, [toppingGroups])

  const onSelect = (ids) => {
    setSelectedItems(ids)
  }

  const onDeleteItems = async () => {
    const menuId = menus[0].id
    try {
      setLoading(true)
      const accessToken = localStorage.getItem('access_token')

      await Bluebird.map(selectedItems, async (menuItemId) => {
        const { data } = await axios({
          method: 'DELETE',
          url: `${USER_URL}/${merchantId}/restaurant/${restaurantId}/menu/${menuId}/topping-item/${menuItemId}`,
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
        `Deleted ${selectedItems.length} topping items!`,
        'Success',
        3000
      )
      // getMenuItems({ merchantId, restaurantId, menuId })
    } catch (error) {
      console.log('Error in Delete Topping Items')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const onDeactivateItems = async () => {
    const menuId = menus[0].id
    try {
      setLoading(true)

      const accessToken = localStorage.getItem('access_token')

      await Bluebird.map(selectedItems, async (menuItemId) => {
        const { data } = await axios({
          method: 'PATCH',
          url: `${USER_URL}/${merchantId}/restaurant/${restaurantId}/menu/${menuId}/topping-item/${menuItemId}`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          data: {
            isActive: false,
          },
        })
        if (!data) return
      })

      setTableData((prevState) => {
        return {
          ...prevState,
          data: prevState.data.map((item) => {
            const activeStatus = selectedItems.includes(item.id)
              ? false
              : item.isActive
            return {
              ...item,
              isActive: activeStatus,
            }
          }),
        }
      })

      NotificationManager.success(
        `Deactivated ${selectedItems.length} topping items!`,
        'Success',
        3000
      )
    } catch (error) {
      console.log('Error in Deactivate Topping Items')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const onActivateItems = async () => {
    const menuId = menus[0].id
    try {
      setLoading(true)

      const accessToken = localStorage.getItem('access_token')

      await Bluebird.map(selectedItems, async (menuItemId) => {
        const { data } = await axios({
          method: 'PATCH',
          url: `${USER_URL}/${merchantId}/restaurant/${restaurantId}/menu/${menuId}/topping-item/${menuItemId}`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          data: {
            isActive: true,
          },
        })
        if (!data) return
      })

      setTableData((prevState) => {
        return {
          ...prevState,
          data: prevState.data.map((item) => {
            const activeStatus = selectedItems.includes(item.id)
              ? true
              : item.isActive
            return {
              ...item,
              isActive: activeStatus,
            }
          }),
        }
      })

      NotificationManager.success(
        `Activated ${selectedItems.length} topping items!`,
        'Success',
        3000
      )
    } catch (error) {
      console.log('Error in Activate Topping Items')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page) => {
    const menuId = menus[0].id
    setCurrentPage(page)
    getToppingItems({ merchantId, restaurantId, menuId, page: page - 1 })
  }

  const onToppingGroupCreateClick = () => {
    history.push('/app/toppings/create/topping-group')
  }

  const onToppingItemCreateClick = () => {
    history.push('/app/toppings/create/topping-item')
  }

  const onSetupToppingClick = () => {
    history.push('/app/toppings/select-topping')
  }

  if (loadingToppingItems || fetchLoading) {
    return <div className='loading' />
  }

  return (
    <Fragment>
      <Row>
        <Colxx xxs='12' className='mb-4'>
          {tableData.data.length > 0 && (
            <DataList
              history={history}
              data={tableData}
              subData={menuItems}
              onSelect={onSelect}
              onDeleteItems={onDeleteItems}
              onDeactiveItems={onDeactivateItems}
              onActiveItems={onActivateItems}
              isTopping={true}
              handlePageChange={handlePageChange}
              currentPage={currentPage}
            />
          )}
        </Colxx>
      </Row>
    </Fragment>
  )
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
  getMenus,
  getMenu,
  getMenuItems,
  getMenuGroup,
  getToppingItems,
  getToppingGroup,
})(ToppingGroupList)
