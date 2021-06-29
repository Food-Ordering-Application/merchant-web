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
  getToppingGroup,
  editToppingGroup,
} from '../../../redux/actions'
import IntlMessages from '../../../helpers/IntlMessages'
import { Colxx } from '../../../components/common/CustomBootstrap'
import { NotificationManager } from 'src/components/common/react-notifications'

import { USER_URL } from 'src/constants'
import './ToppingGroupEdit.scss'

const ToppingGroupEdit = (props) => {
  const { id: toppingGroupId } = useParams()
  const {
    history,
    restaurantMenu: { menus, menuGroup, totalMenuGroups, toppingGroups },
    getMenuGroup,
    getToppingGroup,
    getMenus,
  } = props

  const [toppingGroupDetail, setToppingGroupDetail] = useState({})

  const [loading, setLoading] = useState(false)

  const merchantId = localStorage.getItem('merchant_id')
  const restaurantId = localStorage.getItem('restaurant_id')

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

  const updateToppingGroup = async () => {
    let res
    try {
      setLoading(true)
      const menuId = menus[0].id
      let updatedToppingGroup = {
        ...toppingGroupDetail,
        index: parseInt(toppingGroupDetail.index),
      }
      const accessToken = localStorage.getItem('access_token')
      res = await axios({
        method: 'PATCH',
        url: `${USER_URL}/${merchantId}/restaurant/${restaurantId}/menu/${menuId}/topping-group/${toppingGroupId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          ...updatedToppingGroup,
        },
      })
      const { editToppingGroup } = props
      editToppingGroup(updatedToppingGroup)
      NotificationManager.success(
        'Updated topping group information!',
        'Success',
        3000
      )
    } catch (error) {
      console.log('Error in updateToppingGroup')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const onFormChange = (e) => {
    const {
      target: { name, value },
    } = e

    setToppingGroupDetail((prevState) => {
      return {
        ...prevState,
        [name]: value,
      }
    })
  }

  const onSubmit = () => {
    updateToppingGroup()
  }

  const onActiveChange = ({ value }) => {
    setToppingGroupDetail((prevState) => ({
      ...prevState,
      isActive: value,
    }))
  }

  const activeOptions = [
    { label: 'Kích hoạt', value: true },
    { label: 'Ẩn', value: false },
  ]

  if (Object.keys(toppingGroupDetail).length === 0) {
    return <div className='loading'></div>
  }

  return (
    <div className='ToppingGroupEdit'>
      <Row>
        <Colxx xxs='12' md='6' className='mb-4'>
          <div className='create-restaurant-container'>
            <Card
              className='create-restaurant-card'
              style={{ padding: '30px 40px' }}
            >
              <div className='form-restaurant'>
                <CardTitle className='mb-4'>
                  <IntlMessages id='menu.edit-topping-group' />
                </CardTitle>

                <Form onChange={onFormChange} className='mt-4'>
                  <Label className='form-group has-float-label mb-4'>
                    <Input
                      type='text'
                      name='name'
                      defaultValue={toppingGroupDetail.name}
                    />
                    <IntlMessages id='topping-group.name' />
                  </Label>

                  <Label className='form-group has-float-label mb-4'>
                    <Input
                      type='number'
                      name='index'
                      defaultValue={toppingGroupDetail.index}
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
                        (option) => option.value === toppingGroupDetail.isActive
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
                        history.push(
                          `/app/topping-group/item/${toppingGroupId}`
                        )
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
  getToppingGroup,
  editToppingGroup,
})(ToppingGroupEdit)
