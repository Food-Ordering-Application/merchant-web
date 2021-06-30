import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button, Form, FormGroup, Label, Select } from 'reactstrap'
import { Field, Formik } from 'formik'
import IntlMessages from 'src/helpers/IntlMessages'
import { FormikReactSelect } from '../../../containers/form-validations/FormikFields'

import { createToppingItem, getToppingGroup } from '../../../redux/actions'

const ToppingItemCreate = (props) => {
  const {
    getToppingGroup,
    createToppingItem,
    loading,
    history,
    authUser,
    restaurantMenu: { toppingGroups = [], menus = [{ id: '' }] },
    restaurantInfo,
  } = props

  const [toppingGroupOption, setToppingGroupOption] = useState([])

  useEffect(() => {
    const { user } = authUser
    let merchantId
    if (user) {
      merchantId = authUser
    } else {
      merchantId = localStorage.getItem('merchant_id')
    }
    const {
      restaurant: { id: restaurantId = localStorage.getItem('restaurant_id') },
    } = restaurantInfo
    const menuId = menus[0].id || ''
    console.log(merchantId, restaurantId, menuId)
    getToppingGroup({ merchantId, restaurantId, menuId })
  }, [])

  useEffect(() => {
    if (toppingGroups.length === 0) return
    const newToppingroupOption = toppingGroups.map((item) => {
      return {
        value: item.id,
        label: item.name,
      }
    })
    setToppingGroupOption(newToppingroupOption)
  }, [toppingGroups])

  const initialValues = {
    toppingGroup: '',
    name: '',
    description: '',
    price: '',
    isActive: true,
    maxQuant: 1,
    index: '',

    // toppingGroup: '',
    // name: '',
    // description: '',
    // price: '',
    // imageUrl: '',
    // isActive: true,
    // maxQuant: 1,
    // index: 65537,
  }

  const handleSubmit = (values) => {
    console.log('SUBMIT create topping group')
    console.log(values)
    if (loading) {
      return
    }
    // if (values.name !== '' && values.index !== '') {
    //   if (props.onSubmit) props.onSubmit(values)

    //   // createMenuGroup(values, history)
    // }
    const {
      restaurant: { id: restaurantId = localStorage.getItem('restaurant_id') },
    } = restaurantInfo
    // const {
    //   user: { id: merchantId },
    // } = authUser
    const toppingGroupId = values.toppingGroup || toppingGroupOption[0].value
    const merchantId = localStorage.getItem('merchant_id')
    const menuId = menus[0].id || ''
    console.log(menuId)
    createToppingItem({
      merchantId,
      restaurantId,
      menuId,
      toppingGroupId,
      data: { ...values, maxQuantity: values.maxQuant },
    })

    // console.log(createSuccess)
    // if (createSuccess) {
    //   history.push('/app/dishes/create/menu-item')
    // }
  }

  const validateName = (value) => {
    let error
    if (!value) {
      error = `Please enter topping's name`
    } else if (value.length < 2) {
      error = 'Value must be longer than 2 characters'
    }
    return error
  }

  const validateDescription = (value) => {
    let error
    if (!value) {
      error = `Please enter topping's description`
    } else if (value.length < 2) {
      error = 'Value must be longer than 2 characters'
    }
    return error
  }

  const validatePrice = (value) => {
    let error
    // if (!value) {
    //   error = `Please enter topping's price`
    // } else if (value.length < 2) {
    //   error = 'Value must be longer than 2 characters'
    // }
    return error
  }

  const validateImage = (value) => {
    let error
    if (!value) {
      error = `Please enter topping's image url`
    } else if (value.length < 2) {
      error = 'Value must be longer than 2 characters'
    }
    return error
  }

  const validateMaxQuantity = (value) => {
    let error
    if (!value) {
      error = `Please enter topping's max quantity`
    } else if (isNaN(value)) {
      error = 'Value must be a number'
    }
    return error
  }

  const validateIndex = (value) => {
    let error
    if (!value) {
      error = `Please enter topping's index`
    } else if (isNaN(value)) {
      error = 'Value must be a number'
    }
    return error
  }

  const handleMenuGroupChange = (v) => {
    console.log('Change'.v)
  }

  return (
    <div className='mb-4'>
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
                {/* <IntlMessages id='menu.select-menu-group' /> */}
                Nhóm topping
              </Label>
              <select
                name='toppingGroup'
                className='form-control'
                value={values.toppingGroup}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                {toppingGroupOption.length > 0 &&
                  toppingGroupOption.map((item) => {
                    return <option value={item.value}>{item.label}</option>
                  })}
              </select>

              {errors.toppingGroup && touched.toppingGroup ? (
                <div className='invalid-feedback d-block'>
                  {errors.toppingGroup}
                </div>
              ) : null}
            </FormGroup>

            <FormGroup className='form-group has-float-label'>
              <Label>
                <IntlMessages id='menu.topping-item-name' />
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
                <IntlMessages id='menu.topping-item-description' />
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
                <IntlMessages id='menu.topping-item-price' />
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
                <IntlMessages id='menu.topping-item-image' />
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

            <FormGroup className='form-group has-float-label'>
              <Label>
                <IntlMessages id='menu.topping-item-max-quantity' />
              </Label>
              <Field
                className='form-control'
                name='maxQuant'
                type='number'
                validate={validateMaxQuantity}
              />
              {errors.maxQuant && touched.maxQuant && (
                <div className='invalid-feedback d-block'>
                  {errors.maxQuant}
                </div>
              )}
            </FormGroup>

            <FormGroup className='form-group has-float-label'>
              <Label>
                <IntlMessages id='menu.topping-item-index' />
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
                props.loading ? 'show-spinner' : ''
              }`}
              size='lg'
            >
              <span className='spinner d-inline-block'>
                <span className='bounce1' />
                <span className='bounce2' />
                <span className='bounce3' />
              </span>
              <span className='label'>
                <IntlMessages id='menu.topping-item-create-btn' />
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
  createToppingItem,
  getToppingGroup,
})(ToppingItemCreate)
