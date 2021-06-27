import React, { Component, Fragment, useEffect } from 'react'
import { getRestaurant } from 'src/redux/actions'
import {
  BASE_URL,
  colourStyles,
  dayOptions,
  GEOCODE_URL,
  USER_URL,
} from 'src/constants'
import {
  Row,
  Badge,
  Card,
  CardTitle,
  Form,
  Label,
  Input,
  Button,
} from 'reactstrap'
import Select from 'react-select'
import { connect } from 'react-redux'
import axios from 'axios'

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
// import Banner from '../../../assets/images/banner.jpg'
// import Banner from './banner.jpg'
// import Banner from './banner.jpg'

import './edit.scss'
import { useState } from 'react'

const EditProfile = (props) => {
  const {
    restaurantInfo: { restaurant },
  } = props

  const [info, setInfo] = useState({
    id: '',
    email: '',
    address: '',
    password: '',
    name: '',
    phone: '',
    idNumber: '',
    pictures: [],
    image: null,
    imageUrl: '',
    loadingImage: false,
    // position: { lng: 106.6799777, lat: 10.762913 }, // Truong KHTN
    position: { lng: 0, lat: 0 }, // Truong KHTN
  })

  const [loadingImage, setLoadingImage] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const { getRestaurant } = props
    const restaurantId = localStorage.getItem('restaurant_id')
    const merchantId = localStorage.getItem('merchant_id')

    if (!restaurant.id) {
      getRestaurant(merchantId, restaurantId)
    }
  }, [])

  useEffect(() => {
    console.log(restaurant)
    if (!restaurant.id) return
    const {
      id,
      address,
      phone,
      name,
      position: { longitude, latitude },
      coverImageUrl,
      verifiedImageUrl,
    } = restaurant
    setInfo((prevState) => {
      return {
        ...prevState,
        id,
        name,
        phone,
        address,
        imageUrl: coverImageUrl,
        position: { lng: longitude, lat: latitude },
        // position: { lng: latitude, lat: longitude },
      }
    })
  }, [restaurant])

  const onImageChange = (imageFile, addUpdateIndex) => {
    console.log(imageFile)
    const { file: image } = imageFile[0]
    setInfo((prevState) => ({
      ...prevState,
      image,
    }))
  }
  const onCityChange = () => {}
  const onDistrictChange = () => {}

  const handleOpenTimeChange = () => {}
  const handleCloseTimeChange = () => {}
  const onDayChange = () => {}
  const handleMapMove = () => {}

  const onFormChange = (e) => {
    const {
      target: { name, value },
    } = e

    setInfo((prevState) => {
      return {
        ...prevState,
        [name]: value,
      }
    })
  }

  const onSubmit = async () => {
    const {
      image,
      imageUrl,
      id,
      address,
      phone,
      name,
      position: { lng, lat },
    } = info

    setLoading(true)
    console.log(image)
    let updatedRestaurant
    // Do update cover image
    if (image) {
      setLoadingImage(true)
      console.log('up file')
      const newImageUrl = await uploadFile(image)
      if (!newImageUrl) {
        console.log('Failed in handleUpload')
        return
      }
      setLoadingImage(false)
      // setInfo((prevState) => {
      //   return {
      //     ...prevState,
      //     imageUrl: newImageUrl,
      //   }
      // })
      updatedRestaurant = {
        id,
        address,
        phone,
        name,
        geo: {
          latitude: lat,
          longitude: lng,
        },
        coverImageUrl: newImageUrl,
        verifiedImageUrl: newImageUrl,
      }
    }

    // Use existing cover image
    else {
      updatedRestaurant = {
        id,
        address,
        phone,
        name,
        geo: {
          latitude: lat,
          longitude: lng,
        },
        coverImageUrl: imageUrl,
        verifiedImageUrl: imageUrl,
      }
    }

    console.log(updatedRestaurant)
    const restaurantId = id
    const merchantId = localStorage.getItem('merchant_id')
    const accessToken = localStorage.getItem('access_token')
    try {
      const { data } = await axios({
        method: 'PATCH',
        url: `${USER_URL}/${merchantId}/restaurant/${restaurantId}`,
        data: {
          ...updatedRestaurant,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      NotificationManager.success(
        'Restaurant updated successfully',
        'Success',
        3000
      )
      window.reload()

      console.log(data)
    } catch (error) {
      console.log('Error in Edit Restaurant Profile')
      console.error(error)
    } finally {
      setLoading(false)
    }

    // Validate no empty field
    // if (Object.values(this.state).includes('')) {
    //   NotificationManager.error('Please complete the form', 'Error', 3000)
    // }
  }

  if (!restaurant.id) {
    return <div className='loading'></div>
  }

  return (
    <div className='EditRestaurant'>
      <Row>
        <Colxx xxs='12'>
          <Breadcrumb heading='menu.home' match={props.match} />
          <Separator className='mb-5' />
        </Colxx>
      </Row>
      <Row>
        <Colxx xxs='12' className='mb-4'>
          {/* <FormikBasicFieldLevel /> */}
          {/* <ProfileForm /> */}
          <div className='create-restaurant-container'>
            <Card
              className='create-restaurant-card'
              style={{ padding: '30px 40px' }}
            >
              <div className='form-restaurant'>
                {/* <NavLink to={`/`} className='white'>
                  <span className='logo-single' />
                </NavLink> */}
                <CardTitle className='mb-4'>
                  <IntlMessages id='restaurant.edit' />
                </CardTitle>

                <div className='img-upload-container upload-cover-img'>
                  <div className='upload-label'>
                    <IntlMessages id='restaurant.coverImg' />
                  </div>
                  <div className='img-upload'>
                    <UploadImage
                      onImageChange={onImageChange}
                      limit={1}
                      defaultImageUrl={info.imageUrl}
                    />
                  </div>
                </div>

                <Form onChange={onFormChange}>
                  <Label className='form-group has-float-label mb-4'>
                    <Input type='text' name='name' defaultValue={info.name} />
                    <IntlMessages id='restaurant.name' />
                  </Label>

                  <Label className='form-group has-float-label mb-4'>
                    <Input type='text' name='phone' defaultValue={info.phone} />
                    <IntlMessages id='restaurant.phone' />
                  </Label>

                  {/* <Label className='form-group has-float-label mb-4'>
                    <Input
                      type='select'
                      name='city'
                      id='city-slect'
                      onChange={onCityChange}
                    >
                      {cities.map((city) => (
                        <option key={city.id}>{city.name}</option>
                      ))}
                    </Input>
                    <IntlMessages id='restaurant.city' />
                  </Label>

                  <Label className='form-group has-float-label mb-4'>
                    <Input
                      type='select'
                      name='district'
                      id='district-slect'
                      onChange={onDistrictChange}
                    >
                      {districts.map((district) => (
                        <option key={district.id}>{district.name}</option>
                      ))}
                    </Input>
                    <IntlMessages id='restaurant.district' />
                  </Label> */}

                  {/* <Label className='form-group has-float-label mb-4'>
                      <Input type='select' name='area' id='area-slect'>
                        {districts.map((city) => (
                          <option key={city.id}>{city.name}</option>
                        ))}
                      </Input>
                      <IntlMessages id='restaurant.area' />
                    </Label> */}

                  <Label className='form-group has-float-label mb-4'>
                    <Input
                      type='text'
                      name='address'
                      defaultValue={info.address}
                    />
                    <IntlMessages id='restaurant.address' />
                  </Label>

                  {/* <Label className='form-group has-float-label mb-4'>
                    <IntlMessages id='restaurant.open-hours' />
                    <Select
                      placeholder='Chọn ngày hoạt động'
                      closeMenuOnSelect={false}
                      defaultValue={info.openDays}
                      value={info.openDays}
                      isMulti
                      options={dayOptions}
                      onChange={onDayChange}
                      // styles={colourStyles}
                      styles={{
                        // Fixes the overlapping problem of the component
                        menu: (provided) => ({ ...provided, zIndex: 9999 }),
                      }}
                    />

                    {sortByDay(info.openDays).map(({ value, label }) => {
                      return (
                        <HourSelect
                          key={value}
                          dayValue={value}
                          day={label}
                          handleOpenTimeChange={handleOpenTimeChange}
                          handleCloseTimeChange={handleCloseTimeChange}
                        />
                      )
                    })}
                  </Label> */}

                  <Label className='form-group has-float-label mb-4'>
                    {/* <Input type='number' defaultValue={phone} /> */}
                    <IntlMessages id='restaurant.position' className='mb-3' />

                    {info.position.lng !== 0 && (
                      <Map
                        handleMapMove={handleMapMove}
                        defaultLng={info.position.lng}
                        defaultLat={info.position.lat}
                      />
                    )}
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

// export default EditProfile
const mapStateToProps = ({ authUser, restaurantInfo, restaurantMenu }) => {
  return {
    authUser,
    restaurantInfo,
    restaurantMenu,
  }
}

export default connect(mapStateToProps, { getRestaurant })(EditProfile)
