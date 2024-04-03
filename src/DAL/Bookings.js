import invokeApi from "../functions/invokeAPI";

export const GET_BOOKINGS_LIST = ({ token, navigation, page, filters }) => {
  return invokeApi({
    path: `api/consultant/booking/list/v1?page=${page}&limit=20`,
    method: "POST",
    postData: filters,
    token,
    navigation,
  })
}


export const GET_SALE_PAGE_LIST_FOR_BOOKING =
  ({ token, navigation, search }) => {
    return invokeApi({
      path: `api/sale_page/booking_page/list_for_consultant?search_text=${search}`,
      method: "GET",
      token,
      navigation,
    })
  }

export const GET_BOOKING_STATUSES = ({ token, navigation, }) => {
  return invokeApi({
    path: `api/booking_status/active_booking_status`,
    method: "GET",
    token,
    navigation,
  })
}


export const GET_BOOKING_TIME_SLOTS = ({ token, navigation, date }) => {
  return invokeApi({
    path: `api/consultant/slots/list/`,
    method: "POST",
    postData: { date },
    token,
    navigation,
  })
}


export const BOOKING_ADD = ({ token, navigation, data }) => {
  return invokeApi({
    path: `api/consultant/booking/add/`,
    method: "POST",
    postData: data,
    token,
    navigation,
  })
}


export const BOOKING_DELETE = ({ token, navigation, id }) => {
  return invokeApi({
    path: `api/consultant/booking/delete/${id}`,
    method: "DELETE",
    token,
    navigation,
  })
}


export const BOOKING_UPDATE_STATUS = ({ token, navigation, id, data }) => {
  return invokeApi({
    path: `api/consultant/update_booking_status/${id}`,
    method: "PUT",
    postData: data,
    token,
    navigation,
  })
}
