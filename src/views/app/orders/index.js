import React, { Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

const OrderList = React.lazy(() =>
  import(/* webpackChunkName: "second" */ '../OrderList')
)

const OrdersMenu = ({ match }) => (
  <Suspense fallback={<div className='loading' />}>
    <Switch>
      {/* <Redirect exact from={`${match.url}/`} to={`${match.url}/map`} /> */}
      <Route
        exact
        path={`${match.url}/`}
        render={(props) => <OrderList {...props} />}
      />

      {/* <Redirect to='/error' /> */}
    </Switch>
  </Suspense>
)
export default OrdersMenu
