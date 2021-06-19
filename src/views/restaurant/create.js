import React, { Component, useEffect, useState } from 'react'
import { Row, Card, CardTitle, Form, Label, Input, Button } from 'reactstrap'
import Select from 'react-select'
// import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { createRestaurant } from '../../redux/actions'
import axios from 'axios'

import IntlMessages from '../../helpers/IntlMessages'
import { Colxx } from '../../components/common/CustomBootstrap'
import TimePicker from 'react-time-picker'
import Map from '../../components/map/Map'

import UploadImage from '../../components/common/UploadImage'
import { NotificationManager } from 'src/components/common/react-notifications'
import { sortByDay, uploadFile } from 'src/helpers/Utils'
import { colourStyles, dayOptions, GEOCODE_URL } from 'src/constants'
import ThumbnailLetters from 'src/components/cards/ThumbnailLetters'
import './create-restaurant.scss'

const cityOptions = ['Ho Chi Minh', 'Ha Noi', 'Da Nang']

const initialDays = dayOptions

const SelectHours = (props) => {
  const {
    dayValue,
    day = 'Thứ 2',
    open = '09:00',
    close = '14:00',
    handleOpenTimeChange,
    handleCloseTimeChange,
  } = props
  const [openHour, setOpenHour] = useState(open)
  const [closeHour, setCloseHour] = useState(close)

  useEffect(() => {
    handleOpenTimeChange(open, dayValue)
    handleCloseTimeChange(close, dayValue)
  }, [])

  const onOpenTimeChange = (time) => {
    setOpenHour(time)
    handleOpenTimeChange(time, dayValue)
  }

  const onCloseTimeChange = (time) => {
    setCloseHour(time)
    handleCloseTimeChange(time, dayValue)
  }

  return (
    <div className='time-picker-container'>
      <div className='time-picker-wrapper'>
        <div>
          <span className='day'>{day}</span>
          <span className='time-picker-label'>Giờ mở</span>
          <TimePicker onChange={onOpenTimeChange} value={openHour} />
        </div>

        <div>
          <span className='time-picker-label'>Giờ đóng</span>
          <TimePicker onChange={onCloseTimeChange} value={closeHour} />
        </div>
      </div>
    </div>
  )
}

class CreateRestaurant extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: 'mechant123@foa.com',
      address: '324 Trần Hưng Đạo',
      password: '123123',
      name: 'Quán Phở Ngon',
      phone: '0943123456',
      idNumber: '272699300',
      pictures: [],
      image: null,
      imageUrl: '',
      loadingImage: false,
      openDays: [],
      openTimes: [],
      closeTimes: [],
      cities: [],
      districts: [],
      city: {},
      district: {},
      position: { lng: 106.6799777, lat: 10.762913 }, // Truong KHTN
    }
  }

  componentDidMount() {
    // GET city list
    this.fetchCities()
  }

  fetchCities = async () => {
    const { position, districts, city } = this.state
    const accessToken = localStorage.getItem('access_token')
    const {
      data: {
        data: { cities },
      },
    } = await axios({
      method: 'POST',
      url: `${GEOCODE_URL}/get-cities`,
      // data: {
      //   position: {
      //     latitude: position.lat,
      //     longitude: position.lng,
      //   },
      // },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    if (cities.length > 0) {
      this.setState({
        cities,
      })
    }

    if (Object.keys(city).length === 0) {
      this.setState({
        city: cities[0],
      })
    }

    if (districts.length === 0) {
      this.fetchDistricts(cities[0].id)
    }
  }

  fetchDistricts = async (cityId) => {
    const { position, district } = this.state
    const accessToken = localStorage.getItem('access_token')
    const {
      data: {
        data: {
          city: { districts },
        },
      },
    } = await axios({
      method: 'POST',
      url: `${GEOCODE_URL}/get-districts`,
      data: {
        cityId,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (districts.length > 0) {
      this.setState({
        districts,
      })

      // if (Object.keys(district).length === 0) {
      this.setState({
        district: districts[0],
      })
      // }
    }
  }

  handleMapMove = (position) => {
    this.setState({
      position,
    })
  }

  onMerchantCreate = async () => {
    const {
      name,
      password,
      email,
      phone,
      address,
      image,
      openTimes,
      closeTimes,
      position,
      city,
      district,
    } = this.state
    const { authUser, createRestaurant, history } = this.props

    // Handle location
    // ---- GET city

    // this.setState({
    //   city: cityResult
    // })

    // ---- GET district

    // Handle upload image and get returned download url
    if (!image) return
    this.setState({
      loadingImage: true,
    })
    const imageUrl = await uploadFile(image)
    if (!imageUrl) {
      console.log('Failed in handleUpload')
      return
    }
    this.setState({
      imageUrl,
      loadingImage: false,
    })

    // Validate no empty field
    if (Object.values(this.state).includes('')) {
      NotificationManager.error('Please complete the form', 'Error', 3000)
    }

    const openHourArr = []
    for (let i = 0; i < openTimes.length; i++) {
      const openTime = openTimes[i].open
      const closeTime = closeTimes[i].close

      const fromHour = openTime.split(':')[0] || ''
      const fromMinute = openTime.split(':')[1] || ''

      const toHour = closeTime.split(':')[0] || ''
      const toMinute = closeTime.split(':')[1] || ''

      const day = openTimes[i].day

      openHourArr.push({
        fromHour: parseInt(fromHour),
        fromMinute: parseInt(fromMinute),
        toHour: parseInt(toHour),
        toMinute: parseInt(toMinute),
        day,
      })
    }

    const restaurant = {
      name,
      phone,
      address,
      geo: {
        latitude: position.lat,
        longitude: position.lng,
      },
      openHours: openHourArr,
      // categories: ['RESTAURANT'],
      cityId: city.id,
      district: district.id,
      areaId: district.id,
      categoryIds: [1, 5], // new
      coverImageUrl: imageUrl,
      verifiedImageUrl: imageUrl,
      videoUrl: '0',
    }
    console.log(restaurant)
    // const merchantId = authUser.user.id
    const merchantId = localStorage.getItem('merchant_id')
    createRestaurant(merchantId, restaurant, history)
  }

  onDrop = (picture) => {
    console.log(picture)
    this.setState({
      pictures: this.state.pictures.concat(picture),
    })
  }

  onImageChange = (imageFile, addUpdateIndex) => {
    // data for submit
    const { file: image } = imageFile[0]
    this.setState({
      image,
    })
  }

  onFormChange = (e) => {
    const { name, value } = e.target
    this.setState({
      [name]: value,
    })
  }

  onDayChange = (items) => {
    console.log(items)

    const dayValue = items.map((item) => item.value)
    this.setState((prevState) => {
      const newOpenTimes = [...prevState.openTimes].filter((timeItem) =>
        dayValue.includes(timeItem.day)
      )
      const newCloseTimes = [...prevState.closeTimes].filter((timeItem) =>
        dayValue.includes(timeItem.day)
      )
      return {
        openDays: items,
        openTimes: newOpenTimes,
        closeTimes: newCloseTimes,
      }
    })
  }

  handleOpenTimeChange = (time, day) => {
    console.log('open', time, day)
    let currentOpenTimes = [...this.state.openTimes]

    const existDayIndex = currentOpenTimes.findIndex((item) => item.day === day)

    if (existDayIndex === -1) {
      currentOpenTimes.push({
        day,
        open: time,
      })
    } else {
      currentOpenTimes[existDayIndex].open = time
    }

    this.setState({
      openTimes: currentOpenTimes,
    })

    // {
    //   fromHour: 8,
    //   fromMinute: 0,
    //   toHour: 22,
    //   toMinute: 0,
    //   day: 'Monday',
    // },
  }

  handleCloseTimeChange = (time, day) => {
    console.log('close', time, day)
    let currentCloseTimes = [...this.state.closeTimes]

    const existDayIndex = currentCloseTimes.findIndex(
      (item) => item.day === day
    )

    if (existDayIndex === -1) {
      currentCloseTimes.push({
        day,
        close: time,
      })
    } else {
      currentCloseTimes[existDayIndex].close = time
    }

    this.setState({
      closeTimes: currentCloseTimes,
    })
  }

  onCityChange = (e) => {
    const cityName = e.target.value
    const { cities } = this.state
    const foundCity = cities.find((city) => city.name === cityName)
    this.setState({
      city: foundCity,
    })
    this.fetchDistricts(foundCity.id)
  }

  onDistrictChange = (e) => {
    const districtName = e.target.value
    const { districts } = this.state
    const foundDistrict = districts.find(
      (district) => district.name === districtName
    )
    this.setState({
      district: foundDistrict,
    })
  }

  render() {
    const { cities, districts } = this.state

    return (
      <div className='CreateRestaurant'>
        <Row className='h-100'>
          <Colxx xxs='12' md='10' className='mx-auto my-auto'>
            <div className='create-restaurant-container'>
              <Card style={{ padding: '30px 40px' }}>
                <div className='form-restaurant'>
                  {/* <NavLink to={`/`} className='white'>
                  <span className='logo-single' />
                </NavLink> */}
                  <CardTitle className='mb-4'>
                    <IntlMessages id='restaurant.create' />
                  </CardTitle>

                  <div className='img-upload-container'>
                    <span className='upload-label'>
                      <IntlMessages id='restaurant.coverImg' />
                    </span>
                    <div className='img-upload'>
                      <UploadImage
                        onImageChange={this.onImageChange}
                        limit={1}
                      />
                    </div>
                  </div>

                  <Form onChange={this.onFormChange}>
                    <Label className='form-group has-float-label mb-4'>
                      <Input
                        type='text'
                        name='name'
                        defaultValue={this.state.name}
                      />
                      <IntlMessages id='restaurant.name' />
                    </Label>

                    <Label className='form-group has-float-label mb-4'>
                      <Input
                        type='text'
                        name='phone'
                        defaultValue={this.state.phone}
                      />
                      <IntlMessages id='restaurant.phone' />
                    </Label>

                    <Label className='form-group has-float-label mb-4'>
                      <Input
                        type='select'
                        name='city'
                        id='city-slect'
                        onChange={this.onCityChange}
                      >
                        {cities.map((city) => (
                          <option key={city.id}>{city.name}</option>
                        ))}
                      </Input>
                      <IntlMessages id='restaurant.city' />
                    </Label>

                    <Label className='form-group has-float-label mb-4'>
                      <Input type='select' name='district' id='district-slect'>
                        {districts.map((district) => (
                          <option key={district.id}>{district.name}</option>
                        ))}
                      </Input>
                      <IntlMessages id='restaurant.district' />
                    </Label>
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
                        defaultValue={this.state.address}
                      />
                      <IntlMessages id='restaurant.address' />
                    </Label>

                    <Label className='form-group has-float-label mb-4'>
                      <IntlMessages id='restaurant.open-hours' />
                      <Select
                        placeholder='Chọn ngày hoạt động'
                        closeMenuOnSelect={false}
                        defaultValue={this.state.openDays}
                        value={this.state.openDays}
                        isMulti
                        options={dayOptions}
                        onChange={this.onDayChange}
                        // styles={colourStyles}
                        styles={{
                          // Fixes the overlapping problem of the component
                          menu: (provided) => ({ ...provided, zIndex: 9999 }),
                        }}
                      />

                      {sortByDay(this.state.openDays).map(
                        ({ value, label }) => {
                          return (
                            <SelectHours
                              key={value}
                              dayValue={value}
                              day={label}
                              handleOpenTimeChange={this.handleOpenTimeChange}
                              handleCloseTimeChange={this.handleCloseTimeChange}
                            />
                          )
                        }
                      )}
                    </Label>

                    <Label className='form-group has-float-label mb-4'>
                      {/* <Input type='number' defaultValue={this.state.phone} /> */}
                      <IntlMessages id='restaurant.position' className='mb-3' />

                      <Map
                        handleMapMove={this.handleMapMove}
                        defaultLng={this.state.position.lng}
                        defaultLat={this.state.position.lat}
                      />
                    </Label>

                    <div className='d-flex justify-content-end align-items-center'>
                      <Button
                        color='primary'
                        className={`btn-shadow btn-multiple-state ${
                          this.state.loadingImage ? 'show-spinner' : ''
                        }`}
                        size='lg'
                        onClick={() => this.onMerchantCreate()}
                      >
                        <IntlMessages id='restaurant.create-button' />
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
}
const mapStateToProps = ({ authUser }) => {
  return authUser
}

export default connect(mapStateToProps, {
  createRestaurant,
})(CreateRestaurant)
