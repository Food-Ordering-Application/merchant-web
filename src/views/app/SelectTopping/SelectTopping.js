import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Field, Formik } from 'formik'
import { NavLink } from 'react-router-dom'
import {
  Button,
  Form,
  FormGroup,
  Label,
  Pagination,
  PaginationItem,
  PaginationLink,
} from 'reactstrap'
import IntlMessages from 'src/helpers/IntlMessages'
import ReactSelect from 'react-select'
// import makeAnimated from 'react-select'

import {
  getMenuItems,
  getMenus,
  getToppingItems,
  setToppingByMenuItems,
  updateToppingWithMenuItems,
} from '../../../redux/actions'
import axios from 'axios'
import { USER_URL } from 'src/constants'

import SelectToppingCard from '../SelectToppingCard'

import { NotificationManager } from 'src/components/common/react-notifications'
import './SelectTopping'

const ToppingMapper = (props) => {
  const {
    getToppingGroup,
    getToppingItems,
    getMenuItems,
    setToppingByMenuItems,
    loading: fetchLoading,
    authUser,
    restaurantMenu: {
      toppingGroups = [],
      menus = [{ id: '' }],
      menuItems = [],
      toppingItems = [],
      toppingByMenuItems = [],
      totalMenuItems,
    },
    restaurantInfo,
    updateToppingWithMenuItems,
  } = props

  const {
    restaurant: { id: restaurantId = localStorage.getItem('restaurant_id') },
  } = restaurantInfo
  const merchantId = localStorage.getItem('merchant_id')
  const access_token = localStorage.getItem('access_token')

  const [selectedTopping, setSelectedTopping] = useState({
    label: '',
    value: '',
  })
  const [updateLoading, setUpdateLoading] = useState(false)
  const [toppingItemsOption, setToppingItemsOption] = useState([])

  const [menuItemsOption, setMenuItemsOption] = useState([])
  const [allMenuItemsOption, setAllMenuItemsOption] = useState([])
  const [existMenuItemsOption, setExistMenuItemsOption] = useState([])

  const [formInfo, setFormInfo] = useState({
    menuItem: {},
    toppingItems: [],
  })
  const [loading, setLoading] = useState(true)

  let currentPage = Math.ceil(menuItems.length / totalMenuItems)

  useEffect(() => {
    if (menus.length === 0) {
      setLoading(true)
      const { getMenus } = props
      getMenus(merchantId, restaurantId)
    }
  }, [])

  useEffect(() => {
    if (menus.length > 0) {
      const menuId = menus[0].id
      getToppingItems({ merchantId, restaurantId, menuId })
      getMenuItems({ merchantId, restaurantId, menuId })
      setLoading(false)
    }
  }, [menus])

  useEffect(() => {
    if (toppingItems.length === 0) return
    const newToppingItemsOption = toppingItems.map(({ id, name }) => {
      return {
        label: name,
        value: id,
      }
    })
    setToppingItemsOption(newToppingItemsOption)
  }, [toppingItems])

  useEffect(() => {
    if (menuItems.length === 0) return

    const allMenuItemOptions = menuItems.map(({ id, name }) => ({
      label: name,
      value: id,
      customPrice: null,
      selected: false,
    }))

    setAllMenuItemsOption(allMenuItemOptions)

    // {
    //   label: getMenuItemName(menuItemId),
    //   value: menuItemId,
    //   customPrice,
    //   selected: true
    // }
  }, [menuItems])

  useEffect(() => {
    if (!selectedTopping.label) return

    const finalOptions = []
    for (let i = 0; i < allMenuItemsOption.length; i++) {
      const item = allMenuItemsOption[i]
      // const exist = existMenuItemsOption.find((it) => it.value === item.value)
      const exist = existMenuItemsOption.find((it) => it.value === item.value)
      if (exist) {
        finalOptions.push(exist)
      } else {
        finalOptions.push(item)
      }
    }
    // Sort selected items to be first
    finalOptions.sort((a, b) => (a.selected ? -1 : 1))
    setMenuItemsOption(finalOptions)
  }, [allMenuItemsOption, existMenuItemsOption])

  const getMenuItemName = (id) => {
    return menuItems.find((item) => item.id === id).name
  }

  const handleToppingItemChange = (e) => {
    setSelectedTopping(e)
    fetchMenuItemsByTopping(e.value)
  }

  const fetchMenuItemsByTopping = async (toppingItemId) => {
    let res
    try {
      const menuId = menus[0].id
      res = await axios({
        method: 'GET',
        url: `${USER_URL}/${merchantId}/restaurant/${restaurantId}/menu/${menuId}/topping-item/${toppingItemId}/menu-item`,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })

      const {
        data: {
          data: { results = [] },
        },
      } = res

      const newSelectedMenuItemsOption = results.map(
        ({ menuItemId, customPrice }) => {
          return {
            label: getMenuItemName(menuItemId),
            value: menuItemId,
            customPrice,
            selected: true,
          }
        }
      )

      setExistMenuItemsOption(newSelectedMenuItemsOption)
    } catch (error) {
      console.log('Error in fetchMenuItemsByTopping')
      console.error(error)
    } finally {
    }
  }

  const updateMenuItems = async () => {
    let res
    setUpdateLoading(true)
    try {
      const menuId = menus[0].id
      const toppingItemId = selectedTopping.value
      const body = {
        menuItemToppings: menuItemsOption
          .filter((item) => item.selected)
          .map(({ label, value, customPrice }) => ({
            menuItemId: value,
            customPrice,
          })),
      }

      res = await axios({
        method: 'PUT',
        url: `${USER_URL}/${merchantId}/restaurant/${restaurantId}/menu/${menuId}/topping-item/${toppingItemId}/menu-item`,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        data: body,
      })

      NotificationManager.success(
        'Mapping topping items sucessfully!',
        'Success',
        3000
      )
      // const newMenuItemsOption = results.map(({ menuItemId, customPrice }) => {
      //   return {
      //     label: getMenuItemName(menuItemId),
      //     value: menuItemId,
      //     customPrice,
      //   }
      // })

      // setMenuItemsOption(newMenuItemsOption)
    } catch (error) {
      console.log('Error in fetchMenuItemsByTopping')
      console.error(error)
    } finally {
      setUpdateLoading(false)
    }
  }

  const onCustomPriceChange = (price, id) => {
    let newOptions = [...menuItemsOption]
    const index = newOptions.findIndex((item) => item.value === id)

    if (price) {
      newOptions[index].customPrice = +price
    } else {
      newOptions[index].customPrice = price
    }
    setMenuItemsOption(newOptions)
  }

  const onMenuItemAdded = (id, isAdded) => {
    let options = [...menuItemsOption]
    options = options.map((item) => {
      if (item.value === id) {
        if (isAdded) {
          return {
            ...item,
            selected: true,
          }
        } else {
          return {
            ...item,
            selected: false,
          }
        }
      } else {
        return { ...item }
      }
    })
    setMenuItemsOption(options)
  }

  const onPrevPageClick = (page) => {
    // console.log(page)
  }

  const onPageClick = (page) => {
    if (page === currentPage) return
    const menuId = menus[0].id
    getMenuItems({ merchantId, restaurantId, menuId, page: page - 1 })
  }

  const onNextPageClick = (page) => {
    // if (page === currentPage) return
  }

  return (
    <div className='mb-4' style={{ width: 'fit-content' }}>
      {/* <SelectToppingCard onCustomPriceChange={onCustomPriceChange} /> */}

      {toppingItemsOption.length > 0 && (
        <div className='mb-4' style={{ width: 600 }}>
          <ReactSelect
            placeholder=''
            name='toppingItems'
            options={toppingItemsOption}
            className='basic-multi-select'
            classNamePrefix='select'
            noOptionsMessage='Không có sẵn topping nào.'
            onChange={handleToppingItemChange}
            // onChange={onToppingItemsChange}
          />
        </div>
      )}

      {menuItemsOption.map((menuItem) => (
        <SelectToppingCard
          key={menuItem.value}
          {...menuItem}
          onCustomPriceChange={onCustomPriceChange}
          onMenuItemAdded={onMenuItemAdded}
        />
      ))}

      {selectedTopping.value && (
        <Pagination
          aria-label='Page navigation example'
          onChange={(e) => console.log(e)}
        >
          <PaginationItem>
            <PaginationLink previous onClick={onPrevPageClick} />
          </PaginationItem>
          {Array.from(Array(Math.ceil(totalMenuItems / 10)).keys()).map(
            (number, index) => {
              const page = number + 1
              return (
                <PaginationItem active={currentPage === page} key={page}>
                  <PaginationLink onClick={() => onPageClick(page)}>
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            }
          )}
          <PaginationItem>
            <PaginationLink next onClick={() => onNextPageClick()} />
          </PaginationItem>
        </Pagination>
      )}

      <Button
        color='primary'
        className={`btn-shadow btn-multiple-state d-block ml-auto ${
          updateLoading ? 'show-spinner' : ''
        }`}
        disabled={updateLoading}
        size='lg'
        onClick={updateMenuItems}
      >
        <span className='spinner d-inline-block'>
          <span className='bounce1' />
          <span className='bounce2' />
          <span className='bounce3' />
        </span>
        <span className='label'>
          <IntlMessages id='menu.btn-save' />
        </span>
      </Button>
    </div>
  )
}

// export default SelectTopping

const mapStateToProps = ({ authUser, restaurantInfo, restaurantMenu }) => {
  return { authUser, restaurantInfo, restaurantMenu }
}

export default connect(mapStateToProps, {
  getMenus,
  getToppingItems,
  getMenuItems,
  setToppingByMenuItems,
  updateToppingWithMenuItems,
})(ToppingMapper)
