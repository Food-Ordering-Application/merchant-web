import React, { Component, Suspense, useEffect } from 'react'
import Pusher from 'pusher-js'
import { connect } from 'react-redux'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'
import { IntlProvider } from 'react-intl'
import './helpers/Firebase'
import AppLocale from './lang'
import ColorSwitcher from './components/common/ColorSwitcher'
import NotificationContainer from './components/common/react-notifications/NotificationContainer'
import { isMultiColorActive } from './constants/defaultValues'
import {
  getDirection,
  listenNotification,
  STATUS_MAPPER,
} from './helpers/Utils'
import 'boxicons'
import { BASE_URL, PUSHER_APP_CLUSTER, PUSHER_APP_KEY } from './constants'
import axios from 'axios'
import { NotificationManager } from './components/common/react-notifications'

import { setNewOrder } from './redux/newOrder/actions'

const ViewMain = React.lazy(() =>
  import(/* webpackChunkName: "views" */ './views')
)
const ViewApp = React.lazy(() =>
  import(/* webpackChunkName: "views-app" */ './views/app')
)
const ViewUserMerchant = React.lazy(() =>
  import(/* webpackChunkName: "views-user" */ './views/merchant')
)
const ViewUserRestaurant = React.lazy(() =>
  import(/* webpackChunkName: "views-user" */ './views/restaurant')
)
const ViewError = React.lazy(() =>
  import(/* webpackChunkName: "views-error" */ './views/error')
)

const AuthRoute = ({ component: Component, authUser, ...rest }) => {
  return (
    <Route
      {...rest}
      // render={(props) =>
      //   authUser && authUser.id !== '' ? (
      //     <Component {...props} />
      //   ) : (
      //     <Redirect
      //       to={{
      //         pathname: '/merchant',
      //         // pathname: '/',
      //         state: { from: props.location },
      //       }}
      //     />
      //   )
      // }
      render={(props) => <Component {...props} />}
    />
  )
}

const App = (props) => {
  const { setNewOrder, newOrder } = props

  useEffect(() => {
    listenNotification()
    const direction = getDirection()
    if (direction.isRtl) {
      document.body.classList.add('rtl')
      document.body.classList.remove('ltr')
    } else {
      document.body.classList.add('ltr')
      document.body.classList.remove('rtl')
    }

    // NotificationManager.success('hello', 'Đơn hàng mới', 15000, handleNotiClick)
    // handleNewOrder()
    return () => {}
  }, [])

  const handleNewOrder = async () => {
    // const order = await getOrder(`97a1496a-70ac-4018-88f3-191aded95956`)
    // console.log(order)
  }

  const handleNotiClick = (orderId) => {
    // const orderId = `97a1496a-70ac-4018-88f3-191aded95956`
    // if (!newOrder.order) return
    // const orderId = newOrder.order.id
    window.location.replace(`/app/orders/${orderId}`)
  }

  const listenNotification = async () => {
    const restaurantId = await localStorage.getItem('restaurant_id')

    const pusher = new Pusher(PUSHER_APP_KEY, {
      cluster: PUSHER_APP_CLUSTER,
    })

    const channel = pusher.subscribe(`orders_${restaurantId}`)
    console.log(channel)

    channel.bind('order-status', (data) => {
      console.log(data)

      handleNotification(data)
    })
  }

  const handleNotification = async (data) => {
    const NOTIFY_TIME = 15000

    // New order
    try {
      console.log(data)
      setNewOrder(data.order)
      const {
        order: {
          id: orderId,
          delivery: { customerId },
          status,
        },
      } = data

      // const customer = await getCustomer(customerId)
      // const orderInfo = await getOrder(orderId)
      const notiMessage = `Trạng thái: ${STATUS_MAPPER[status]}`
      NotificationManager.success(
        notiMessage,
        'Đơn hàng mới',
        NOTIFY_TIME,
        () => handleNotiClick(orderId)
      )
      return
    } catch (error) {
      console.log(error)
    }
  }

  const getCustomer = async (customerId) => {
    const accessToken = await localStorage.getItem('access_token')
    try {
      const { data } = await axios({
        method: 'GET',
        url: `${BASE_URL}/user/customer/${customerId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          customerId,
        },
      })
      const {
        data: { user },
      } = data
      return user
    } catch (error) {
      console.log('Error in getCustomer')
      console.error(error)
      return null
    }
  }

  const getOrder = async (orderId) => {
    const accessToken = await localStorage.getItem('access_token')
    try {
      const { data } = await axios({
        method: 'GET',
        url: `${BASE_URL}/order/${orderId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const {
        data: { order },
      } = data
      return order
    } catch (error) {
      console.log('Error in getOrder')
      console.error(error)
      return null
    }
  }

  const { locale, authUser } = props
  const currentAppLocale = AppLocale[locale]

  // return null
  return (
    <div className='h-100'>
      <IntlProvider
        locale={currentAppLocale.locale}
        messages={currentAppLocale.messages}
      >
        <React.Fragment>
          <NotificationContainer />
          {isMultiColorActive && <ColorSwitcher />}
          <Suspense fallback={<div className='loading' />}>
            <Router>
              <Switch>
                <AuthRoute
                  path='/app'
                  authUser={authUser}
                  component={ViewApp}
                />
                <Route
                  path='/merchant'
                  render={(props) => <ViewUserMerchant {...props} />}
                />
                <Route
                  path='/restaurant'
                  render={(props) => <ViewUserRestaurant {...props} />}
                />
                {/* <Route
                    path='/error'
                    exact
                    render={(props) => <ViewError {...props} />}
                  /> */}
                <Route
                  path='/'
                  exact
                  render={(props) => <ViewMain {...props} />}
                />
                {/* <Redirect to='/error' /> */}
              </Switch>
            </Router>
          </Suspense>
        </React.Fragment>
      </IntlProvider>
    </div>
  )
}

const mapStateToProps = ({ authUser, settings, newOrder }) => {
  // const { user: loginUser } = authUser
  const loginUser = true
  const { locale } = settings
  return { loginUser, locale, authUser, newOrder }
}
const mapActionsToProps = { setNewOrder }

export default connect(mapStateToProps, mapActionsToProps)(App)
