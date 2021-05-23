import React, { Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import MenuItemCreate from '../MenuItemCreate'
import ToppingGroupCreate from '../ToppingGroupCreate'
import ToppingItemCreate from '../ToppingItemCreate'
import SelectTopping from '../SelectTopping'

const ToppingList = React.lazy(() =>
  import(/* webpackChunkName: "second" */ '../ToppingList')
)

const ToppingsRoute = ({ match }) => (
  <Suspense fallback={<div className='loading' />}>
    <Switch>
      {/* <Redirect exact from={`${match.url}/`} to={`${match.url}/dishes`} /> */}
      <Route
        exact
        path={`${match.url}/`}
        render={(props) => <ToppingList {...props} />}
      />
      {/* <Route
        exact
        path={`${match.url}/create/topping-item`}
        render={(props) => <ToppingItemCreate {...props} />}
      />
      <Route
        exact
        path={`${match.url}/create/topping-group`}
        render={(props) => <ToppingGroupCreate {...props} />}
      />
      <Route
        exact
        path={`${match.url}/create/menu-item`}
        render={(props) => <MenuItemCreate {...props} />}
      />
      <Route
        exact
        path={`${match.url}/create`}
        render={(props) => <MenuCreate {...props} />}
      />
      <Route
        exact
        path={`${match.url}/select-topping`}
        render={(props) => <SelectTopping {...props} />}
      />
      <Route
        path={`${match.url}/:id`}
        render={(props) => <MenuInfo {...props} />}
      /> */}
      {/* <Redirect to='/error' /> */}
    </Switch>
  </Suspense>
)

export default ToppingsRoute
