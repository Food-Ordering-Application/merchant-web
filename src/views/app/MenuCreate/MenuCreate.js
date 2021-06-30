import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Label,
} from 'reactstrap'
import { Field, Formik, isObject } from 'formik'
import IntlMessages from 'src/helpers/IntlMessages'
import Select from 'react-select'

import { getMenus } from '../../../redux/actions'
import axios from 'axios'
import { BASE_URL, USER_URL } from 'src/constants'
import { NotificationManager } from 'src/components/common/react-notifications'

const Menu = (props) => {
  const {
    menu: { id, index, isActive, name, restaurantMenu },
    history,
  } = props

  const onMenuClick = () => {
    history.push(`/app/dishes/${id}`)
  }

  return (
    <Card
      style={{ cursor: 'pointer', opacity: isActive ? 1 : 0.5 }}
      onClick={onMenuClick}
    >
      <CardBody>
        <h2>{name}</h2>
        {/* <p>Index: {index}</p> */}
        <p>{isActive ? 'Active' : 'Inactive'} </p>
      </CardBody>
    </Card>
  )
}

const MenuCreate = (props) => {
  const {
    // authUser: {
    //   user: { id: merchantId }
    // },
    restaurantInfo: {
      restaurant: { id: restaurantId = localStorage.getItem('restaurant_id') },
    },
    restaurantMenu: { menus, loading: fetchLoading, error, menu },
    getMenu,
    history,
  } = props

  const [isActive, setIsActive] = useState(true)

  const [loading, setLoading] = useState(false)

  const initialValues = {
    menuName: '',
    isActive: true,
    index: 1,
  }

  // const merchantId = `2487f7ec-2f25-4692-a2d5-97a7a471ebbd`
  const merchantId = localStorage.getItem('merchant_id')

  useEffect(() => {
    console.log(props)
    console.log(merchantId)
    console.log(restaurantId)
    // getMenu(merchantId, restaurantId)
  }, [])

  const handleCreateMenu = async (values) => {
    try {
      setLoading(true)
      const { menuName, isActive, index } = values
      const accessToken = localStorage.getItem('access_token')
      const { data } = await axios({
        method: 'POST',
        url: `${USER_URL}/${merchantId}/restaurant/${restaurantId}/menu`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          name: menuName,
          isActive,
          index,
        },
      })
      if (data) {
        const {
          data: {
            menu: { id: menuId },
          },
        } = data
        NotificationManager.success('New menu created', 'Success', 3000)
        history.push(`/app/dishes/create/${menuId}`)
      } else {
        console.log('Error in create new menu. No response found!')
      }
    } catch (error) {
      console.log('Error in create new menu')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const validateMenuName = (value) => {
    let error
    if (!value || value.trim().length === 0) {
      error = 'Please enter your menu name'
    } else if (value.length < 2) {
      error = 'Name must be longer than 2 characters'
    }
    return error
  }

  const validateIndex = (value) => {
    let error
    if (!value) {
      error = 'Please enter your menu index'
    }
    return error
  }

  if (fetchLoading || loading) {
    return <div className='loading'></div>
  }

  if (menus.length === 0 && !fetchLoading) {
    return (
      <div>
        <h3>
          <IntlMessages id='menu.create-title' />
        </h3>

        <div className='mt-4'>
          <Formik initialValues={initialValues} onSubmit={handleCreateMenu}>
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
                    <IntlMessages id='menu.menu-name' />
                  </Label>
                  <Field
                    className='form-control'
                    name='menuName'
                    validate={validateMenuName}
                  />
                  {errors.menuName && touched.menuName && (
                    <div className='invalid-feedback d-block'>
                      {errors.menuName}
                    </div>
                  )}
                </FormGroup>

                <FormGroup className='form-group has-float-label'>
                  <Label>
                    <IntlMessages id='menu.index' />
                  </Label>
                  <Field
                    className='form-control'
                    name='index'
                    type='number'
                    validate={validateIndex}
                  />
                  {errors.index && touched.index && (
                    <div className='invalid-feedback d-block'>
                      {errors.index}
                    </div>
                  )}
                </FormGroup>

                {/* Select here */}
                {/* <FormGroup className='form-group has-float-label'>
                  <Select
                    // components={{ Input: CustomSelectInput }}
                    className='react-select'
                    classNamePrefix='react-select'
                    name='isActive'
                    value={'active'}
                    defaultValue='active'
                    // onChange={(e) => setIsActive(e.value)}
                    options={[
                      { label: 'Active', value: 'active' },
                      { label: 'Inactive', value: 'inactive' },
                    ]}
                  />
                </FormGroup> */}

                <Button
                  color='primary'
                  className={`btn-shadow btn-multiple-state ${
                    loading ? 'show-spinner' : ''
                  }`}
                  size='lg'
                >
                  <span className='spinner d-inline-block'>
                    <span className='bounce1' />
                    <span className='bounce2' />
                    <span className='bounce3' />
                  </span>
                  <span className='label'>
                    <IntlMessages id='menu.menu-create-btn' />
                  </span>
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 style={{ marginBottom: 15 }}>Danh sách menu</h2>
      {menus.map((menu) => {
        return <Menu key={menu.id} menu={menu} history={history} />
      })}
    </div>
  )
}

const mapStateToProps = ({ authUser, restaurantInfo, restaurantMenu }) => {
  return {
    authUser,
    restaurantInfo,
    restaurantMenu,
  }
}

export default connect(mapStateToProps, {
  getMenu: getMenus,
})(MenuCreate)
