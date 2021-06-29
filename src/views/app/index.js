import React, { Component, Suspense } from 'react'
import { Route, withRouter, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import AppLayout from '../../layout/AppLayout'

const Home = React.lazy(() =>
  import(/* webpackChunkName: "viwes-gogo" */ './home')
)

const Dishes = React.lazy(() =>
  import(/* webpackChunkName: "viwes-second-menu" */ './dishes')
)

const Analytics = React.lazy(() => import('./analytics'))

const Map = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './map')
)

const Cashier = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './cashier')
)

const Staff = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './staffs')
)

const Toppings = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './toppings')
)

const MenuGroup = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './menuGroup')
)

// const ToppingGroup = React.lazy(() =>
//   import(/* webpackChunkName: "viwes-blank-page" */ './toppingGroup')
// )

const Paypal = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './paypal')
)

const Orders = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './orders')
)

const BlankPage = React.lazy(() =>
  import(/* webpackChunkName: "viwes-blank-page" */ './blank-page')
)

class App extends Component {
  render() {
    const { match, authUser } = this.props

    return (
      <AppLayout>
        <div className='dashboard-wrapper'>
          <Suspense fallback={<div className='loading' />}>
            <Switch>
              {/* <Redirect exact from={`${match.url}/`} to={`/merchant`} /> */}

              <Redirect exact from={`${match.url}/`} to={`${match.url}/home`} />

              {/* <Redirect exact from={`${match.url}/`} to={`${match.url}/home`} />
              {!authUser.user ? (
                <Redirect from={`${match.url}/`} to={`/merchant`} />
              ) : (
                <Redirect
                  exact
                  from={`${match.url}/`}
                  to={`${match.url}/home`}
                />
              )} */}

              <Route
                path={`${match.url}/home`}
                render={(props) => <Home {...props} />}
              />

              <Route
                path={`${match.url}/dishes`}
                render={(props) => <Dishes {...props} />}
              />
              <Route
                path={`${match.url}/analytics`}
                // render={(props) => <span>HI</span>}
                render={(props) => <Analytics {...props} />}
              />
              <Route
                path={`${match.url}/map`}
                // render={(props) => <span>HI</span>}
                render={(props) => <Map {...props} />}
              />
              <Route
                path={`${match.url}/staffs`}
                // render={props => <CreateCashier {...props} />}
                render={(props) => <Staff {...props} />}
              />
              <Route
                path={`${match.url}/toppings`}
                render={(props) => <Toppings {...props} />}
              />
              <Route
                path={`${match.url}/menu-group`}
                render={(props) => <MenuGroup {...props} />}
              />
              {/* <Route
                path={`${match.url}/topping-group`}
                render={(props) => <ToppingGroup {...props} />}
              /> */}
              <Route
                path={`${match.url}/orders`}
                render={(props) => <Orders {...props} />}
              />
              <Route
                path={`${match.url}/payment`}
                render={(props) => <Paypal {...props} />}
              />
              <Route
                path={`${match.url}/blank-page`}
                render={(props) => <BlankPage {...props} />}
              />
              {/* <Route
                path={`${match.url}/create-cashier`}
                // render={props => <CreateCashier {...props} />}
                render={(props) => <Cashier {...props} />}
              /> */}
              {/* <Redirect to='/error' /> */}
            </Switch>
          </Suspense>
        </div>
      </AppLayout>
    )
  }
}
const mapStateToProps = ({ menu, authUser }) => {
  const { containerClassnames } = menu
  return { containerClassnames, authUser }
}

export default withRouter(connect(mapStateToProps, {})(App))
