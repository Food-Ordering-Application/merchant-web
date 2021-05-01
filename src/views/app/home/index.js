import React, { Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

const Home = React.lazy(() => import(/* webpackChunkName: "start" */ './home'))
const EditProfile = React.lazy(() =>
  import(/* webpackChunkName: "start" */ '../edit')
)

const HomeMenu = ({ match }) => (
  <Suspense fallback={<div className='loading' />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/home`} />
      <Route
        path={`${match.url}/home`}
        render={(props) => <Home {...props} />}
      />
      <Route
        path={`${match.url}/edit`}
        render={(props) => <EditProfile {...props} />}
      />
      {/* <Redirect to='/error' /> */}
    </Switch>
  </Suspense>
)
export default HomeMenu
