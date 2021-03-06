import React, { Component } from 'react'
import { injectIntl } from 'react-intl'
import {
  UncontrolledDropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Input,
  Tooltip,
} from 'reactstrap'

import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

import IntlMessages from '../../helpers/IntlMessages'
import {
  setContainerClassnames,
  clickOnMobileMenu,
  logoutUser,
  changeLocale,
  getRestaurant,
} from '../../redux/actions'

import {
  menuHiddenBreakpoint,
  searchPath,
  localeOptions,
  isDarkSwitchActive,
} from '../../constants/defaultValues'

import { MobileMenuIcon, MenuIcon } from '../../components/svg'
import TopnavEasyAccess from './Topnav.EasyAccess'
import TopnavNotifications from './Topnav.Notifications'
import TopnavDarkSwitch from './Topnav.DarkSwitch'

import { getDirection, setDirection } from '../../helpers/Utils'

class TopNav extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isInFullScreen: false,
      searchKeyword: '',
      tooltipOpen: false,
    }
  }

  componentDidMount() {}

  handleChangeLocale = (locale, direction) => {
    this.props.changeLocale(locale)

    const currentDirection = getDirection().direction
    if (direction !== currentDirection) {
      setDirection(direction)
      setTimeout(() => {
        window.location.reload()
      }, 500)
    }
  }

  isInFullScreen = () => {
    return (
      (document.fullscreenElement && document.fullscreenElement !== null) ||
      (document.webkitFullscreenElement &&
        document.webkitFullscreenElement !== null) ||
      (document.mozFullScreenElement &&
        document.mozFullScreenElement !== null) ||
      (document.msFullscreenElement && document.msFullscreenElement !== null)
    )
  }

  handleSearchIconClick = (e) => {
    if (window.innerWidth < menuHiddenBreakpoint) {
      let elem = e.target
      if (!e.target.classList.contains('search')) {
        if (e.target.parentElement.classList.contains('search')) {
          elem = e.target.parentElement
        } else if (
          e.target.parentElement.parentElement.classList.contains('search')
        ) {
          elem = e.target.parentElement.parentElement
        }
      }

      if (elem.classList.contains('mobile-view')) {
        this.search()
        elem.classList.remove('mobile-view')
        this.removeEventsSearch()
      } else {
        elem.classList.add('mobile-view')
        this.addEventsSearch()
      }
    } else {
      this.search()
    }
  }

  addEventsSearch = () => {
    document.addEventListener('click', this.handleDocumentClickSearch, true)
  }

  removeEventsSearch = () => {
    document.removeEventListener('click', this.handleDocumentClickSearch, true)
  }

  handleDocumentClickSearch = (e) => {
    let isSearchClick = false
    if (
      e.target &&
      e.target.classList &&
      (e.target.classList.contains('navbar') ||
        e.target.classList.contains('simple-icon-magnifier'))
    ) {
      isSearchClick = true
      if (e.target.classList.contains('simple-icon-magnifier')) {
        this.search()
      }
    } else if (
      e.target.parentElement &&
      e.target.parentElement.classList &&
      e.target.parentElement.classList.contains('search')
    ) {
      isSearchClick = true
    }

    if (!isSearchClick) {
      const input = document.querySelector('.mobile-view')
      if (input && input.classList) input.classList.remove('mobile-view')
      this.removeEventsSearch()
      this.setState({
        searchKeyword: '',
      })
    }
  }

  handleSearchInputChange = (e) => {
    this.setState({
      searchKeyword: e.target.value,
    })
  }

  handleSearchInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.search()
    }
  }

  search = () => {
    this.props.history.push(searchPath + '/' + this.state.searchKeyword)
    this.setState({
      searchKeyword: '',
    })
  }

  toggleFullScreen = () => {
    const isInFullScreen = this.isInFullScreen()

    var docElm = document.documentElement
    if (!isInFullScreen) {
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen()
      } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen()
      } else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen()
      } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    }
    this.setState({
      isInFullScreen: !isInFullScreen,
    })
  }

  handleLogout = () => {
    this.props.logoutUser(this.props.history)
  }

  menuButtonClick = (e, menuClickCount, containerClassnames) => {
    e.preventDefault()

    setTimeout(() => {
      var event = document.createEvent('HTMLEvents')
      event.initEvent('resize', false, false)
      window.dispatchEvent(event)
    }, 350)
    this.props.setContainerClassnames(
      ++menuClickCount,
      containerClassnames,
      this.props.selectedMenuHasSubItems
    )
  }

  mobileMenuButtonClick = (e, containerClassnames) => {
    e.preventDefault()
    this.props.clickOnMobileMenu(containerClassnames)
  }

  handleSelectRestaurant = () => {
    const { history } = this.props
    history.replace({
      pathname: '/restaurant/select',
      // search: '?query=abc',
      // state:{isActive: true}
    })
  }

  toggleTooltip = () => {
    this.setState((prevState) => ({
      tooltipOpen: !prevState.tooltipOpen,
    }))
  }

  selectRestaurant = () => {
    this.props.history.replace({
      pathname: '/restaurant/select',
    })
  }

  redirectToEditProfile = () => {
    console.log('click')
    const { history } = this.props
    history.push('/app/home/edit')
  }

  render() {
    const {
      containerClassnames,
      menuClickCount,
      locale,
      profileImg,
      restaurantInfo,
    } = this.props
    const { messages } = this.props.intl
    const {
      restaurant: { name: restaurantName = '', coverImageUrl },
    } = restaurantInfo

    const { tooltipOpen } = this.state

    return (
      <nav className='navbar fixed-top'>
        <div className='d-flex align-items-center'>
          <NavLink
            to='#'
            className='menu-button d-none d-md-block'
            onClick={(e) =>
              this.menuButtonClick(e, menuClickCount, containerClassnames)
            }
          >
            <MenuIcon />
          </NavLink>

          <NavLink
            to='#'
            className='menu-button-mobile d-xs-block d-sm-block d-md-none'
            onClick={(e) => this.mobileMenuButtonClick(e, containerClassnames)}
          >
            <MobileMenuIcon />
          </NavLink>

          {/* <div className='search' data-search-path='/app/pages/search'>
            <Input
              name='searchKeyword'
              id='searchKeyword'
              placeholder={messages['menu.search']}
              value={this.state.searchKeyword}
              onChange={(e) => this.handleSearchInputChange(e)}
              onKeyPress={(e) => this.handleSearchInputKeyPress(e)}
            />
            <span
              className='search-icon'
              onClick={(e) => this.handleSearchIconClick(e)}
            >
              <i className='simple-icon-magnifier' />
            </span>
          </div> */}

          {/* <div className='d-inline-block'>
            <UncontrolledDropdown className='ml-2'>
              <DropdownToggle
                caret
                color='light'
                size='sm'
                className='language-button'
              >
                <span className='name'>{locale.toUpperCase()}</span>
              </DropdownToggle>
              <DropdownMenu className='mt-3' right>
                {localeOptions.map((l) => {
                  return (
                    <DropdownItem
                      onClick={() => this.handleChangeLocale(l.id, l.direction)}
                      key={l.id}
                    >
                      {l.name}
                    </DropdownItem>
                  )
                })}
              </DropdownMenu>
            </UncontrolledDropdown>
          </div> */}

          {/* <div className='position-relative d-none d-none d-lg-inline-block'>
            <a
              className='btn btn-outline-primary btn-sm ml-2'
              target='_top'
              href='https://themeforest.net/cart/configure_before_adding/22544383?license=regular&ref=ColoredStrategies&size=source'
            >
              <IntlMessages id='user.buy' />
            </a>
          </div> */}
        </div>

        <a className='navbar-logo' href='/app'>
          <span className='site-logo'>
            Smart<span className='text-orange'>Merchant</span>
          </span>
          {/* <span className="logo d-none d-xs-block" />
          <span className="logo-mobile d-block d-xs-none" /> */}
        </a>

        <div className='navbar-right'>
          {isDarkSwitchActive && <TopnavDarkSwitch />}

          <div className='header-icons d-inline-block align-middle'>
            <div
              style={{ display: 'inline-block', padding: '0.6rem' }}
              onMouseOver={() => {
                this.setState({
                  tooltipOpen: true,
                })
              }}
              onClick={this.selectRestaurant}
            >
              <span
                style={{ marginBottom: -2, cursor: 'pointer' }}
                className='iconify'
                data-icon='bi:shop'
                data-inline='false'
                data-width='22'
                data-height='22'
                color='#aaaaaa'
                id='selectRestaurant'
              ></span>
              {/* <Tooltip
                placement='bottom'
                isOpen={tooltipOpen}
                target={'selectRestaurant'}
                toggle={this.toggleTooltip}
              >
                Ch???n nh?? h??ng
              </Tooltip> */}
            </div>

            {/* <TopnavEasyAccess /> */}
            {/* <TopnavNotifications /> */}
            <button
              className='header-icon btn btn-empty d-none d-sm-inline-block'
              type='button'
              id='fullScreenButton'
              onClick={this.toggleFullScreen}
            >
              {this.state.isInFullScreen ? (
                <i className='simple-icon-size-actual d-block' />
              ) : (
                <i className='simple-icon-size-fullscreen d-block' />
              )}
            </button>
          </div>
          <div className='user d-inline-block'>
            <UncontrolledDropdown className='dropdown-menu-right'>
              <DropdownToggle className='p-0' color='empty'>
                <span className='name mr-1'>
                  {restaurantName || 'Qu??n ??n Maika'}
                </span>
                <span>
                  {/* <img alt='Profile' src='/assets/img/profile-pic-l.jpg' /> */}
                  <img
                    style={{ width: '40px', height: '40px' }}
                    alt='Profile'
                    src={
                      coverImageUrl ||
                      'https://cdn.daynauan.info.vn/wp-content/uploads/2019/11/com-chien-ca-man.jpg'
                    }
                  />
                </span>
              </DropdownToggle>
              <DropdownMenu className='mt-3' right>
                <DropdownItem onClick={this.redirectToEditProfile}>
                  T??i kho???n
                </DropdownItem>
                {/* <DropdownItem>Features</DropdownItem>
                <DropdownItem>History</DropdownItem> */}
                <DropdownItem>H??? tr???</DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={() => this.handleSelectRestaurant()}>
                  Ch???n nh?? h??ng
                </DropdownItem>
                <DropdownItem onClick={() => this.handleLogout()}>
                  ????ng xu???t
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </div>
      </nav>
    )
  }
}

const mapStateToProps = ({ menu, settings, restaurantInfo }) => {
  const { containerClassnames, menuClickCount, selectedMenuHasSubItems } = menu
  const { locale } = settings
  return {
    containerClassnames,
    menuClickCount,
    selectedMenuHasSubItems,
    locale,
    restaurantInfo,
  }
}
export default injectIntl(
  connect(mapStateToProps, {
    setContainerClassnames,
    clickOnMobileMenu,
    logoutUser,
    changeLocale,
    getRestaurant,
  })(TopNav)
)
