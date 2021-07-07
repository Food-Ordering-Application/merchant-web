import { SET_NEW_ORDER } from '../actions'

export const setNewOrder = (order) => ({
  type: SET_NEW_ORDER,
  payload: { order },
})
