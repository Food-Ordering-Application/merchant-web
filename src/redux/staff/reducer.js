import {
  REGISTER_STAFF,
  REGISTER_STAFF_SUCCESS,
  REGISTER_STAFF_ERROR,
  SET_STAFF_LIST,
  SET_STAFF,
} from '../actions'

const INIT_STATE = {
  //   user: localStorage.getItem('user_id'),
  //   user: localStorage.getItem('user_token'),
  //   forgotUserMail: '',
  //   newPassword: '',
  //   resetPasswordCode: '',
  staffs: [],
  staff: '',
  loading: false,
  error: '',
}

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case REGISTER_STAFF:
      return { ...state, loading: true, error: '' }
    case REGISTER_STAFF_SUCCESS:
      return {
        ...state,
        loading: false,
        staff: action.payload.staff,
        error: '',
      }
    case REGISTER_STAFF_ERROR:
      return {
        ...state,
        loading: false,
        staff: '',
        error: action.payload.message,
      }
    case SET_STAFF_LIST:
      return {
        ...state,
        loading: false,
        staffs: action.payload.staffs,
        error: '',
      }
    case SET_STAFF: {
      const { data } = action.payload
      let newStaffList = [...state.staffs]
      const foundIndex = newStaffList.findIndex((item) => item.id === data.id)
      newStaffList[foundIndex] = { ...data }

      return {
        ...state,
        staffs: newStaffList,
      }
    }
    default:
      return { ...state }
  }
}
