import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Card, CardBody, Row, Button } from 'reactstrap'
import Bluebird from 'bluebird'
import axios from 'axios'
import { Colxx, Separator } from '../../../components/common/CustomBootstrap'
import MenuItem from '../MenuItem'
import {
  getMenuGroup,
  getMenuItems,
  setMenu,
  createMenuGroup,
} from 'src/redux/actions'

import './MenuInfo.scss'
import MenuGroupCreate from '../MenuGroupCreate'
import clsx from 'clsx'
import IntlMessages from 'src/helpers/IntlMessages'
import { findMenuGroupById } from '../dishes/utils'

import './MenuInfo.scss'
import { USER_URL } from 'src/constants'
import { NotificationManager } from 'src/components/common/react-notifications'

const DataList = React.lazy(() =>
  import(/* webpackChunkName: "product-data-list" */ './data-list')
)

const MenuGroup = (props) => {
  const {
    group: { id: groupId, menuId, name, isActive, index },
    merchantId,
    restaurantId,
    history,
    getMenuItems,
    menuItems = [],
  } = props

  useEffect(() => {
    // getMenuItems({ merchantId, restaurantId, menuId })
  }, [])

  const onGroupClick = () => {
    //   history.push(`/app/dishes/create/${id}`)
  }

  return (
    <div
      style={{ cursor: 'pointer', marginBottom: '40px' }}
      onClick={onGroupClick}
      className='pt-2 pl-4'
    >
      <h2 className='font-weight-600' style={{ fontWeight: '1.6rem' }}>
        {name}
      </h2>
      {/* <p>Index: {index}</p> */}
      {/* <p>{isActive ? 'Active' : 'Inactive'} </p> */}

      <div className={clsx(isActive ? '' : 'opacity-05')}>
        {menuItems.map((menuItem) => {
          if (menuItem.menuGroupId === groupId) {
            return <MenuItem key={menuItem.id} menuItem={menuItem} />
          }
          return null
        })}
        {/* <MenuItem
            merchantId={merchantId}
            restaurantId={restaurantId}
            menuId={menuId}
            menuGroup={id}
          /> */}
      </div>
    </div>

    // <Card
    //   style={{ cursor: 'pointer', marginBottom: '40px' }}
    //   onClick={onGroupClick}
    // >
    //   <CardBody>
    //     <h2>{name}</h2>
    //     {/* <p>Index: {index}</p> */}
    //     {/* <p>{isActive ? 'Active' : 'Inactive'} </p> */}

    //     <div className={clsx(isActive ? '' : 'opacity-05')}>
    //       {menuItems.map((menuItem) => {
    //         if (menuItem.menuGroupId === groupId) {
    //           return <MenuItem key={menuItem.id} menuItem={menuItem} />
    //         }
    //         return null
    //       })}
    //       {/* <MenuItem
    //         merchantId={merchantId}
    //         restaurantId={restaurantId}
    //         menuId={menuId}
    //         menuGroup={id}
    //       /> */}
    //     </div>
    //   </CardBody>
    // </Card>
  )
}

const MenuInfo = (props) => {
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [showCreateItem, setShowCreateItem] = useState(false)
  const [tableData, setTableData] = useState({ data: [] })
  const [showByCategory, setShowByCategory] = useState(false)
  const [selectedItems, setSelectedItems] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    location: { pathname },
    setMenu,
    getMenuGroup,
    getMenuItems,
    createMenuGroup,
    history,
    // authUser: {user: {id: merchantId}},
    // restaurantInfo: {restaurant: {id: restaurantId}},
    restaurantMenu: {
      menus,
      menu,
      menuGroup,
      loading: fetchLoading,
      error,
      menuItems,
      loadingMenuGroups,
    },
    restaurantInfo,
  } = props

  const menuId =
    pathname.split(`/app/dishes/create/`)[1] || pathname.split(`/`)[3]
  const merchantId = localStorage.getItem('merchant_id')
  const restaurantId =
    restaurantInfo.restaurant.id || localStorage.getItem('restaurant_id')

  useEffect(() => {
    // setMenu(menuId)
    // getMenuGroup({ merchantId, restaurantId, menuId })
    if (menuGroup.length === 0) {
      getMenuGroup({ merchantId, restaurantId, menuId })
    }
    if (menuItems.length === 0) {
      getMenuItems({ merchantId, restaurantId, menuId })
    }
  }, [])

  useEffect(() => {
    if (
      menuItems.length !== 0 &&
      tableData.data.length === 0 &&
      menuGroup.length > 0
    ) {
      const pageSize = 10
      const newMenuItems = menuItems.map(
        ({
          id,
          name,
          imageUrl,
          description,
          menuGroupId,
          isActive,
          price,
          state,
        }) => {
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
            state,
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
      setTableData(newTableData)
    }
  }, [menuItems, menuGroup])

  useEffect(() => {
    setShowCreateGroup(false)
    setShowCreateItem(false)
  }, [menuGroup])

  const toggleDisplayByCategory = () => {
    setShowByCategory((prevState) => !prevState)
  }

  const onMenuGroupCreateClick = () => {
    setShowCreateGroup(true)
  }

  const onMenuItemCreateClick = () => {
    history.push('/app/dishes/create/menu-item')
  }

  const onToppingGroupCreateClick = () => {
    history.push('/app/dishes/create/topping-group')
  }

  const onToppingItemCreateClick = () => {
    history.push('/app/dishes/create/topping-item')
  }

  const onSetupToppingClick = () => {
    history.push('/app/dishes/select-topping')
  }

  const onMenuGroupCreate = (values) => {
    // console.log({ merchantId, restaurantId, menuId, data: values })
    createMenuGroup({ merchantId, restaurantId, menuId, data: values })
  }

  const getMenuName = () => {
    const params = window.location.href.split('/')
    const menuId = params[params.length - 1]
    const foundMenu = menus.find((menu) => menu.id === menuId)
    if (foundMenu) return foundMenu.name
    return 'Thực đơn'
  }

  const onSelect = (ids) => {
    setSelectedItems(ids)
  }

  const onDeleteItems = async () => {
    try {
      setLoading(true)
      const accessToken = localStorage.getItem('access_token')

      await Bluebird.map(selectedItems, async (toppingItemId) => {
        const { data } = await axios({
          method: 'DELETE',
          url: `${USER_URL}/${merchantId}/restaurant/${restaurantId}/menu/${menuId}/menu-item/${toppingItemId}`,
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
        `Deleted ${selectedItems.length} items!`,
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

  const onDeactivateItems = async () => {
    try {
      setLoading(true)

      const accessToken = localStorage.getItem('access_token')

      await Bluebird.map(selectedItems, async (toppingItemId) => {
        const { data } = await axios({
          method: 'PATCH',
          url: `${USER_URL}/${merchantId}/restaurant/${restaurantId}/menu/${menuId}/menu-item/${toppingItemId}`,
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
        `Deactivated ${selectedItems.length} items!`,
        'Success',
        3000
      )
    } catch (error) {
      console.log('Error in Deactivate Menu Items')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const onActivateItems = async () => {
    try {
      setLoading(true)

      const accessToken = localStorage.getItem('access_token')

      await Bluebird.map(selectedItems, async (toppingItemId) => {
        const { data } = await axios({
          method: 'PATCH',
          url: `${USER_URL}/${merchantId}/restaurant/${restaurantId}/menu/${menuId}/menu-item/${toppingItemId}`,
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
        `Activated ${selectedItems.length} items!`,
        'Success',
        3000
      )
    } catch (error) {
      console.log('Error in Activate Menu Items')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || fetchLoading) {
    // return <p>Loading</p>
    return <div className='loading'></div>
  }

  // if (menuGroup.length === 0) {
  //   return <p>There's no menu group yet. Create one!</p>
  // }

  console.log(tableData)

  return (
    <div className='MenuInfo'>
      <div className='d-flex align-items-center justify-content-space-between mb-2'>
        <h2>{getMenuName()}</h2>
        {/* <span className='button'>Hello</span> */}
        <div>
          <button
            type='button'
            className='btn-shadow btn btn-primary btn-md mr-3 font-weight-600'
            onClick={onMenuGroupCreateClick}
          >
            <span>
              <IntlMessages id='menu.menu-group-create' />
            </span>
          </button>

          <button
            type='button'
            className='btn-shadow btn btn-primary mr-3 font-weight-600'
            onClick={onMenuItemCreateClick}
          >
            <span>
              <IntlMessages id='menu.menu-create-btn' />
            </span>
          </button>
        </div>
      </div>

      {showCreateGroup && (
        <div className={clsx(loadingMenuGroups ? 'opacity-05' : 'opacity-1')}>
          <MenuGroupCreate onSubmit={onMenuGroupCreate} />
        </div>
      )}
      {showByCategory ? (
        <>
          <div
          // className='d-flex align-item'
          >
            <Button
              color='primary'
              size='lg'
              className='show-by-btn top-right-button'
              onClick={() => toggleDisplayByCategory()}
            >
              {/* <IntlMessages id='pages.add-new' /> */}
              Theo danh sách
            </Button>
          </div>
          {menuGroup.map((group) => {
            return (
              <MenuGroup
                menuItems={menuItems}
                getMenuItems={getMenuItems}
                merchantId={merchantId}
                restaurantId={restaurantId}
                group={group}
                key={group.id}
              />
            )
          })}
        </>
      ) : (
        <Row>
          <Colxx xxs='12' className='mb-4'>
            <DataList
              history={history}
              data={tableData}
              onSelect={onSelect}
              toggleDisplayByCategory={toggleDisplayByCategory}
              onDeleteItems={onDeleteItems}
              onDeactiveItems={onDeactivateItems}
              onActiveItems={onActivateItems}
            />
          </Colxx>
        </Row>
      )}
    </div>
  )
}

const mapStateToProps = ({ authUser, restaurantInfo, restaurantMenu }) => {
  return { authUser, restaurantInfo, restaurantMenu }
}
// export default MenuInfo

export default connect(mapStateToProps, {
  getMenuGroup,
  setMenu,
  getMenuItems,
  createMenuGroup,
})(MenuInfo)
