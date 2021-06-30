import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button, Form, FormGroup, Label, Select } from 'reactstrap'
import { Field, Formik } from 'formik'
import IntlMessages from 'src/helpers/IntlMessages'
import { storage } from '../../../helpers/Firebase'
import UploadImage from '../../../components/common/UploadImage'
import { FormikReactSelect } from '../../../containers/form-validations/FormikFields'

import { createMenuItem } from '../../../redux/actions'

import './MenuItemCreate.scss'
import { uploadFile } from 'src/helpers/Utils'

const MenuItemCreate = (props) => {
  const {
    createMenuItem,
    loading,
    history,
    authUser,
    restaurantMenu: { menuGroup = [], menus = [] },
    restaurantInfo,
  } = props

  const [menuGroupOption, setMenuGroupOption] = useState([])
  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const [imageLoading, setImageLoading] = useState(false)

  useEffect(() => {
    if (menuGroup.length === 0) return
    const newMenuGroupOption = menuGroup.map((item) => {
      return {
        value: item.id,
        label: item.name,
      }
    })
    setMenuGroupOption(newMenuGroupOption)
  }, [menuGroup])

  useEffect(() => {
    handleUpload()
  }, [image])

  const initialValues = {
    // menuGroup: '',
    // name: 'Hủ tiếu nam vang',
    // description: 'Mô tả hủ tiếu ...',
    // price: '45000',
    // imageUrl:
    //   'https://vcdn-dulich.vnecdn.net/2019/01/08/500-HutieuThanhDat-VnExpress-S-9075-3252-1546913049.jpg',
    // isActive: true,
    // index: 65537,
    menuGroup: '',
    name: '',
    description: '',
    price: '',
    isActive: true,
    index: '',
  }

  const handleUpload = async () => {
    if (!image) return
    setImageLoading(true)
    const imageUrl = await uploadFile(image)
    if (!imageUrl) {
      console.log('Failed in handleUpload')
      return
    }
    setImageUrl(imageUrl)
    setImageLoading(false)
  }

  const handleSubmit = (values) => {
    console.log('SUBMIT create group')
    console.log(values)
    if (loading) {
      return
    }
    if (!imageUrl) {
      console.log('No image specifed')
      return
    }
    // if (values.name !== '' && values.index !== '') {
    //   if (props.onSubmit) props.onSubmit(values)

    //   // createMenuGroup(values, history)
    // }
    const {
      restaurant: { id: restaurantId },
    } = restaurantInfo
    // const {
    //   user: { id: merchantId },
    // } = authUser
    const menuGroupId = values.menuGroup || menuGroupOption[0].value
    const merchantId = localStorage.getItem('merchant_id')
    const menuId = menus[0].id || ''
    createMenuItem({
      merchantId,
      restaurantId,
      menuId,
      menuGroupId,
      data: { ...values, imageUrl },
      history,
    })

    // console.log(createSuccess)
    // if (createSuccess) {
    //   history.push('/app/dishes/create/menu-item')
    // }
  }

  const validateName = (value) => {
    let error
    if (!value) {
      error = `Please enter menu's name`
    } else if (value.length < 2) {
      error = 'Value must be longer than 2 characters'
    }
    return error
  }

  const validateDescription = (value) => {
    let error
    if (!value) {
      error = `Please enter menu's description`
    } else if (value.length < 2) {
      error = 'Value must be longer than 2 characters'
    }
    return error
  }

  const validatePrice = (value) => {
    let error
    if (!value) {
      error = `Please enter menu group menu's price`
    } else if (value.length < 2) {
      error = 'Value must be longer than 2 characters'
    }
    return error
  }

  const validateImage = (value) => {
    let error
    if (!value) {
      error = `Please enter menu's image url`
    } else if (value.length < 2) {
      error = 'Value must be longer than 2 characters'
    }
    return error
  }

  const validateIndex = (value) => {
    let error
    if (!value) {
      error = `Please enter menu's index`
    } else if (isNaN(value)) {
      error = 'Value must be a number'
    }
    return error
  }

  const handleMenuGroupChange = (v) => {
    console.log('Change'.v)
  }

  const onImageChange = (value) => {
    const { file } = value[0]
    setImage(file)
  }

  return (
    <div className='MenuItemCreate mb-4'>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
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
                <IntlMessages id='menu.select-menu-group' />
              </Label>
              <select
                name='menuGroup'
                className='form-control'
                value={values.menuGroup}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                {menuGroupOption.length > 0 &&
                  menuGroupOption.map((item) => {
                    return (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    )
                  })}
              </select>

              {errors.menuGroup && touched.menuGroup ? (
                <div className='invalid-feedback d-block'>
                  {errors.menuGroup}
                </div>
              ) : null}
            </FormGroup>

            <FormGroup className='form-group has-float-label'>
              <Label>
                <IntlMessages id='menu.menu-item-name' />
              </Label>
              <Field
                className='form-control'
                name='name'
                validate={validateName}
              />
              {errors.name && touched.name && (
                <div className='invalid-feedback d-block'>{errors.name}</div>
              )}
            </FormGroup>

            <FormGroup className='form-group has-float-label'>
              <Label>
                <IntlMessages id='menu.menu-item-description' />
              </Label>
              <Field
                className='form-control'
                name='description'
                validate={validateDescription}
              />
              {errors.description && touched.description && (
                <div className='invalid-feedback d-block'>
                  {errors.description}
                </div>
              )}
            </FormGroup>

            <FormGroup className='form-group has-float-label'>
              <Label>
                <IntlMessages id='menu.menu-item-price' />
              </Label>
              <Field
                className='form-control'
                name='price'
                type='number'
                validate={validatePrice}
              />
              {errors.price && touched.price && (
                <div className='invalid-feedback d-block'>{errors.price}</div>
              )}
            </FormGroup>

            {/* <FormGroup className='form-group has-float-label'>
              <Label>
                <IntlMessages id='menu.menu-item-image' />
              </Label>
              <Field
                className='form-control'
                name='imageUrl'
                validate={validateImage}
              />
              {errors.imageUrl && touched.imageUrl && (
                <div className='invalid-feedback d-block'>
                  {errors.imageUrl}
                </div>
              )}
            </FormGroup> */}

            <div className='img-upload-container'>
              <span className='upload-img-label'>
                <IntlMessages id='restaurant.menu-item-img' />
              </span>
              <div className='img-upload'>
                <UploadImage onImageChange={onImageChange} limit={1} />
              </div>
            </div>

            <FormGroup className='form-group has-float-label mt-4'>
              <Label>
                <IntlMessages id='menu.menu-item-index' />
              </Label>
              <Field
                className='form-control'
                name='index'
                type='number'
                validate={validateIndex}
              />
              {errors.index && touched.index && (
                <div className='invalid-feedback d-block'>{errors.index}</div>
              )}
            </FormGroup>

            {/* <FormGroup className='form-group has-float-label'>
              <Label>
                <IntlMessages id='menu.group-index' />
              </Label>
              <Field
                className='form-control'
                name='index'
                type='number'
                validate={validateIndex}
              />
              {errors.index && touched.index && (
                <div className='invalid-feedback d-block'>{errors.index}</div>
              )}
            </FormGroup> */}

            <Button
              color='primary'
              className={`btn-shadow btn-multiple-state ${
                imageLoading ? 'show-spinner' : ''
              }`}
              size='lg'
            >
              <span className='spinner d-inline-block'>
                <span className='bounce1' />
                <span className='bounce2' />
                <span className='bounce3' />
              </span>
              <span className='label'>
                <IntlMessages id='menu.menu-item-create-btn' />
              </span>
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

// export default MenuItemCreate

const mapStateToProps = ({
  restaurantMenu,
  merchantUser,
  authUser,
  restaurantInfo,
}) => ({
  restaurantMenu,
  merchantUser,
  authUser,
  restaurantInfo,
})

export default connect(mapStateToProps, {
  createMenuItem,
})(MenuItemCreate)
