import invokeApi from "../functions/invokeAPI";

export const GET_CALENDAR_EVENTS_LIST = ({ token, navigation, body: {
  created_for, end_date, start_date
} }) => {
  return invokeApi({
    path: `api/event/list`,
    method: "POST",
    body: { created_for, end_date, start_date },
    token,
    navigation,
  })
}


export const GET_ALL_CALENDAR_EVENTS_LIST = ({ token, navigation }) => {
  return invokeApi({
    path: `api/event/consultant`,
    method: "GET",
    token,
    navigation,
  })
}

export const CALENDAR_EVENT_DELETE = ({ token, navigation,slug }) => {
  return invokeApi({
    path: `api/event/delete`,
    method: "POST",
    postData:slug,
    token,
    navigation,
  })
}