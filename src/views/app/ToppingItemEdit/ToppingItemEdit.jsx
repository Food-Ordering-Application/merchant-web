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

import { getMenuItems, getToppingItems } from '../../../redux/actions'
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

import { USER_URL } from 'src/constants'
import './ToppingItemEdit.scss'

const activeOptions = [
  { value: true, label: 'Kích hoạt' },
  { value: false, label: 'Ẩn' },
]

const stockStateOptions = [
  { value: 'IN_STOCK', label: 'Còn hàng' },
  { value: 'OUT_OF_STOCK', label: 'Hết hàng' },
]

const ToppingItemEdit = (props) => {
  const {
    product,
    restaurantMenu: { toppingItems, menuGroup },
    getMenuItems,
    getToppingItems,
  } = props

  const [toppingItem, setToppingItem] = useState({
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
    if (toppingItems.length > 0) {
      console.log(toppingItems)
    } else {
      const path = window.location.href.split('/')
      const menuId = path[path.length - 3]
      getToppingItems({ merchantId, restaurantId, menuId })
    }
  }, [])

  useEffect(() => {
    if (toppingItems.length === 0) return
    const path = window.location.href.split('/')
    const toppingItemId = path[path.length - 1]
    const foundMenuItem = toppingItems.find(({ id }) => id === toppingItemId)
    setToppingItem(foundMenuItem)
  }, [toppingItems])

  const redirecToEditProduct = () => {
    const path = window.location.href
    const editPath = path.replace('item', 'edit')
    window.location.replace(editPath)
  }

  const onImageChange = (imageFile, addUpdateIndex) => {
    // console.log(imageFile)
    const { file: image } = imageFile[0]
    setToppingItem((prevState) => ({
      ...prevState,
      image,
    }))
  }

  const onFormChange = (e) => {
    const {
      target: { name, value },
    } = e

    setToppingItem((prevState) => {
      return {
        ...prevState,
        [name]: value,
      }
    })
  }

  const onActiveChange = ({ value }) => {
    setToppingItem((prevState) => ({
      ...prevState,
      isActive: value,
    }))
  }

  const onStockStateChange = ({ value }) => {
    setToppingItem((prevState) => ({
      ...prevState,
      state: value,
    }))
  }

  const onSubmit = async () => {
    const { id, name, description, price, image, imageUrl, isActive, state } =
      toppingItem

    setLoading(true)
    let updatedMenuItem
    // Do update cover image
    // if (image) { // Topping doesn't use image
    if (false) {
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
    const toppingItemId = toppingItem.id

    try {
      const { data } = await axios({
        method: 'PATCH',
        url: `${USER_URL}/${merchantId}/restaurant/${restaurantId}/menu/${menuId}/topping-item/${toppingItemId}`,
        data: {
          ...updatedMenuItem,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      NotificationManager.success(
        'Topping item updated successfully',
        'Success',
        3000
      )

      // window.location.reload()
    } catch (error) {
      console.log('Error in Edit Topping Item')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (toppingItems.length === 0 || !toppingItem.id) {
    return <div className='loading'></div>
  }

  return (
    <div className='ToppingItemEdit'>
      <Row>
        <Colxx xxs='12' className='mb-4'>
          <div className='create-restaurant-container'>
            <Card
              className='create-restaurant-card'
              style={{ padding: '30px 40px' }}
            >
              <div className='form-restaurant'>
                <CardTitle className='mb-4'>
                  <IntlMessages id='menu.edit-topping-item' />
                </CardTitle>

                {/* <div className='img-upload-container upload-cover-img'>
                  <div className='upload-label'>
                    <IntlMessages id='menu.item-image' />
                  </div>
                  <div className='img-upload'>
                    <UploadImage
                      onImageChange={onImageChange}
                      limit={1}
                      defaultImageUrl={toppingItem.imageUrl}
                    />
                  </div>
                </div> */}

                <Form onChange={onFormChange} className='mt-4'>
                  <Label className='form-group has-float-label mb-4'>
                    <Input
                      type='text'
                      name='name'
                      defaultValue={toppingItem.name}
                    />
                    <IntlMessages id='menu.item-name' />
                  </Label>

                  <Label className='form-group has-float-label mb-4'>
                    <Input
                      type='textarea'
                      name='description'
                      defaultValue={toppingItem.description}
                    />
                    <IntlMessages id='menu.item-description' />
                  </Label>

                  <Label className='form-group has-float-label mb-4'>
                    <Input
                      type='number'
                      name='price'
                      defaultValue={toppingItem.price}
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
                        (option) => option.value === toppingItem.isActive
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
                        (option) => option.value === toppingItem.state
                      )}
                      onChange={onStockStateChange}
                      // onBlur={handleBlur}
                    />
                    <IntlMessages id='menu.item-in-stock-status' />
                  </Label>

                  <div className='d-flex justify-content-end align-items-center'>
                    <Button
                      color='primary'
                      className={`btn-shadow btn-multiple-state ${
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
export default connect(mapStateToProps, { getToppingItems })(ToppingItemEdit)
