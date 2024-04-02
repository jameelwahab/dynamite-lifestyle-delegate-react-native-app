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


export const GET_BOOKING_TIME_SLOTS = ({ token, navigation, }) => {
  return invokeApi({
    path: `api/consultant/slots/list/`,
    method: "GET",
    token,
    navigation,
  })
}
