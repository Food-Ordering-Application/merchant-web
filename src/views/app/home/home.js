import React, { Component, Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import { Row } from 'reactstrap'
import IntlMessages from '../../../helpers/IntlMessages'
import { Badge } from 'reactstrap'
import { connect } from 'react-redux'
import Pusher from 'pusher-js'
import axios from 'axios'

import { Colxx, Separator } from '../../../components/common/CustomBootstrap'
import Breadcrumb from '../../../containers/navs/Breadcrumb'
// import Banner from '../../../assets/images/banner.jpg'
// import Banner from './banner.jpg'
// import Banner from './banner.jpg'
import { getMerchant, setRestaurant } from '../../../redux/actions'

import {
  PUSHER_APP_CLUSTER,
  PUSHER_APP_KEY,
  USER_URL,
} from 'src/constants/config'
import './home.scss'
import { getDayByName, listenNotification, padNumber } from 'src/helpers/Utils'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
    }
  }

  componentDidMount() {
    listenNotification()

    const restaurantId = localStorage.getItem('restaurant_id')
    const merchantId = localStorage.getItem('merchant_id')
    const accessToken = localStorage.getItem('access_token')
    if (!restaurantId || !merchantId || !accessToken) {
      // No id found, Neet to login
      const { history } = this.props
      history.replace('/merchant/login')
      return
    }

    // Fetch restaurant infor if there is not exist
    this.fetchRestaurantInfo(accessToken, merchantId, restaurantId)
  }

  fetchRestaurantInfo = async (accessToken, merchantId, restaurantId) => {
    try {
      this.setState({
        loading: true,
      })
      const { setRestaurant } = this.props

      const { data } = await axios({
        method: 'GET',
        url: `${USER_URL}/${merchantId}/restaurant/${restaurantId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      if (!data) {
        console.log('Error: No data return')
      } else {
        const {
          data: { restaurant },
        } = data
        setRestaurant({ ...restaurant })
      }
    } catch (error) {
      console.log('Error in fetch restaurant info at Home page')
      console.error(error)
    } finally {
      this.setState({
        loading: false,
      })
    }
  }

  // getWorkingDay = (openHours) => {

  // }

  getOpenTime = (time) => {
    if (!time) return
    const { fromHour, fromMinute, toHour, toMinute } = time
    return `${padNumber(fromHour)}:${padNumber(fromMinute)} - ${padNumber(
      toHour
    )}:${padNumber(toMinute)}`
  }

  render() {
    // console.log(Banner)
    const {
      merchantUser: { error, loading: merchantUserLoading, merchant },
      restaurantInfo: {
        restaurant: {
          address,
          area,
          areaId,
          categories = [],
          city,
          cityId,
          coverImageUrl = 'https://cdn.daynauan.info.vn/wp-content/uploads/2019/11/com-chien-ca-man.jpg',
          verifiedImageUrl = 'https://cdn.daynauan.info.vn/wp-content/uploads/2019/11/com-chien-ca-man.jpg',
          id,
          isActive,
          isBanned,
          isVerified,
          name,
          phone,
          position,
          videoUrl,
          openHours = [],
          owner,
          contractId,
          posAppKey,
        },
      },
    } = this.props

    const { loading } = this.state

    if (loading || merchantUserLoading) {
      return <div class='loading'></div>
    }

    return (
      <Fragment>
        <Row>
          <Colxx xxs='12'>
            {/* <Breadcrumb heading='menu.home' match={this.props.match} /> */}
            <Separator className='mb-5' />
          </Colxx>
        </Row>
        <Row>
          <Colxx xxs='12' className='mb-4'>
            <div className='Home'>
              <div
                className='img-container'
                style={{
                  // backgroundImage: `url("https://cdn.daynauan.info.vn/wp-content/uploads/2019/11/com-chien-ca-man.jpg")`,
                  backgroundImage: `url(${coverImageUrl})`,
                }}
              ></div>
              <div className='store-info'>
                <div className='profile-info d-flex'>
                  <div className='profile-img'>
                    <img
                      // src='https://lh3.googleusercontent.com/proxy/81uC5i5ElutTe7HhCBfH18vDRI7HmIvy9EyAwGeWZOItoGhbVUwy0UEBMzh-6laQBzwkk4UZXTRG9Tc_wuAnJ3fpgnwucdGKey1ozbMu1nhlm_j3eUqfsSAoJ_SkX8bnUuklxVK05139BdoNQlTB8fuk'
                      src={coverImageUrl}
                      alt='avatar'
                    />
                  </div>
                  <div className='text'>
                    <div className='text-header d-flex align-items-center'>
                      <h3 className='name text-orange'>{name}</h3>

                      <div className='d-flex'>
                        {categories
                          .sort((a, b) =>
                            a.displayOrder > b.displayOrder ? 1 : -1
                          )
                          .map(({ iconUrl, name: categoryName }) => (
                            <Badge
                              color='primary'
                              pill
                              style={{
                                padding: '5px 10px',
                                marginLeft: 10,
                              }}
                            >
                              <div
                                className='d-flex align-items-center'
                                style={{ margin: 0 }}
                              >
                                {categoryName}
                                <img
                                  className='cate-icon'
                                  src={iconUrl}
                                  alt={categoryName}
                                />
                              </div>
                            </Badge>
                          ))}

                        <NavLink to={`/app/home/edit`} className='black'>
                          <box-icon
                            name='edit-alt'
                            type='solid'
                            style={{ marginLeft: 20, cursor: 'pointer' }}
                          ></box-icon>
                        </NavLink>
                      </div>
                    </div>

                    <div className='d-flex align-items-center'>
                      <box-icon name='current-location'></box-icon>
                      <p className='location'>
                        {/* 670 Trường Chinh, Q.Tân Bình, Tp. Hồ Chí Minh */}
                        {address}
                      </p>
                    </div>

                    <div
                      className='d-flex align-items-center justify-content-between'
                      style={{ maxWidth: 600 }}
                    >
                      <div className='d-flex align-items-center'>
                        <box-icon type='solid' name='calendar-event'></box-icon>
                        <p className='calendar'>
                          {openHours.map(
                            (
                              { day, fromHour, fromMinute, toHour, toMinute },
                              index
                            ) => (
                              <>
                                <span>{getDayByName(day)}</span>
                                {index === openHours.length - 1 ? '' : ', '}
                              </>
                            )
                          )}
                          {/* String(9).padStart(4, '0')) */}
                        </p>
                      </div>
                      <div className='time d-flex align-items-center'>
                        <box-icon name='time-five'></box-icon>
                        <p>{this.getOpenTime(openHours[0])}</p>
                      </div>
                    </div>

                    <div className='d-flex align-items-center'>
                      <box-icon name='phone' type='solid'></box-icon>
                      <p className='contact'>{phone}</p>
                    </div>

                    <div
                      className='d-flex align-items-center justify-content-between'
                      style={{ maxWidth: 400 }}
                    >
                      <div className='d-flex align-items-center'>
                        <span
                          class='iconify'
                          data-icon='akar-icons:door'
                          data-inline='false'
                          data-width='28'
                          data-height='28'
                        ></span>
                        <p className=''>
                          {isActive ? 'Đang hoạt động' : 'Đang không hoạt động'}
                        </p>
                      </div>

                      <div className='d-flex align-items-center'>
                        <box-icon type='solid' name='check-circle'></box-icon>
                        <p className=''>
                          {isVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                        </p>
                      </div>
                    </div>

                    {isBanned && (
                      <div className='d-flex align-items-center'>
                        <box-icon name='x'></box-icon>
                        <p className=''>Đã bị cấm</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Colxx>
        </Row>
      </Fragment>
    )
  }
}

// export default Home
const mapStateToProps = ({ authUser, merchantUser, restaurantInfo }) => {
  return { merchantUser, authUser, restaurantInfo }
}
export default connect(mapStateToProps, { getMerchant, setRestaurant })(Home)
