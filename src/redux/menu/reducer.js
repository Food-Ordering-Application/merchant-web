import {
  GET_MENUS,
  SET_MENU,
  GET_MENUS_SUCCESS,
  GET_MENU_GROUP_SUCCESS,
  GET_MENU_GROUP_ERROR,
  GET_MENU_GROUP,
  GET_MENU_ITEM,
  GET_MENU_ITEM_SUCCESS,
  GET_MENU_ITEM_ERROR,
  SET_MENU_GROUP,
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
  GET_TOPPING_GROUP,
  GET_TOPPING_GROUP_SUCCESS,
  GET_TOPPING_GROUP_ERROR,
  CREATE_TOPPING_ITEM,
  CREATE_TOPPING_ITEM_SUCCESS,
  CREATE_TOPPING_ITEM_ERROR,
  GET_TOPPING_ITEMS,
  GET_TOPPING_ITEMS_SUCCESS,
  GET_TOPPING_ITEMS_ERROR,
  SET_TOPPING_BY_MENU_ITEMS,
  UPDATE_TOPPING_WITH_MENU_ITEMS,
  UPDATE_TOPPING_WITH_MENU_ITEMS_ERROR,
  UPDATE_TOPPING_WITH_MENU_ITEMS_SUCCESS,
  GET_MENUS_ERROR,
} from '../actions'

const INIT_STATE = {
  menu: {},
  menuGroup: [],
  menus: [],
  menuItems: [],
  toppingGroups: [],
  toppingItems: [],
  loading: false,
  loadingGetMenus: false,
  loadingMenuItems: false,
  loadingMenuItem: false,
  loadingToppingGroups: false,
  loadingCreateToppingItem: false,
  loadingToppingItems: false,
  toppingByMenuItems: [],
  error: '',
  totalToppingItems: 0,
  totalMenuItems: 0,
}

export default (state = INIT_STATE, action) => {
  const { payload, type } = action
  switch (type) {
    case GET_MENUS: {
      return { ...state, loadingGetMenus: true, error: '' }
    }
    case GET_MENUS_SUCCESS: {
      console.log(payload)
      return {
        ...state,
        loadingGetMenus: false,
        error: '',
        menus: payload.menus,
      }
    }
    case GET_MENUS_ERROR: {
      console.log(payload)
      return {
        ...state,
        loadingGetMenus: false,
        error: payload.message,
        menus: [],
      }
    }
    // GET MENU GROUP
    case GET_MENU_GROUP: {
      return { ...state, loading: true, error: '' }
    }
    case GET_MENU_GROUP_SUCCESS: {
      return {
        ...state,
        loading: false,
        error: '',
        menuGroup: payload.menuGroup,
      }
    }
    case GET_MENU_GROUP_ERROR: {
      console.log(payload)
      return {
        ...state,
        loading: false,
        menuGroup: [],
        error: payload.message,
      }
    }
    // MENU ITEM
    case SET_MENU: {
      const selectedMenu = state.menus.find(
        (menu) => menu.id === payload.menuId
      )
      return {
        ...state,
        menu: selectedMenu,
      }
    }

    case GET_MENU_ITEM: {
      return { ...state, loadingMenuItems: true, error: '' }
    }
    case GET_MENU_ITEM_SUCCESS: {
      // console.log(payload.menuItems)
      // console.log(state.menuGroup)

      return {
        ...state,
        loadingMenuItems: false,
        error: '',
        menuItems: payload.menuItems,
        totalMenuItems: payload.totalMenuItems,
      }
    }
    case GET_MENU_ITEM_ERROR: {
      console.log(payload)
      return {
        ...state,
        loadingMenuItems: false,
        menuItems: [],
        error: payload.message,
      }
    }

    // MENU GROUP
    case SET_MENU_GROUP: {
      return {
        ...state,
        menuGroup: [...state.menuGroup, payload.menuGroup],
      }
    }

    case CREATE_MENU_GROUP: {
      console.log(payload)
      return { ...state, loadingMenuGroups: true, error: '' }
    }

    case CREATE_MENU_GROUP_SUCCESS: {
      return {
        ...state,
        menuGroup: [...state.menuGroup, payload.menuGroup],
        loadingMenuGroups: false,
        error: '',
      }
    }

    case CREATE_MENU_GROUP_ERROR: {
      console.log(payload)
      return {
        ...state,
        loadingMenuGroups: false,
        menuGroup: [],
        error: payload.message,
      }
    }

    // CREATE MENU ITEM
    case CREATE_MENU_ITEM: {
      console.log(payload)
      return { ...state, loadingMenuItem: true, error: '' }
    }

    case CREATE_MENU_ITEM_SUCCESS: {
      console.log(payload)
      return {
        ...state,
        menuItems: [...state.menuItems, payload.menuItem],
        loadingMenuItem: false,
        error: '',
      }
    }
    case CREATE_MENU_ITEM_ERROR: {
      console.log(payload)
      return {
        ...state,
        loadingMenuItem: false,
        error: payload.message,
      }
    }

    // CREATE TOPPING GROUP
    case CREATE_TOPPING_GROUP: {
      console.log(payload)
      return { ...state, loadingToppingGroups: true, error: '' }
    }

    case CREATE_TOPPING_GROUP_SUCCESS: {
      console.log(payload)
      return {
        ...state,
        toppingGroups: [...state.toppingGroups, payload.toppingGroup],
        loadingToppingGroups: false,
        error: '',
      }
    }

    case CREATE_TOPPING_GROUP_ERROR: {
      console.log(payload)
      return {
        ...state,
        loadingToppingGroups: false,
        toppingGroups: [],
        error: payload.message,
      }
    }

    // GET TOPPING GROUP
    case GET_TOPPING_GROUP: {
      console.log(payload)
      return { ...state, loadingGetToppingGroups: true, error: '' }
    }

    case GET_TOPPING_GROUP_SUCCESS: {
      console.log(payload)
      return {
        ...state,
        loadingGetToppingGroups: false,
        error: '',
        toppingGroups: payload.toppingGroups,
      }
    }

    case GET_TOPPING_GROUP_ERROR: {
      console.log(payload)
      return {
        ...state,
        loadingGetToppingGroups: false,
        toppingGroups: [],
        error: payload.message,
      }
    }

    // CREATE TOPPING ITEM
    case CREATE_TOPPING_ITEM: {
      console.log(payload)
      return { ...state, loadingCreateToppingItem: true, error: '' }
    }

    case CREATE_TOPPING_ITEM_SUCCESS: {
      console.log(payload)
      return {
        ...state,
        // toppingGroups: [...state.toppingGroups, payload.toppingGroup],
        loadingCreateToppingItem: false,
        error: '',
      }
    }

    case CREATE_TOPPING_ITEM_ERROR: {
      console.log(payload)
      return {
        ...state,
        loadingCreateToppingItem: false,
        // toppingGroups: [],
        error: payload.message,
      }
    }

    // GET TOPPING ITEM LIST
    case GET_TOPPING_ITEMS: {
      return { ...state, loadingToppingItems: true, error: '' }
    }
    case GET_TOPPING_ITEMS_SUCCESS: {
      // console.log(payload.menuItems)
      // console.log(state.menuGroup)
      return {
        ...state,
        loadingToppingItems: false,
        error: '',
        toppingItems: payload.toppingItems,
        totalToppingItems: payload.total,
      }
    }
    case GET_TOPPING_ITEMS_ERROR: {
      console.log(payload)
      return {
        ...state,
        loadingToppingItems: false,
        toppingItems: [],
        error: payload.message,
      }
    }
    case SET_TOPPING_BY_MENU_ITEMS: {
      console.log(payload)
      const { data } = payload

      if (data.length === 0) return { ...state }
      let isDuplicateItem = false
      let prevState = { ...state }

      data.forEach((dataItem) => {
        const existedItemIndex = prevState.toppingByMenuItems.findIndex(
          (item) => item.toppingItem.id === dataItem.toppingItem.id
        )

        if (existedItemIndex !== -1) {
          isDuplicateItem = true
          const newItem = dataItem
          let originalToppingItems = [...prevState.toppingByMenuItems]
          let existedToppingItem = originalToppingItems[existedItemIndex]
          existedToppingItem = {
            toppingItem: {
              ...existedToppingItem.toppingItem,
              menuItem: [
                ...existedToppingItem.toppingItem.menuItem,
                ...dataItem.toppingItem.menuItem,
              ],
            },
          }
          originalToppingItems[existedItemIndex] = existedToppingItem

          prevState = {
            ...prevState,
            toppingByMenuItems: [...originalToppingItems],
          }
        }
      })

      if (isDuplicateItem) {
        return {
          ...prevState,
        }
      } else {
        return {
          ...state,
          toppingByMenuItems: [...state.toppingByMenuItems, ...data],
        }
      }
    }

    case UPDATE_TOPPING_WITH_MENU_ITEMS: {
      return {
        ...state,
      }
    }

    case UPDATE_TOPPING_WITH_MENU_ITEMS_SUCCESS: {
      return {
        ...state,
      }
    }

    case UPDATE_TOPPING_WITH_MENU_ITEMS_ERROR: {
      return {
        ...state,
      }
    }

    // case SET_RESTAURANT: {
    //   return { ...state, restaurant: action.payload.restaurant }
    // }
    // case GET_MERCHANT:
    //   return { ...state, loading: true, error: '' }
    // case GET_MERCHANT_SUCCESS: {
    //   return {
    //     ...state,
    //     loading: false,
    //     merchant: action.payload.merchant,
    //     error: '',
    //   }
    // }
    // case GET_MERCHANT_ERROR:
    //   return {
    //     ...state,
    //     loading: false,
    //     user: '',
    //     error: action.payload.message,
    //   }
    default:
      return { ...state }
  }
}
