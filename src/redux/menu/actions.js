import {
  GET_MENUS,
  GET_MENUS_SUCCESS,
  GET_MENUS_ERROR,
  GET_MENU,
  GET_MENU_SUCCESS,
  GET_MENU_ERROR,
  GET_MENU_GROUP,
  GET_MENU_GROUP_SUCCESS,
  GET_MENU_GROUP_ERROR,
  SET_MENU,
  GET_MENU_ITEM,
  GET_MENU_ITEM_SUCCESS,
  GET_MENU_ITEM_ERROR,
} from '../actions'

export const getMenus = (merchantId, restaurantId) => ({
  type: GET_MENUS,
  payload: { merchantId, restaurantId },
})

export const getMenusSuccess = (menus) => ({
  type: GET_MENUS_SUCCESS,
  payload: { menus },
})

export const getMenusError = (error) => ({
  type: GET_MENUS_ERROR,
  payload: { message: error },
})

export const setMenu = (menuId) => ({
  type: SET_MENU,
  payload: { menuId },
})

export const getMenu = (merchantId, restaurantId) => ({
  type: GET_MENU,
  payload: { merchantId, restaurantId },
})

export const getMenuSuccess = (menu) => ({
  type: GET_MENU_SUCCESS,
  payload: { menu },
})

export const getMenuError = (error) => ({
  type: GET_MENU_ERROR,
  payload: { message: error },
})

export const getMenuGroup = ({ merchantId, restaurantId, menuId }) => ({
  type: GET_MENU_GROUP,
  payload: { merchantId, restaurantId, menuId },
})

export const getMenuGroupSuccess = (menuGroup) => ({
  type: GET_MENU_GROUP_SUCCESS,
  payload: { menuGroup },
})

export const getMenuGroupError = (error) => ({
  type: GET_MENU_GROUP_ERROR,
  payload: { message: error },
})

export const getMenuItems = ({ merchantId, restaurantId, menuId }) => ({
  type: GET_MENU_ITEM,
  payload: { merchantId, restaurantId, menuId },
})

export const getMenuItemsSuccess = (menuItems) => ({
  type: GET_MENU_ITEM_SUCCESS,
  payload: { menuItems },
})

export const getMenuItemsError = (error) => ({
  type: GET_MENU_ITEM_ERROR,
  payload: { message: error },
})
