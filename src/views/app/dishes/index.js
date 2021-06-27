import React, { Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import MenuItemCreate from '../MenuItemCreate'
import ToppingGroupCreate from '../ToppingGroupCreate'
import ToppingItemCreate from '../ToppingItemCreate'
import SelectTopping from '../SelectTopping'

const Dishes = React.lazy(() =>
  import(/* webpackChunkName: "second" */ './dishes')
)

const MenuCreate = React.lazy(() => import('../MenuCreate'))

const MenuInfo = React.lazy(() => import('../MenuInfo'))

const MenuItemDetail = React.lazy(() => import('../MenuItemDetail'))

const DishesMenu = ({ match }) => {
  // console.log(match)
  return (
    <Suspense fallback={<div className='loading' />}>
      <Switch>
        {/* <Redirect exact from={`${match.url}/`} to={`${match.url}/dishes`} /> */}
        <Route
          path={`${match.url}/:id/item/:id`}
          render={(props) => <MenuItemDetail />}
        />

        <Route
          path={`${match.url}/hello`}
          render={(props) => <span>Hello</span>}
        />
        <Route
          exact
          path={`${match.url}/`}
          render={(props) => <Dishes {...props} />}
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
          path={`${match.url}/:id`}
          render={(props) => <MenuInfo {...props} />}
        />

        {/* <Redirect to='/error' /> */}
      </Switch>
    </Suspense>
  )
}

export default DishesMenu
