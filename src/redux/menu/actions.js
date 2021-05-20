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
  CREATE_MENU_GROUP,
  CREATE_MENU_GROUP_SUCCESS,
  CREATE_MENU_GROUP_ERROR,
  CREATE_MENU_ITEM,
  CREATE_MENU_ITEM_SUCCESS,
  CREATE_MENU_ITEM_ERROR,
  SET_TOPPING_GROUP,
  CREATE_TOPPING_GROUP,
  CREATE_TOPPING_GROUP_SUCCESS,
  CREATE_TOPPING_GROUP_ERROR,
  CREATE_TOPPING_ITEM,
  CREATE_TOPPING_ITEM_SUCCESS,
  CREATE_TOPPING_ITEM_ERROR,
  GET_TOPPING_GROUP,
  GET_TOPPING_GROUP_SUCCESS,
  GET_TOPPING_GROUP_ERROR,
  GET_TOPPING_ITEMS,
  GET_TOPPING_ITEMS_SUCCESS,
  GET_TOPPING_ITEMS_ERROR,
  SET_MENU_ITEMS_BY_TOPPING,
  UPDATE_TOPPING_BY_MENU_ITEMS,
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

export const createMenuGroup = ({
  merchantId,
  restaurantId,
  menuId,
  data,
}) => ({
  type: CREATE_MENU_GROUP,
  payload: { merchantId, restaurantId, menuId, data },
})

export const createMenuGroupSuccess = (menuGroup) => ({
  type: CREATE_MENU_GROUP_SUCCESS,
  payload: { menuGroup },
})

export const createMenuGroupError = (error) => ({
  type: CREATE_MENU_GROUP_ERROR,
  payload: { message: error },
})

export const createMenuItem = ({
  merchantId,
  restaurantId,
  menuId,
  menuGroupId,
  data,
  history,
}) => ({
  type: CREATE_MENU_ITEM,
  payload: { merchantId, restaurantId, menuId, menuGroupId, data, history },
})

export const createMenuItemSuccess = (menuItem, history) => ({
  type: CREATE_MENU_ITEM_SUCCESS,
  payload: { menuItem, history },
})

export const createMenuItemError = (error) => ({
  type: CREATE_MENU_ITEM_ERROR,
  payload: { message: error },
})

export const createToppingGroup = ({
  merchantId,
  restaurantId,
  menuId,
  data,
}) => ({
  type: CREATE_TOPPING_GROUP,
  payload: { merchantId, restaurantId, menuId, data },
})

export const createToppingGroupSuccess = (toppingGroup) => ({
  type: CREATE_TOPPING_GROUP_SUCCESS,
  payload: { toppingGroup },
})

export const createToppingGroupError = (error) => ({
  type: CREATE_TOPPING_GROUP_ERROR,
  payload: { message: error },
})

export const createToppingItem = ({
  merchantId,
  restaurantId,
  menuId,
  toppingGroupId,
  data,
}) => ({
  type: CREATE_TOPPING_ITEM,
  payload: { merchantId, restaurantId, menuId, toppingGroupId, data },
})

export const createToppingItemSuccess = (toppingItem, history) => ({
  type: CREATE_TOPPING_ITEM_SUCCESS,
  payload: { toppingItem, history },
})

export const createToppingItemError = (error) => ({
  type: CREATE_TOPPING_ITEM_ERROR,
  payload: { message: error },
})

export const getToppingGroup = ({ merchantId, restaurantId, menuId }) => ({
  type: GET_TOPPING_GROUP,
  payload: { merchantId, restaurantId, menuId },
})

export const getToppingGroupSuccess = (toppingGroups) => ({
  type: GET_TOPPING_GROUP_SUCCESS,
  payload: { toppingGroups },
})

export const getToppingGroupError = (error) => ({
  type: GET_TOPPING_GROUP_ERROR,
  payload: { message: error },
})

export const getToppingItems = ({ merchantId, restaurantId, menuId }) => ({
  type: GET_TOPPING_ITEMS,
  payload: { merchantId, restaurantId, menuId },
})

export const getToppingItemsSuccess = (toppingItems) => ({
  type: GET_TOPPING_ITEMS_SUCCESS,
  payload: { toppingItems },
})

export const getToppingItemsError = (error) => ({
  type: GET_TOPPING_ITEMS_ERROR,
  payload: { message: error },
})

export const setMenuItemsByTopping = (data) => ({
  type: SET_MENU_ITEMS_BY_TOPPING,
  payload: { data },
})

export const updateToppingByMenuItems = (data) => ({
  type: UPDATE_TOPPING_BY_MENU_ITEMS,
  payload: {},
})
