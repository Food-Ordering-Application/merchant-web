import { all, call, fork, put, takeEvery } from '@redux-saga/core/effects'
import { REGISTER_STAFF, REGISTER_USER } from '../actions'
import { getErrorMessage } from '../utils'
import axios from 'axios'
import { STAFF_URL, ACCESS_TOKEN } from 'src/constants/config'
import { registerStaffSuccess, registerStaffError } from './actions'

const registerstaffdAsync = async (user) => {
  try {
    let response
    response = await axios({
      method: 'post',
      url: STAFF_URL,
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      data: user,
    })
    console.log(response)
    return response
  } catch (error) {
    return getErrorMessage(error)
  }
}

function* registerStaff({ payload }) {
  const { history } = payload
  try {
    const registerStaff = yield call(registerstaffdAsync, payload.user)
    if (!registerStaff.message) {
      yield put(registerStaffSuccess(registerStaff))
    } else {
      console.log(registerStaff.message)
      yield put(registerStaffError(registerStaff.message))
    }
  } catch (error) {
    yield put(registerStaffError('Something went wrong in Saga!'))
  }
}

export function* watchRegisterStaff() {
  // yield takeEvery(REGISTER_USER, loginWithUsernamePassword)
  yield takeEvery(REGISTER_STAFF, registerStaff)
}

export default function* rootSaga() {
  yield all([fork(watchRegisterStaff)])
}
