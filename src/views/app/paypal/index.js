import React, { Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

const PaypalUi = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './paypal')
)
const DishesMenu = ({ match }) => (
  <Suspense fallback={<div className='loading' />}>
    <Switch>
      {/* <Redirect exact from={`${match.url}/`} to={`${match.url}/map`} /> */}
      <Route
        path={`${match.url}/`}
        render={(props) => <PaypalUi {...props} />}
      />
      <Redirect to='/error' />
    </Switch>
  </Suspense>
)
export default DishesMenu
