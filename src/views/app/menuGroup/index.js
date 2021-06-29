import React, { Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import MenuItemCreate from '../MenuItemCreate'
import ToppingGroupCreate from '../ToppingGroupCreate'
import ToppingItemCreate from '../ToppingItemCreate'
import ToppingMapper from '../SelectTopping'

const MenuGroupList = React.lazy(() =>
  import(/* webpackChunkName: "second" */ '../MenuGroupList')
)

const MenuGroupRoute = ({ match }) => (
  <Suspense fallback={<div className='loading' />}>
    <Switch>
      {/* <Redirect exact from={`${match.url}/`} to={`${match.url}/dishes`} /> */}
      <Route
        exact
        path={`${match.url}/`}
        render={(props) => <MenuGroupList {...props} />}
      />
      {/* <Route
        exact
        path={`${match.url}/item/:toppingId`}
        render={(props) => <ToppingItemDetail {...props} />}
      />
      <Route
        exact
        path={`${match.url}/:menuId/edit/:toppingId`}
        render={(props) => <ToppingItemEdit {...props} />}
      />
      <Route
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
        path={`${match.url}/select-topping`}
        render={(props) => <ToppingMapper {...props} />}
      /> */}
      {/* <Route
        exact
        path={`${match.url}/create/topping-item`}
        render={(props) => <ToppingItemCreate {...props} />}
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

export default MenuGroupRoute
