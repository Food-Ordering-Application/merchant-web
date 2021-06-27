import React, { Component } from 'react'
import { Row, Card, CardTitle, Form, Label, Input, Button } from 'reactstrap'

// import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { registerStaff } from '../../../redux/actions'

import IntlMessages from '../../../helpers/IntlMessages'
import { Colxx } from '../../../components/common/CustomBootstrap'
import DatePicker from '../../../components/common/DatePicker'

import './create.scss'
// import UploadImage from '../../../components/common/UploadImage'
import { isEmpty } from '../../utils'
import { NotificationManager } from 'src/components/common/react-notifications'

const cityOptions = ['Ho Chi Minh', 'Ha Noi', 'Da Nang']

class CreateStaff extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: 'hue-nguyen-001',
      password: '123123',
      phone: '0943123456',
      firstName: 'Huệ',
      lastName: 'Nguyễn',
      idNumber: '272699300',
      dob: '1999-01-01',
    }
  }

  onUserRegister = () => {
    const { username, password, phone, firstName, lastName, idNumber, dob } =
      this.state

    const { history } = this.props
    if (
      !isEmpty([username, password, phone, firstName, lastName, idNumber, dob])
    ) {
      // this.props.history.push('/')
      const user = {
        username,
        password,
        phone,
        firstName,
        lastName,
        dateOfBirth: dob,
        IDNumber: idNumber,
      }
      console.log(user)
      this.props.registerStaff(user, history)
    }
  }

  onDrop = (picture) => {
    console.log(picture)
    this.setState({
      pictures: this.state.pictures.concat(picture),
    })
  }

  onImageChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex)
    this.setState({ images: imageList })
  }

  onDobChange = (v, f) => {
    this.setState({
      dob: v,
    })
  }

  onFormChange = (e, b) => {
    const {
      target: { name, value },
    } = e
    this.setState({
      [name]: value,
    })
  }

  componentDidUpdate() {
    if (this.props.error) {
      NotificationManager.warning(
        this.props.error,
        'Login Error',
        3000,
        null,
        null,
        ''
      )
    }
  }

  handleOnChange = (a, b) => {
    console.log(a.target.name)
    console.log(a.target.value)
    console.log(b)
  }

  render() {
    return (
      <Row className='h-100'>
        <Colxx xxs='12' md='10' className='mx-auto my-auto'>
          <div className='create-restaurant-container'>
            <Card style={{ padding: '30px 40px' }}>
              <div className='form-restaurant'>
                {/* <NavLink to={`/`} className='white'>
                  <span className='logo-single' />
                </NavLink> */}
                <CardTitle className='mb-4'>
                  <IntlMessages id='staff.create' />
                </CardTitle>

                <Form onChange={this.onFormChange}>
                  <Label className='form-group has-float-label mb-4'>
                    <Input
                      type='text'
                      name='username'
                      defaultValue={this.state.username}
                      // onChange={this.handleOnChange}
                    />
                    <IntlMessages id='staff.username' />
                  </Label>

                  <Row>
                    <Colxx md='6'>
                      <Label className='form-group has-float-label mb-4'>
                        <Input
                          type='text'
                          name='firstName'
                          defaultValue={this.state.firstName}
                        />
                        <IntlMessages id='staff.first-name' />
                      </Label>
                    </Colxx>
                    <Colxx md='6'>
                      <Label className='form-group has-float-label mb-4'>
                        <Input
                          type='text'
                          name='lastName'
                          defaultValue={this.state.lastName}
                        />
                        <IntlMessages id='staff.last-name' />
                      </Label>
                    </Colxx>
                  </Row>

                  <Label className='form-group has-float-label mb-4'>
                    <Input
                      type='number'
                      name='phone'
                      defaultValue={this.state.phone}
                    />
                    <IntlMessages id='staff.phone' />
                  </Label>

                  <Label className='form-group has-float-label mb-4'>
                    <IntlMessages id='staff.dob' />
                  </Label>
                  <DatePicker
                    value={this.state.dob}
                    onDateChange={this.onDobChange}
                    format='YYYY-MM-DD'
                  />

                  <Label className='form-group has-float-label mb-4'>
                    <Input type='select' name='city' id='city-slect'>
                      {cityOptions.map((city) => (
                        <option key={city}>{city}</option>
                      ))}
                    </Input>
                    <IntlMessages id='staff.city' />
                  </Label>

                  <Label className='form-group has-float-label mb-4'>
                    <Input
                      type='number'
                      name='idNumber'
                      defaultValue={this.state.idNumber}
                    />
                    <IntlMessages id='staff.id-number' />
                  </Label>

                  <Label className='form-group has-float-label mb-4'>
                    <Input
                      type='password'
                      name='password'
                      defaultValue={this.state.password}
                    />
                    <IntlMessages id='staff.password' />
                  </Label>

                  <div className='d-flex justify-content-end align-items-center'>
                    <Button
                      color='primary'
                      className='btn-shadow'
                      size='lg'
                      onClick={() => this.onUserRegister()}
                    >
                      <IntlMessages id='staff.create-button' />
                    </Button>
                  </div>
                </Form>
              </div>
            </Card>
          </div>
        </Colxx>
      </Row>
    )
  }
}

// export default CreateStaff

const mapStateToProps = ({ staffUser }) => {
  const { user, loading, error } = staffUser
  console.log(staffUser)
  return { user, loading, error }
}

export default connect(mapStateToProps, {
  registerStaff,
})(CreateStaff)
