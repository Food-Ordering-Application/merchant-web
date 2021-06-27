import React, { Component } from 'react'
import {
  Row,
  Card,
  CardTitle,
  Label,
  FormGroup,
  Button,
  CardBody,
  Pagination,
  PaginationItem,
  PaginationLink,
} from 'reactstrap'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import clsx from 'clsx'
import axios from 'axios'

import { NotificationManager } from '../../components/common/react-notifications'
import { Formik, Form, Field } from 'formik'

import { loginUser, setRestaurant } from '../../redux/actions'
import { Colxx } from '../../components/common/CustomBootstrap'
import IntlMessages from '../../helpers/IntlMessages'

import { USER_URL } from '../../constants/config'

import './restaurant.scss'
import './select.scss'

const RestaurantSelectItem = (props) => {
  const {
    restaurant: {
      area,
      city,
      address,
      contractId,
      id,
      isActive,
      isVerified,
      name,
      phone,
      posAppKey,
      coverImageUrl = `https://toplist.vn/images/800px/pho-bo-thai-can-347645.jpg`,
    },
  } = props

  const onRestaurantSelect = () => {
    const { restaurant, setRestaurant } = props
    console.log(restaurant)
    localStorage.setItem('restaurant_id', restaurant.id)
    setRestaurant(restaurant)
  }

  const statusText = isActive ? `Đang mở cửa` : `Đang đóng cửa`

  return (
    <div onClick={onRestaurantSelect}>
      <NavLink to={`/`}>
        <Card className='restaurant-card'>
          <CardBody>
            <Row className='d-flex align-items-center'>
              {isVerified && (
                <span className='check-icon'>
                  <i className='bx bxs-check-circle'></i>
                </span>
              )}

              <Colxx md='4'>
                <div className='avatar'>
                  <img src={coverImageUrl} alt='restanrant-1' />
                </div>
              </Colxx>
              <Colxx md='8'>
                <p className='title mb-3'>{name}</p>

                <p className='address mb-1'>
                  <span>Địa chỉ: </span>
                  <span>{address} </span>
                </p>

                <p className='phone mb-1'>
                  <span>Số điện thoại: </span>
                  <span>{phone} </span>
                </p>

                <div className='status d-flex align-items-center'>
                  <box-icon
                    name='door-open'
                    type='solid'
                    color={isActive ? 'orange' : 'red'}
                  ></box-icon>
                  <span
                    className={clsx(
                      'ml-1',
                      isActive ? 'text-orange' : 'text-red'
                    )}
                  >
                    {statusText}
                  </span>
                </div>
              </Colxx>
            </Row>
          </CardBody>
        </Card>
      </NavLink>
    </div>
  )
}

class RestaurantSelection extends Component {
  constructor(props) {
    super(props)
    this.state = {
      restaurantList: [],
      loading: true,
      loadingPage: false,
      totalRestaurant: 0,
      pagination: {
        max: 0,
        active: 1,
      },
    }
  }

  componentDidMount() {
    this.fetchRestaurants()
  }

  fetchRestaurants = async (page = 1, active = 1) => {
    const { merchantUser } = this.props
    // const merchant_id = `62129e65-0d82-4b34-a63c-9a0439a1ba30`
    // const access_token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXJjaGFudElkIjoiNjIxMjllNjUtMGQ4Mi00YjM0LWE2M2MtOWEwNDM5YTFiYTMwIiwibWVyY2hhbnRVc2VybmFtZSI6Im1lcmNoYW50MTIzIiwiaWF0IjoxNjIwNTM1OTc2LCJleHAiOjE2MjE3NDU1NzZ9.50wmVLxEh4-ebLJhUcFePuxSjxk6s-EKoIGO1IZRti0`
    const merchantId = localStorage.getItem('merchant_id')
    const accessToken = localStorage.getItem('access_token')
    const res = await axios({
      url: `${USER_URL}/${merchantId}/restaurant`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        page: page - 1,
      },
    })

    this.setState({
      loading: false,
      loadingPage: false,
    })

    const { status } = res

    if (status !== 200) {
      console.log('Error in fetching restaurants')
      return
    }

    const {
      data: { data },
    } = res

    if (!data) return

    const { results = [], size, total = 0 } = data

    const newRestaurantList = results.map((item) => {
      const {
        address,
        area,
        areaId,
        categories,
        city,
        cityId,
        coverImageUrl,
        verifiedImageUrl,
        id,
        isActive,
        isBanned,
        isVerified,
        name,
        phone,
        position,
        videoUrl,
        openHours,
        owner,
        contractId,
        posAppKey,
      } = item

      const restaurantItem = {
        address,
        area,
        areaId,
        categories,
        city,
        cityId,
        coverImageUrl,
        verifiedImageUrl,
        id,
        isActive,
        isBanned,
        isVerified,
        name,
        phone,
        position,
        videoUrl,
        openHours,
        owner,
        contractId,
        posAppKey,
      }

      return restaurantItem
    })

    this.setState({
      restaurantList: newRestaurantList,
      totalRestaurant: total < 10 ? `0${total}` : `${total}`,
      pagination: {
        max: Math.ceil(total / 10),
        active,
      },
    })
  }

  onPageClick = async (page) => {
    await this.setState((prevState) => {
      return {
        pagination: {
          ...prevState.pagination,
          active: page,
        },
        loadingPage: true,
      }
    })
    this.fetchRestaurants(page, page)
  }

  onNextPageClick = () => {
    const {
      pagination: { active, max },
    } = this.state
    if (active === max) return
    let newPage
    this.setState(
      (prevState) => {
        newPage = prevState.pagination.active + 1
        return {
          ...prevState,
          pagination: {
            ...prevState.pagination,
            active: newPage,
          },
          loadingPage: true,
        }
      },
      () => {
        this.fetchRestaurants(newPage, newPage)
      }
    )
  }

  onPreviousPageClick = () => {
    const {
      pagination: { active, max },
    } = this.state
    if (active === 1) return
    let newPage
    this.setState(
      (prevState) => {
        newPage = prevState.pagination.active - 1
        return {
          ...prevState,
          pagination: {
            ...prevState.pagination,
            active: newPage,
          },
          loadingPage: true,
        }
      },
      () => {
        this.fetchRestaurants(newPage, newPage)
      }
    )
  }

  render() {
    // const { password, email } = this.state
    // const initialValues = { email, password }
    const { setRestaurant } = this.props
    const {
      password,
      username,
      id: restaurantId,
      loading,
      totalRestaurant,
      restaurantList = [],
      pagination,
      loadingPage,
    } = this.state
    const initialValues = { username, password }

    if (loading) {
      return <div className='loading'></div>
    }
    console.log(new Array(pagination.max))

    return (
      <div className='restaurant-container'>
        <Row className='flex-1' style={{ height: '100%' }}>
          <Colxx xxs='12' md='8' className='mx-auto'>
            <Card>
              <h2 className='text-center mt-3 mb-0 font-weight-bold text-black'>
                Chọn nhà hàng của bạn <span>({totalRestaurant})</span>
              </h2>

              <Button
                color='primary'
                className={`my-button ml-auto mb-3 mr-4 btn-shadow btn-multiple-state ${
                  this.props.loading ? 'show-spinner' : ''
                }`}
                size='lg'
              >
                {/* <NavLink to={'/restaurant/register'}> */}
                <a href={`/restaurant/create`} className='text-white'>
                  <span aria-hidden>&#43; Tạo mới</span>
                </a>
                {/* Tạo mới */}
                {/* </NavLink> */}
              </Button>

              <div className='restaurant-wrapper'>
                {/* <CardBody className='restaurant-card'> */}
                <CardBody className='pt-1 pb-2' style={{ height: '600px' }}>
                  {loadingPage ? (
                    <div className='loading'></div>
                  ) : (
                    restaurantList.map((restaurant, index) => (
                      <RestaurantSelectItem
                        restaurant={restaurant}
                        key={restaurant.id}
                        setRestaurant={setRestaurant}
                      />
                    ))
                  )}
                </CardBody>
              </div>

              <Pagination
                aria-label='Page navigation example'
                onChange={(e) => console.log(e)}
              >
                <PaginationItem>
                  <PaginationLink previous onClick={this.onPrevPageClick} />
                </PaginationItem>
                {Array.from(Array(pagination.max).keys()).map(
                  (number, index) => {
                    const page = number + 1
                    return (
                      <PaginationItem
                        active={pagination.active === page}
                        key={page}
                      >
                        <PaginationLink onClick={() => this.onPageClick(page)}>
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  }
                )}
                <PaginationItem>
                  <PaginationLink next onClick={() => this.onNextPageClick()} />
                </PaginationItem>
              </Pagination>
            </Card>
          </Colxx>
        </Row>
      </div>
    )
  }
}
const mapStateToProps = ({ authUser }) => {
  const { user, loading, error } = authUser
  return { merchantUser: user, loading, error }
}

export default connect(mapStateToProps, {
  loginUser,
  setRestaurant,
})(RestaurantSelection)
