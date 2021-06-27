import React, { Component, Fragment } from 'react'
import { Row, Card, CardBody, CardTitle } from 'reactstrap'
import IntlMessages from '../../../helpers/IntlMessages'
// import { Colxx, Separator } from '../../../../components/common/CustomBootstrap'
import { Colxx, Separator } from '../../../components/common/CustomBootstrap'
import Breadcrumb from '../../../containers/navs/Breadcrumb'
import Pusher from 'pusher-js'
import { getRestaurant } from 'src/redux/actions'

import { YMaps, Map, Placemark } from 'react-yandex-maps'
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from 'react-google-maps'
import { PUSHER_APP_CLUSTER, PUSHER_APP_KEY } from 'src/constants/config'
import { listenNotification } from 'src/helpers/Utils'
import { connect } from 'react-redux'
import { useEffect } from 'react'

const MapWithAMarker = withScriptjs(
  withGoogleMap((props) => {
    const { lat, lng } = props
    return (
      <GoogleMap defaultZoom={15} defaultCenter={{ lat, lng }}>
        {/* <Marker position={{ lat: -34.397, lng: 150.644 }} /> */}
        {/* 10.7944422,106.6671633,17z */}
        <Marker position={{ lat, lng }} />
      </GoogleMap>
    )
  })
)

const MapsUi = (props) => {
  const { match, getRestaurant, restaurant } = props

  useEffect(() => {
    const restaurantId = localStorage.getItem('restaurant_id')
    const merchantId = localStorage.getItem('merchant_id')

    getRestaurant(merchantId, restaurantId)
    listenNotification()
  }, [])

  const { position } = restaurant

  if (!position) {
    return <div className='loading'></div>
  }

  return (
    <Fragment>
      <Row>
        <Colxx xxs='12'>
          <Breadcrumb heading='menu.maps' match={match} />
          <Separator className='mb-5' />
        </Colxx>
      </Row>
      <Row>
        <Colxx xxs='12'>
          <Card className='mb-4'>
            <CardBody>
              <CardTitle>
                <IntlMessages id='maps.google' />
              </CardTitle>
              <MapWithAMarker
                googleMapURL='https://maps.googleapis.com/maps/api/js?key=AIzaSyCO8MfadmlotuuHC8wmjwL_46I5QAMIiRU&v=3.exp&libraries=geometry,drawing,places'
                //   googleMapURL='https://goo.gl/maps/XJVJnLUGwVTjLYpt8'
                loadingElement={<div className='map-item' />}
                containerElement={<div className='map-item' />}
                mapElement={<div className='map-item' />}
                lat={position.latitude}
                lng={position.longitude}
              />
            </CardBody>
          </Card>
          {/* 
            <Card className='mb-4'>
              <CardBody>
                <CardTitle>
                  <IntlMessages id='maps.yandex' />
                </CardTitle>
                <div className='map-item'>
                  <YMaps query={{ lang: 'en-US' }}>
                    <Map
                      className='map-item'
                      defaultState={{ center: [-34.397, 150.644], zoom: 9 }}
                    >
                      <Placemark defaultGeometry={[-34.397, 150.644]} />
                    </Map>
                  </YMaps>
                </div>
              </CardBody>
            </Card> */}
        </Colxx>
      </Row>
    </Fragment>
  )
}

const mapStateToProps = ({ restaurantInfo: { restaurant } }) => {
  return {
    restaurant,
  }
}

export default connect(mapStateToProps, {
  getRestaurant,
})(MapsUi)
