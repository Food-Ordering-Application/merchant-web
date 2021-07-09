import React, { Component, Fragment, useEffect, useState } from 'react'
import { Row, Card, CardBody, CardTitle, Button } from 'reactstrap'
import IntlMessages from '../../../helpers/IntlMessages'
// import { Colxx, Separator } from '../../../../components/common/CustomBootstrap'
import { Colxx, Separator } from '../../../components/common/CustomBootstrap'
import Breadcrumb from '../../../containers/navs/Breadcrumb'
import Pusher from 'pusher-js'
import axios from 'axios'

import { YMaps, Map, Placemark } from 'react-yandex-maps'
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from 'react-google-maps'
import {
  PUSHER_APP_CLUSTER,
  PUSHER_APP_KEY,
  SMART_MERCHANT_URL,
  USER_URL,
} from 'src/constants/config'

import './paypal.scss'

const Paypal = (props) => {
  const { history } = props
  const [refLink, setRefLink] = useState('')
  const [isOnboard, setIsOnboard] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkOnboard()
    getReferralLink()
  }, [])

  const checkOnboard = async () => {
    const accessToken = localStorage.getItem('access_token')
    const merchantId = localStorage.getItem('merchant_id')
    const restaurantId = localStorage.getItem('restaurant_id')

    try {
      setLoading(true)
      const { data } = await axios({
        method: 'GET',
        url: `${USER_URL}/${merchantId}/restaurant/${restaurantId}/payment`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const {
        data: {
          payment: {
            paypal: { isOnboard },
          },
        },
      } = data
      setIsOnboard(isOnboard)
    } catch (error) {
      console.log('Error in checking restaurant Paypal onboard')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const getReferralLink = async () => {
    const accessToken = localStorage.getItem('access_token')
    const merchantId = localStorage.getItem('merchant_id')
    const restaurantId = localStorage.getItem('restaurant_id')

    try {
      const { data } = await axios({
        method: 'POST',
        url: `${USER_URL}/${merchantId}/restaurant/${restaurantId}/payment/paypal/get-signup-link`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          // redirectUrl: 'http://localhost:3000/app/payment',
          redirectUrl: SMART_MERCHANT_URL,
        },
      })

      if (!data) return

      const {
        data: { action_url },
      } = data
      console.log(action_url)
      setRefLink(action_url)
    } catch (error) {
      console.log('Error in gettiing Paypal referral link')
      console.error(error)
    } finally {
    }
  }

  const onBtnClick = () => {
    if (!refLink) return

    window.location.replace(refLink)
    // history.replace({ pathname: refLink, state: { isActive: true } })
    // history.push(refLink)

    // channelStore: {isCasualSeller: true, mepUrl: "https://www.sandbox.paypal.com/mep/dashboard",…}
    // isCasualSeller: true
    // isDataAPI: false
    // mepUrl: "https://www.sandbox.paypal.com/mep/dashboard"
    // returnToPartnerUrl: "http://web-merchant-2.herokuapp.com/?merchantId=08f3fa7b-0119-4bca-8794-4c3dec2f2e58&merchantIdInPayPal=QB5RH2NS5T8PW&permissionsGranted=true&consentStatus=true&productIntentId=addipmt&productIntentID=addipmt&isEmailConfirmed=false"
    // returnToPartnerUrl: "http://localhost:3000/?merchantId=08f3fa7b-0119-4bca-8794-4c3dec2f2e58&merchantIdInPayPal=QB5RH2NS5T8PW&permissionsGranted=true&consentStatus=true&productIntentId=addipmt&productIntentID=addipmt&isEmailConfirmed=false"
    // sharedAuthorizationCode: null
    // sharedId: null
  }

  if (loading) {
    return <div className='loading'></div>
  }

  if (isOnboard) {
    return (
      <Fragment>
        <Row>
          <Colxx xxs='12'>
            <h1>Thanh toán</h1>
            <Separator className='mb-5' />
          </Colxx>
        </Row>
        <Row>
          <Card className='mb-4'>
            <CardBody className='d-flex align-items-center'>
              <Colxx md='6'>
                <img
                  src='https://chapelboro.com/wp-content/uploads/2016/04/PayPal.png'
                  alt='Paypal-banner'
                  style={{ width: 250 }}
                />
              </Colxx>
              <Colxx xxs='12' md='6'>
                <CardTitle>
                  <h4>Nhà hàng đã liên kết Paypal.</h4>
                </CardTitle>
              </Colxx>
            </CardBody>
          </Card>
        </Row>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <Row>
        <Colxx xxs='12'>
          <h1>Thanh toán</h1>
          <Separator className='mb-5' />
        </Colxx>
      </Row>
      <Row>
        <Card className='mb-4'>
          <CardBody className='d-flex align-items-center'>
            <Colxx md='6'>
              <img
                src='https://chapelboro.com/wp-content/uploads/2016/04/PayPal.png'
                alt='Paypal-banner'
                style={{ width: 250 }}
              />
            </Colxx>
            <Colxx xxs='12' md='6'>
              <CardTitle>
                <IntlMessages id='paypal.link-paypal' />
                <p className='mt-2 mb-3'>
                  <IntlMessages id='paypal.link-text' />
                </p>
                <Button
                  color='primary'
                  className={`btn-shadow btn-multiple-state ${
                    loading ? 'show-spinner' : ''
                  }`}
                  size='lg'
                  type='submit'
                  onClick={onBtnClick}
                >
                  <span className='spinner d-inline-block'>
                    <span className='bounce1' />
                    <span className='bounce2' />
                    <span className='bounce3' />
                  </span>
                  <span className='label'>
                    <IntlMessages id='paypal.link-button' />
                  </span>
                </Button>
              </CardTitle>
            </Colxx>
          </CardBody>
        </Card>
      </Row>
    </Fragment>
  )
}

export default Paypal
