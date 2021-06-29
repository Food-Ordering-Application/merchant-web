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

import Select from 'react-select'

import {
  getMenuItems,
  setMenuItem as setMenuItemAction,
} from '../../../redux/actions'
import { createFile, sortByDay, uploadFile } from 'src/helpers/Utils'
import IntlMessages from '../../../helpers/IntlMessages'
import { Colxx, Separator } from '../../../components/common/CustomBootstrap'
import Breadcrumb from '../../../containers/navs/Breadcrumb'
import FormikBasicFieldLevel from '../../../containers/form-validations/FormikBasicFieldLevel'
import ProfileForm from '../../../components/forms/ProfileForm'
import UploadImage from '../../../components/common/UploadImage'
import { NotificationManager } from 'src/components/common/react-notifications'
import HourSelect from '../../HourSelect'
import Map from '../../../components/map/Map'

import './MenuItemEdit.scss'
import { USER_URL } from 'src/constants'

const activeOptions = [
  { value: true, label: 'Kích hoạt' },
  { value: false, label: 'Ẩn' },
]

const stockStateOptions = [
  { value: 'IN_STOCK', label: 'Còn hàng' },
  { value: 'OUT_OF_STOCK', label: 'Hết hàng' },
]

const MenuItemEdit = (props) => {
  const {
    product,
    restaurantMenu: { menuItems, menuGroup },
    getMenuItems,
  } = props

  const [menuItem, setMenuItem] = useState({
    id: '',
    name: '',
    phone: '',
    isActive: false,
    state: 'IN_STOCK',
    pictures: [],
    image: null,
    imageUrl: '',
    loadingImage: false,
    // position: { lng: 106.6799777, lat: 10.762913 }, // Truong KHTN
  })

  const [loading, setLoading] = useState(false)
  const [loadingImage, setLoadingImage] = useState(false)

  const merchantId = localStorage.getItem('merchant_id')
  const restaurantId = localStorage.getItem('restaurant_id')

  useEffect(() => {
    console.log(menuItems)
    if (menuItems.length > 0) {
      console.log(menuItems)
    } else {
      const path = window.location.href.split('/')
      const menuId = path[path.length - 3]
      getMenuItems({ merchantId, restaurantId, menuId })
    }
    const accessToken = localStorage.getItem('access_token')
  }, [])

  useEffect(() => {
    if (menuItems.length === 0) return
    const path = window.location.href.split('/')
    const menuItemId = path[path.length - 1]
    const foundMenuItem = menuItems.find(({ id }) => id === menuItemId)
    setMenuItem(foundMenuItem)
  }, [menuItems])

  const redirecToEditProduct = () => {
    const path = window.location.href
    const editPath = path.replace('item', 'edit')
    window.location.replace(editPath)
  }

  const onImageChange = (imageFile, addUpdateIndex) => {
    // console.log(imageFile)
    const { file: image } = imageFile[0]
    setMenuItem((prevState) => ({
      ...prevState,
      image,
    }))
  }

  const onFormChange = (e) => {
    const {
      target: { name, value },
    } = e

    setMenuItem((prevState) => {
      return {
        ...prevState,
        [name]: value,
      }
    })
  }

  const onActiveChange = ({ value }) => {
    setMenuItem((prevState) => ({
      ...prevState,
      isActive: value,
    }))
  }

  const onStockStateChange = ({ value }) => {
    setMenuItem((prevState) => ({
      ...prevState,
      state: value,
    }))
  }

  const redirectBack = () => {
    const { history } = props
    const path = window.location.href.split('/')
    const menuId = path[path.length - 3]
    history.push(`/app/dishes/${menuId}/item/${menuItem.id}`)
  }

  const onSubmit = async () => {
    const { id, name, description, price, image, imageUrl, isActive, state } =
      menuItem

    setLoading(true)
    let updatedMenuItem
    // Do update cover image
    if (image) {
      setLoadingImage(true)
      const newImageUrl = await uploadFile(image)
      if (!newImageUrl) {
        console.log('Failed in handleUpload')
        return
      }
      setLoadingImage(false)
      updatedMenuItem = {
        id,
        name,
        description,
        price: parseFloat(price),
        imageUrl: newImageUrl,
        isActive,
        state,
      }
    }

    // Use existing menu item image
    else {
      updatedMenuItem = {
        id,
        name,
        description,
        price: parseFloat(price),
        imageUrl,
        isActive,
        state,
      }
    }

    const restaurantId = id
    const merchantId = localStorage.getItem('merchant_id')
    const accessToken = localStorage.getItem('access_token')

    const path = window.location.href.split('/')
    const menuId = path[path.length - 3]
    const menuItemId = menuItem.id

    try {
      const { data } = await axios({
        method: 'PATCH',
        url: `${USER_URL}/${merchantId}/restaurant/${restaurantId}/menu/${menuId}/menu-item/${menuItemId}`,
        data: {
          ...updatedMenuItem,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const { setMenuItemAction } = props
      setMenuItemAction({ ...updatedMenuItem })

      NotificationManager.success(
        'Menu item updated successfully',
        'Success',
        3000
      )

      // window.location.reload()
    } catch (error) {
      console.log('Error in Edit Menu Item')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (menuItems.length === 0 || !menuItem.id) {
    return <div className='loading'></div>
  }

  return (
    <div className='MenuItemEdit'>
      <Row>
        <Colxx xxs='12' className='mb-4'>
          <div className='create-restaurant-container'>
            <Card
              className='create-restaurant-card'
              style={{ padding: '30px 40px' }}
            >
              <div className='form-restaurant'>
                <CardTitle className='mb-4'>
                  <IntlMessages id='menu.edit-menu-item' />
                </CardTitle>

                <div className='img-upload-container upload-cover-img'>
                  <div className='upload-label'>
                    <IntlMessages id='menu.item-image' />
                  </div>
                  <div className='img-upload'>
                    <UploadImage
                      onImageChange={onImageChange}
                      limit={1}
                      defaultImageUrl={menuItem.imageUrl}
                    />
                  </div>
                </div>

                <Form onChange={onFormChange} className='mt-4'>
                  <Label className='form-group has-float-label mb-4'>
                    <Input
                      type='text'
                      name='name'
                      defaultValue={menuItem.name}
                    />
                    <IntlMessages id='menu.item-name' />
                  </Label>

                  <Label className='form-group has-float-label mb-4'>
                    <Input
                      type='textarea'
                      name='description'
                      defaultValue={menuItem.description}
                    />
                    <IntlMessages id='menu.item-description' />
                  </Label>

                  <Label className='form-group has-float-label mb-4'>
                    <Input
                      type='number'
                      name='price'
                      defaultValue={menuItem.price}
                    />
                    <IntlMessages id='menu.item-price' />
                  </Label>

                  <Label className='form-group has-float-label mb-4'>
                    <Select
                      className={`react-select ${props.className}`}
                      placeholder={props.placeholder || 'Select'}
                      classNamePrefix='react-select-active-state'
                      options={activeOptions}
                      value={activeOptions.find(
                        (option) => option.value === menuItem.isActive
                      )}
                      onChange={onActiveChange}
                      // onBlur={handleBlur}
                    />
                    <IntlMessages id='menu.item-active-status' />
                  </Label>

                  <Label className='form-group has-float-label mb-4'>
                    <Select
                      className={`react-select ${props.className}`}
                      placeholder={props.placeholder || 'Select'}
                      classNamePrefix='react-select-stock-state'
                      options={stockStateOptions}
                      value={stockStateOptions.find(
                        (option) => option.value === menuItem.state
                      )}
                      onChange={onStockStateChange}
                      // onBlur={handleBlur}
                    />
                    <IntlMessages id='menu.item-in-stock-status' />
                  </Label>

                  <div className='d-flex justify-content-end align-items-center'>
                    <Button
                      color='primary'
                      className={`btn-shadow btn-multiple-state`}
                      size='lg'
                      onClick={redirectBack}
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

const mapStateToProps = ({ restaurantInfo, restaurantMenu }) => ({
  restaurantInfo,
  restaurantMenu,
})

// export default connect(mapStateToProps, mapDispatchToProps)(MenuItemDetail)
export default connect(mapStateToProps, { getMenuItems, setMenuItemAction })(
  MenuItemEdit
)
