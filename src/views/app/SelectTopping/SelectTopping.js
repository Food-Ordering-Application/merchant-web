import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Field, Formik } from 'formik'
import { NavLink } from 'react-router-dom'
import { Button, Form, FormGroup, Label } from 'reactstrap'
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

import './SelectTopping'
import { NotificationManager } from 'src/components/common/react-notifications'

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
    name: '',
    value: '',
  })
  const [toppingItemsOption, setToppingItemsOption] = useState([])
  const [menuItemsOption, setMenuItemsOption] = useState([])
  const [updateLoading, setUpdateLoading] = useState(false)

  const [formInfo, setFormInfo] = useState({
    menuItem: {},
    toppingItems: [],
  })
  const [loading, setLoading] = useState(true)

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

  // useEffect(() => {
  //   if (menuItemsOption.length > 0) return

  //   const newMenuItemsSelection = menuItems.map(({ name, id }) => {
  //     return {
  //       value: id,
  //       label: name,
  //     }
  //   })
  //   setMenuItemsOption(newMenuItemsSelection)
  // }, [menuItems])

  const handleSave = (values) => {
    console.log(values)
    const { createMenuGroup, loading, history } = props

    if (
      Object.keys(formInfo.menuItem).length === 0 ||
      formInfo.toppingItems.length === 0
    ) {
      console.log('EMPTY')
      return
    }

    const data = formInfo.toppingItems.map((topppingItem, i) => {
      return {
        toppingItem: {
          ...formInfo.toppingItems[i],
          menuItem: [
            {
              ...formInfo.menuItem,
            },
          ],
        },
      }
    })

    setToppingByMenuItems(data)
  }

  const handleComplete = () => {
    const merchantId = localStorage.getItem('merchant_id')
    const {
      restaurant: { id: restaurantId },
    } = restaurantInfo
    const menuId = menus[0].id || ''
    // const toppingItemId = formInfo.toppingItems
    console.log(merchantId, restaurantId, menuId)
    toppingByMenuItems.forEach((toppingByMenuItem) => {
      const {
        toppingItem: { id: toppingItemId, menuItem: menuItemArr },
      } = toppingByMenuItem
      const menuItems = menuItemArr.map((item) => ({
        menuItemId: item.id,
        customPrice: 0,
      }))
      const data = {
        menuItemToppings: menuItems,
      }

      updateToppingWithMenuItems({
        merchantId,
        restaurantId,
        menuId,
        toppingItemId,
        data,
      })
    })

    console.log('call api')
  }

  const validateName = (value) => {
    let error
    if (!value) {
      error = `Please enter menu group's name`
    } else if (value.length < 2) {
      error = 'Value must be longer than 2 characters'
    }
    return error
  }

  const validateIndex = (value) => {
    let error
    if (!value) {
      error = `Please enter menu group's index`
    } else if (isNaN(value)) {
      error = 'Value must be a number'
    }
    return error
  }

  const handleMenuItemChange = ({ value, label }) => {
    setFormInfo({
      ...formInfo,
      menuItem: {
        id: value,
        name: label,
      },
    })
  }

  const handleToppingChange = (e) => {
    const newToppingItems = e.map((item) => ({
      id: item.value,
      name: item.label,
    }))
    setFormInfo((prevInfo) => {
      return {
        ...prevInfo,
        toppingItems: newToppingItems,
      }
    })
  }

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

      const newMenuItemsOption = results.map(({ menuItemId, customPrice }) => {
        return {
          label: getMenuItemName(menuItemId),
          value: menuItemId,
          customPrice,
        }
      })

      setMenuItemsOption(newMenuItemsOption)
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
        menuItemToppings: menuItemsOption.map(
          ({ label, value, customPrice }) => ({
            menuItemId: value,
            customPrice,
          })
        ),
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

  // console.log(toppingItems)
  // console.log(menuItems)
  // console.log(toppingItemsOption)

  return (
    <div className='mb-4'>
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
          {...menuItem}
          onCustomPriceChange={onCustomPriceChange}
        />
      ))}

      <Button
        color='primary'
        className={`btn-shadow btn-multiple-state ${
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

      {/* <Formik initialValues={initialValues}>
        {({
          errors,
          touched,
          values,
          handleSubmit,
          handleChange,
          handleBlur,
        }) => (
          <Form
            className='av-tooltip tooltip-label-bottom'
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit()
            }}
          >
            <FormGroup className='form-group has-float-label'>
              <Label>
                <IntlMessages id='menu.menu-item-select' />
              </Label>
              <ReactSelect
                placeholder=''
                name='menuItem'
                options={menuItemsOption}
                className='basic-multi-select'
                classNamePrefix='select'
                // noOptionsMessage='Không có món ăn nào có sẵn'
                onChange={handleMenuItemChange}
                // onChange={onToppingItemsChange}
              />
            </FormGroup>

            <FormGroup className='form-group has-float-label'>
              <Label>
                <IntlMessages id='menu.menu-topping-select' />
              </Label>
              <ReactSelect
                isMulti
                // components={makeAnimated()}
                closeMenuOnSelect={false}
                placeholder=''
                name='toppingItems'
                options={toppingItemsOption}
                className='basic-multi-select'
                classNamePrefix='select'
                noOptionsMessage={() => <p>Không có topping nào có sẵn</p>}
                onChange={handleToppingChange}
              />
            </FormGroup>

            <Button
              color='primary'
              className={`btn-shadow btn-multiple-state mr-3 ${
                props.loading ? 'show-spinner' : ''
              }`}
              size='lg'
              onClick={handleSave}
            >
              <span className='spinner d-inline-block'>
                <span className='bounce1' />
                <span className='bounce2' />
                <span className='bounce3' />
              </span>
              <span className='label'>
                <IntlMessages id='menu.save-btn' />
              </span>
            </Button>

            <Button
              color='primary'
              className={`btn-shadow btn-multiple-state ${
                props.loading ? 'show-spinner' : ''
              }`}
              size='lg'
              onClick={handleComplete}
            >
              <span className='spinner d-inline-block'>
                <span className='bounce1' />
                <span className='bounce2' />
                <span className='bounce3' />
              </span>
              <span className='label'>
                <IntlMessages id='menu.complete-btn' />
              </span>
            </Button>
          </Form>
        )}
      </Formik> */}
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
