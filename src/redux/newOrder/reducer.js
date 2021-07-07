import {
  REGISTER_STAFF,
  REGISTER_STAFF_SUCCESS,
  REGISTER_STAFF_ERROR,
  SET_STAFF_LIST,
  SET_STAFF,
  SET_NEW_ORDER,
} from '../actions'

const INIT_STATE = {
  order: {},
  loading: false,
  error: '',
}

export default (state = INIT_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case SET_NEW_ORDER:
      return { ...state, order: payload.order }
    // case REGISTER_STAFF:
    //   return { ...state, loading: true, error: '' }
    // case REGISTER_STAFF_SUCCESS:
    //   return {
    //     ...state,
    //     loading: false,
    //     staff: payload.staff,
    //     error: '',
    //   }
    // case REGISTER_STAFF_ERROR:
    //   return {
    //     ...state,
    //     loading: false,
    //     staff: '',
    //     error: payload.message,
    //   }
    // case SET_STAFF_LIST:
    //   return {
    //     ...state,
    //     loading: false,
    //     staffs: payload.staffs,
    //     error: '',
    //   }
    // case SET_STAFF: {
    //   const { data } = payload
    //   let newStaffList = [...state.staffs]
    //   const foundIndex = newStaffList.findIndex((item) => item.id === data.id)
    //   newStaffList[foundIndex] = { ...data }

    //   return {
    //     ...state,
    //     staffs: newStaffList,
    //   }
    // }
    default:
      return { ...state }
  }
}
