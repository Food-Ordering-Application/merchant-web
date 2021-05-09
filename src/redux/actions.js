/* SETTINGS */
export const CHANGE_LOCALE = 'CHANGE_LOCALE'

/* AUTH */
export const LOGIN_USER = 'LOGIN_USER'
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS'
export const LOGIN_USER_ERROR = 'LOGIN_USER_ERROR'
export const REGISTER_USER = 'REGISTER_USER'
export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS'
export const REGISTER_USER_ERROR = 'REGISTER_USER_ERROR'
export const LOGOUT_USER = 'LOGOUT_USER'
export const FORGOT_PASSWORD = 'FORGOT_PASSWORD'
export const FORGOT_PASSWORD_SUCCESS = 'FORGOT_PASSWORD_SUCCESS'
export const FORGOT_PASSWORD_ERROR = 'FORGOT_PASSWORD_ERROR'
export const RESET_PASSWORD = 'RESET_PASSWORD'
export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS'
export const RESET_PASSWORD_ERROR = 'RESET_PASSWORD_ERROR'

/* MENU */
export const MENU_SET_CLASSNAMES = 'MENU_SET_CLASSNAMES'
export const MENU_CONTAINER_ADD_CLASSNAME = 'MENU_CONTAINER_ADD_CLASSNAME'
export const MENU_CLICK_MOBILE_MENU = 'MENU_CLICK_MOBILE_MENU'
export const MENU_CHANGE_DEFAULT_CLASSES = 'MENU_CHANGE_DEFAULT_CLASSES'
export const MENU_CHANGE_HAS_SUB_ITEM_STATUS = 'MENU_CHANGE_HAS_SUB_ITEM_STATUS'

// STAFF
export const REGISTER_STAFF = 'REGISTER_STAFF'
export const REGISTER_STAFF_SUCCESS = 'REGISTER_STAFF_SUCCESS'
export const REGISTER_STAFF_ERROR = 'REGISTER_STAFF_ERROR'

// MERCHANT
export const GET_MERCHANT = 'GET_MERCHANT'
export const GET_MERCHANT_SUCCESS = 'GET_MERCHANT_SUCCESS'
export const GET_MERCHANT_ERROR = 'GET_MERCHANT_ERROR'

// RESTAURANT
export const SET_RESTAURANT = 'SET_RESTAURANT'
export const GET_RESTAURANT = 'GET_RESTAURANT'
export const GET_RESTAURANT_SUCCESS = 'GET_RESTAURANT_SUCCESS'
export const GET_RESTAURANT_ERROR = 'GET_RESTAURANT_ERROR'

// MENU LIST
export const GET_MENUS = 'GET_MENUS'
export const GET_MENUS_SUCCESS = 'GET_MENUS_SUCCESS'
export const GET_MENUS_ERROR = 'GET_MENUS_ERROR'

// MENU
export const SET_MENU = 'SET_MENU'
export const GET_MENU = 'GET_MENU'
export const GET_MENU_SUCCESS = 'GET_MENU_SUCCESS'
export const GET_MENU_ERROR = 'GET_MENU_ERROR'

// MENU GROUP
export const GET_MENU_GROUP = 'GET_MENU_GROUP'
export const GET_MENU_GROUP_SUCCESS = 'GET_MENU_GROUP_SUCCESS'
export const GET_MENU_GROUP_ERROR = 'GET_MENU_GROUP_ERROR'

// MENU ITEM
export const GET_MENU_ITEM = 'GET_MENU_ITEM'
export const GET_MENU_ITEM_SUCCESS = 'GET_MENU_ITEM_SUCCESS'
export const GET_MENU_ITEM_ERROR = 'GET_MENU_ITEM_ERROR'

export * from './menu2/actions'
export * from './settings/actions'
export * from './auth/actions'
export * from './staff/actions'
export * from './merchant/actions'
export * from './restaurant/actions'
export * from './menu/actions'
