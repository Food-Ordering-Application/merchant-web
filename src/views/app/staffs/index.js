import React, { Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

const StaffList = React.lazy(() =>
  import(/* webpackChunkName: "second" */ '../StaffList')
)

const StaffCreate = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './createStaff')
)

const StaffMenu = ({ match }) => (
  <Suspense fallback={<div className='loading' />}>
    <Switch>
      {/* <Redirect exact from={`${match.url}/`} to={`${match.url}/map`} /> */}
      <Route
        exact
        path={`${match.url}/`}
        render={(props) => <StaffList {...props} />}
      />
      <Route
        path={`${match.url}/create`}
        render={(props) => <StaffCreate {...props} />}
      />
      {/* <Redirect to='/error' /> */}
    </Switch>
  </Suspense>
)
export default StaffMenu
