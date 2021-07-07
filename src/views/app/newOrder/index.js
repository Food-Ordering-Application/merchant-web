import React, { Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

const NewOrderDetail = React.lazy(() =>
  import(/* webpackChunkName: "second" */ '../NewOrderDetail')
)

const NewOrderMenu = ({ match }) => (
  <Suspense fallback={<div className='loading' />}>
    <Switch>
      {/* <Redirect exact from={`${match.url}/`} to={`${match.url}/map`} /> */}
      <Route
        exact
        path={`${match.url}/`}
        render={(props) => <NewOrderDetail {...props} />}
      />

      {/* <Redirect to='/error' /> */}
    </Switch>
  </Suspense>
)
export default NewOrderMenu
