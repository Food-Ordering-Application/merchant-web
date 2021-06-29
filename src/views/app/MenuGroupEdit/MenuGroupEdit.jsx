import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Button,
  Badge,
  Form,
  Label,
  Input,
} from 'reactstrap'
import axios from 'axios'
import { useParams } from 'react-router-dom'

import Select from 'react-select'

import {
  setStaffList,
  setStaff as setStaffAction,
  setMenuGroup,
  getMenuGroup,
  getMenus,
} from '../../../redux/actions'
import IntlMessages from '../../../helpers/IntlMessages'
import { Colxx } from '../../../components/common/CustomBootstrap'
import { NotificationManager } from 'src/components/common/react-notifications'

import { USER_URL } from 'src/constants'
import './MenuGroupEdit.scss'

const MenuGroupEdit = (props) => {
  const { id: menuGroupId } = useParams()
  const {
    history,
    restaurantMenu: { menus, menuGroup, totalMenuGroups },
    getMenuGroup,
    getMenus,
  } = props

  const [menuGroupDetail, setMenuGroupDetail] = useState({})

  const [loading, setLoading] = useState(false)

  const merchantId = localStorage.getItem('merchant_id')
  const restaurantId = localStorage.getItem('restaurant_id')

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

  const updateMenuGroup = async () => {
    let res
    try {
      setLoading(true)
      const menuId = menus[0].id
      let updatedMenuGroup = {
        ...menuGroupDetail,
        index: parseInt(menuGroupDetail.index),
      }
      const accessToken = localStorage.getItem('access_token')
      res = await axios({
        method: 'PATCH',
        url: `${USER_URL}/${merchantId}/restaurant/${restaurantId}/menu/${menuId}/menu-group/${menuGroupId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          ...updatedMenuGroup,
        },
      })
      const { setMenuGroup } = props
      setMenuGroup(updatedMenuGroup)
      NotificationManager.success(
        'Updated menu group information!',
        'Success',
        3000
      )
    } catch (error) {
      console.log('Error in updateMenuGroup')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const onFormChange = (e) => {
    const {
      target: { name, value },
    } = e

    setMenuGroupDetail((prevState) => {
      return {
        ...prevState,
        [name]: value,
      }
    })
  }

  const onSubmit = () => {
    updateMenuGroup()
  }

  const onActiveChange = ({ value }) => {
    setMenuGroupDetail((prevState) => ({
      ...prevState,
      isActive: value,
    }))
  }

  const activeOptions = [
    { label: 'Kích hoạt', value: true },
    { label: 'Ẩn', value: false },
  ]

  if (Object.keys(menuGroupDetail).length === 0) {
    return <div className='loading'></div>
  }

  return (
    <div className='MenuGroupEdit'>
      <Row>
        <Colxx xxs='12' md='6' className='mb-4'>
          <div className='create-restaurant-container'>
            <Card
              className='create-restaurant-card'
              style={{ padding: '30px 40px' }}
            >
              <div className='form-restaurant'>
                <CardTitle className='mb-4'>
                  <IntlMessages id='menu.edit-menu-group' />
                </CardTitle>

                <Form onChange={onFormChange} className='mt-4'>
                  <Label className='form-group has-float-label mb-4'>
                    <Input
                      type='text'
                      name='name'
                      defaultValue={menuGroupDetail.name}
                    />
                    <IntlMessages id='menu-group.name' />
                  </Label>

                  <Label className='form-group has-float-label mb-4'>
                    <Input
                      type='number'
                      name='index'
                      defaultValue={menuGroupDetail.index}
                    />
                    <IntlMessages id='menu-group.index' />
                  </Label>

                  <Label className='form-group has-float-label mb-4'>
                    <Select
                      className={`react-select ${props.className}`}
                      placeholder={props.placeholder || 'Select'}
                      classNamePrefix='react-select-active-state'
                      options={activeOptions}
                      value={activeOptions.find(
                        (option) => option.value === menuGroupDetail.isActive
                      )}
                      styles={{
                        // Fixes the overlapping problem of the component
                        menu: (provided) => ({ ...provided, zIndex: 9999 }),
                      }}
                      onChange={onActiveChange}
                      // onBlur={handleBlur}
                    />
                    <IntlMessages id='menu.status' />
                  </Label>

                  <div className='d-flex justify-content-end align-items-center'>
                    <Button
                      color='primary'
                      size='lg'
                      onClick={() => {
                        history.push(`/app/menu-group/item/${menuGroupId}`)
                      }}
                    >
                      <span className='label'>
                        <IntlMessages id='back-button' />
                      </span>
                    </Button>

                    <Button
                      color='primary'
                      className={`btn-shadow btn-multiple-state ml-3 ${
                        loading ? 'show-spinner' : ''
                      }`}
                      size='lg'
                      disabled={loading}
                      onClick={onSubmit}
                    >
                      <span className='spinner d-inline-block'>
                        <span className='bounce1' />
                        <span className='bounce2' />
                        <span className='bounce3' />
                      </span>
                      <span className='label'>
                        <IntlMessages id='restaurant.update-button' />
                      </span>
                    </Button>
                  </div>
                </Form>
              </div>
            </Card>
          </div>
        </Colxx>
      </Row>
    </div>
  )
}

const mapStateToProps = ({ restaurantMenu }) => ({
  restaurantMenu,
})

// export default connect(mapStateToProps, mapDispatchToProps)(MenuItemDetail)
export default connect(mapStateToProps, {
  setMenuGroup,
  getMenuGroup,
  getMenus,
})(MenuGroupEdit)
