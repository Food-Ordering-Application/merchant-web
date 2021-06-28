import React, { Component } from 'react'
import {
  Row,
  Card,
  CardTitle,
  Label,
  FormGroup,
  Input,
  Button,
} from 'reactstrap'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { registerUser } from '../../redux/actions'

import IntlMessages from '../../helpers/IntlMessages'
import { Colxx } from '../../components/common/CustomBootstrap'
import { Formik, Form, Field } from 'formik'
import { PASSWORD_REGEX } from 'src/helpers/Utils'

const initialValues = {
  // username: 'HappyFood',
  // email: 'happyfood@gmail.com',
  // password: '123456789',
  // confirmPassword: '123456789',
  // phone: '0943123456',
  // idNumber: '272699300',
  // fullName: 'Nguyễn Văn An',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: '',
  idNumber: '',
  fullName: '',
}
class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      password: '',
      loading: false,
    }
  }

  onUserRegister = (values) => {
    // v.preventDefault()
    // if (Object.values(values).includes('')) return

    this.setState({
      loading: true,
    })

    const { registerUser } = this.props
    const {
      email,
      fullName,
      idNumber,
      name,
      password,
      phone,
      username,
      confirmPassword,
    } = values

    // if (confirmPassword !== password) {
    //   console.log('Unmatched password!')
    //   return
    // }

    const user = {
      username,
      password,
      email,
      phone: `${phone}`,
      fullName,
      IDNumber: `${idNumber}`,
    }

    registerUser(user, this.props.history)

    this.setState({
      loading: false,
    })
  }

  validateUsername = (value) => {
    let error
    if (!value) {
      error = 'Please enter your username'
    } else if (value.length < 5) {
      error = 'Username must be longer than 5 character'
    }
    return error
  }

  validateEmail = (value) => {
    let error
    if (!value) {
      error = 'Please enter your email address'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = 'Invalid email address'
    }
    return error
  }

  validatePassword = (value) => {
    let error
    this.setState({ password: value })
    if (!value) {
      error = 'Please enter your password'
    } else if (!new RegExp(PASSWORD_REGEX).test(value)) {
      error =
        'Password must contain at least 8 character with 1 capital letter, 1 normal letter and 1 number character'
    }
    return error
  }

  validateConfirmPassword = (value) => {
    let error
    if (!value) {
      error = 'Please confirm your password'
    } else if (value !== this.state.password) {
      error = 'Password are not matched'
    }
    return error
  }

  validatePhone = (value) => {
    let error
    if (!value) {
      error = 'Please enter your phone number'
    } else if (`${value}`.length < 9 || `${value}`.length > 12) {
      error = 'Phone number is not valid'
    }
    return error
  }

  render() {
    return (
      <Row className='h-100'>
        <Colxx xxs='12' md='10' className='mx-auto my-auto'>
          <Card className='auth-card'>
            <div className='position-relative image-side '>
              <p className='text-white h2'>PHÉP MÀU TRONG SỰ CHI TIẾT</p>
              <p className='white mb-0'>
                Hãy dùng form này để đăng ký. <br />
                Nếu bạn đã có tài khoản, hãy{' '}
                <NavLink
                  to={`/user/login`}
                  className='white'
                  style={{ textDecoration: 'underline' }}
                >
                  đăng nhập
                </NavLink>
                .
              </p>
            </div>
            <div className='form-side'>
              <NavLink to={`/merchant`}>
                <div className='site-logo font-weight-bold'>
                  Smart<span className='text-orange'>Merchant</span>
                </div>
              </NavLink>
              <CardTitle className='mb-4'>
                <IntlMessages id='user.register' />
              </CardTitle>

              <Formik
                initialValues={initialValues}
                onSubmit={this.onUserRegister}
              >
                {({ errors, touched }) => (
                  <Form className='av-tooltip tooltip-label-bottom'>
                    <FormGroup className='form-group has-float-label'>
                      <Label>
                        <IntlMessages id='user.username' />
                      </Label>
                      <Field
                        className='form-control'
                        name='username'
                        validate={this.validateUsername}
                      />
                      {errors.username && touched.username && (
                        <div className='invalid-feedback d-block'>
                          {errors.username}
                        </div>
                      )}
                    </FormGroup>

                    <FormGroup className='form-group has-float-label'>
                      <Label>
                        <IntlMessages id='user.email' />
                      </Label>
                      <Field
                        className='form-control'
                        name='email'
                        validate={this.validateEmail}
                      />
                      {errors.email && touched.email && (
                        <div className='invalid-feedback d-block'>
                          {errors.email}
                        </div>
                      )}
                    </FormGroup>

                    <FormGroup className='form-group has-float-label'>
                      <Label>
                        <IntlMessages id='user.password' />
                      </Label>
                      <Field
                        className='form-control'
                        name='password'
                        type='password'
                        // onChange={this.onPasswordChange}
                        validate={this.validatePassword}
                      />
                      {errors.password && touched.password && (
                        <div className='invalid-feedback d-block'>
                          {errors.password}
                        </div>
                      )}
                    </FormGroup>

                    <FormGroup className='form-group has-float-label'>
                      <Label>
                        <IntlMessages id='user.confirm-password' />
                      </Label>
                      <Field
                        className='form-control'
                        name='confirmPassword'
                        type='password'
                        validate={this.validateConfirmPassword}
                      />
                      {errors.confirmPassword && touched.confirmPassword && (
                        <div className='invalid-feedback d-block'>
                          {errors.confirmPassword}
                        </div>
                      )}
                    </FormGroup>

                    <FormGroup className='form-group has-float-label'>
                      <Label>
                        <IntlMessages id='user.full-name' />
                      </Label>
                      <Field
                        className='form-control'
                        name='fullName'
                        type='text'
                        validate={this.validateFullName}
                      />
                      {errors.fullName && touched.fullName && (
                        <div className='invalid-feedback d-block'>
                          {errors.fullName}
                        </div>
                      )}
                    </FormGroup>

                    <FormGroup className='form-group has-float-label'>
                      <Label>
                        <IntlMessages id='user.phone' />
                      </Label>
                      <Field
                        className='form-control'
                        name='phone'
                        type='number'
                        validate={this.validatePhone}
                      />
                      {errors.phone && touched.phone && (
                        <div className='invalid-feedback d-block'>
                          {errors.phone}
                        </div>
                      )}
                    </FormGroup>

                    <FormGroup className='form-group has-float-label'>
                      <Label>
                        <IntlMessages id='user.id-number' />
                      </Label>
                      <Field
                        className='form-control'
                        name='idNumber'
                        type='number'
                        validate={this.validateIdNumber}
                      />
                      {errors.idNumber && touched.idNumber && (
                        <div className='invalid-feedback d-block'>
                          {errors.idNumber}
                        </div>
                      )}

                      <div className='d-flex justify-content-end align-items-center mt-3 justify-content-between'>
                        <NavLink to={`/merchant/forgot-password`}>
                          <IntlMessages id='user.forgot-password-question' />
                        </NavLink>

                        <Button
                          color='primary'
                          className={`btn-shadow btn-multiple-state ${
                            this.state.loading ? 'show-spinner' : ''
                          }`}
                          disabled={this.state.loading}
                          size='lg'
                        >
                          <span className='spinner d-inline-block'>
                            <span className='bounce1' />
                            <span className='bounce2' />
                            <span className='bounce3' />
                          </span>
                          <span className='label'>
                            <IntlMessages id='user.register-button' />
                          </span>
                        </Button>
                      </div>
                    </FormGroup>
                  </Form>
                )}
              </Formik>
            </div>
          </Card>
        </Colxx>
      </Row>
    )
  }
}
const mapStateToProps = ({ authUser }) => {
  const { user, loading } = authUser
  return { user, loading }
}

export default connect(mapStateToProps, {
  registerUser,
})(Register)
