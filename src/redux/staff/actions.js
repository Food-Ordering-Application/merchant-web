import {
  REGISTER_STAFF,
  REGISTER_STAFF_SUCCESS,
  REGISTER_STAFF_ERROR,
  GET_STAFF_LIST,
  GET_STAFF_LIST_SUCCESS,
  GET_STAFF_LIST_ERROR,
  SET_STAFF_LIST,
} from '../actions'

export const registerStaff = (user, history) => {
  return {
    type: REGISTER_STAFF,
    payload: { user, history },
  }
}

export const registerStaffSuccess = (user) => {
  return {
    type: REGISTER_STAFF_SUCCESS,
    payload: user,
  }
}

export const registerStaffError = (message) => ({
  type: REGISTER_STAFF_ERROR,
  payload: { message },
})

export const setStaffList = (staffs, history) => {
  return {
    type: SET_STAFF_LIST,
    payload: { staffs, history },
  }
}

export const getStaffList = (user, history) => {
  return {
    type: GET_STAFF_LIST,
    payload: { user, history },
  }
}

export const getStaffListSuccess = (user) => {
  return {
    type: GET_STAFF_LIST_SUCCESS,
    payload: user,
  }
}

export const getStaffListError = (message) => ({
  type: GET_STAFF_LIST_ERROR,
  payload: { message },
})
