import invokeApi from "../functions/invokeAPI";

export const GET_NINTY_DAY_DETAIL = ({ token, navigation, }) => {
  return invokeApi({
    path: `api/delegate_earning/get_delegate_earning`,
    method: "GET",
    token,
    navigation,
  })
}

export const SET_90_DAYS_TARGET = ({ token, navigation, body: {
  tracker_start_date, tracker_target_amount
} }) => {
  return invokeApi({
    path: `api/consultant/nineteen_day_vision`,
    method: "POST",
    postData: {
      nineteen_day_vision: { tracker_start_date, tracker_target_amount }
    },
    token,
    navigation,
  })
}

export const ADD_EARNING = ({ token, navigation, body: { date, description, earning } }) => {
  return invokeApi({
    path: `api/delegate_earning/add_delegate_earning`,
    method: "POST",
    postData: { date, description, earning },
    token,
    navigation,
  })
}

export const EDIT_EARNING = ({ token, navigation, earningId, body: { date, description, earning } }) => {
  return invokeApi({
    path: `api/delegate_earning/edit_delegate_earning/${earningId}`,
    method: "PUT",
    postData: { date, description, earning },
    token,
    navigation,
  })
}
export const DELETE_EARNING = ({ token, navigation, earningId, }) => {
  return invokeApi({
    path: `api/delegate_earning/delete_delegate_earning/${earningId}`,
    method: "DELETE",
    token,
    navigation,
  })
}
