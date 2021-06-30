import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button, Form, FormGroup, Label, Select } from 'reactstrap'
import { Field, Formik } from 'formik'
import IntlMessages from 'src/helpers/IntlMessages'
import { FormikReactSelect } from '../../../containers/form-validations/FormikFields'

import { createToppingGroup } from '../../../redux/actions'
import localStorage from 'redux-persist/es/storage'

const ToppingGroupCreate = (props) => {
  const {
    createToppingGroup,
    loading,
    history,
    authUser,
    restaurantMenu: {
      menuGroup = [],
      menus = [],
      toppingGroups = [],
      loadingToppingGroups = false,
    },
    restaurantInfo,
  } = props

  const [menuGroupOption, setMenuGroupOption] = useState([])

  const initialValues = {
    // name: '',
    name: '',
    isActive: true,
    index: '',
  }

  const handleSubmit = async (values) => {
    console.log('SUBMIT create group')
    console.log(values)
    if (loadingToppingGroups) {
      return
    }
    // if (values.name !== '' && values.index !== '') {
    //   if (props.onSubmit) props.onSubmit(values)
    //   return
    //   // createMenuGroup(values, history)
    // }
    if ([...Object.values(values)].includes('')) return

    let {
      restaurant: { id: restaurantId },
    } = restaurantInfo
    // const {
    //   user: { id: merchantId },
    // } = authUser
    const merchantId = await localStorage.getItem('merchant_id')
    if (!restaurantId) {
      restaurantId = await localStorage.getItem('restaurant_id')
    }
    const menuId = menus[0].id || ''
    createToppingGroup({
      merchantId,
      restaurantId,
      menuId,
      data: values,
    })
  }

  const validateName = (value) => {
    let error
    if (!value) {
      error = `Please enter group's name`
    } else if (value.length < 2) {
      error = 'Value must be longer than 2 characters'
    }
    return error
  }

  const validateIndex = (value) => {
    let error
    if (!value) {
      error = `Please enter group's index`
    } else if (value.length < 2) {
      error = 'Value must be longer than 2 characters'
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
                <IntlMessages id='menu.topping-group-name' />
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
                <IntlMessages id='menu.topping-group-create-btn' />
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
  createToppingGroup,
})(ToppingGroupCreate)
