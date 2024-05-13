import invokeApi from "../functions/invokeAPI";

export const GET_ACCOUNTABILITY_TRACKER_BY_DATE = ({ token, navigation, date }) => {
  return invokeApi({
    path: `api/daily_dynamite_tracker/get_daily_dynamite_intentions?date=${date}`,
    method: "GET",
    token,
    navigation,
  })
}

export const ADD_ACCOUNTABILITY_TRACKER = ({ token, navigation, body }) => {
  return invokeApi({
    path: `api/daily_dynamite_tracker/add_daily_dynamite`,
    method: "POST",
    postData: body,
    token,
    navigation,
  })
}


export const UPDATE_ACCOUNTABILITY_TRACKER = ({ token, navigation, body, id }) => {
  return invokeApi({
    path: `api/daily_dynamite_tracker/update_daily_tracker/${id}`,
    method: "POST",
    postData: body,
    token,
    navigation,
  })
}

export const DELETE_ACCOUNTABILITY_TRACKER = ({ token, navigation, id }) => {
  return invokeApi({
    path: `api/daily_dynamite_tracker/delete_daily_dynamite/${id}`,
    method: "DELETE",
    token,
    navigation,
  })
}

export const ACCOUNTABILITY_TRACKER_LIST = ({ token, navigation, id }) => {
  return invokeApi({
    path: `api/daily_dynamite_tracker/delete_daily_dynamite/${id}`,
    method: "DELETE",
    token,
    navigation,
  })
}


export const SET_ACCOUNTABILITY_TRACKER_REMINDER = ({ token, navigation, body }) => {
  return invokeApi({
    path: `api/consultant/reminder_time/update`,
    method: "POST",
    postData: body,
    token,
    navigation,
  })
}

