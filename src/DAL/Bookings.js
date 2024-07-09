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

export const GET_BOOKING_TIME_SLOTS_BY_CONSULTANT = ({ token, navigation, date, consultant_id }) => {
  return invokeApi({
    path: `api/consultant/slots_by_delegate`,
    method: "POST",
    postData: { date, consultant_id },
    token,
    navigation,
  })
}


export const BOOKING_ADD = ({ token, navigation, data }) => {
  return invokeApi({
    path: `api/consultant/booking/add/new`,
    method: "POST",
    postData: data,
    token,
    navigation,
  })
}

export const BOOKING_UPDATE = ({ token, navigation, data, bookingId }) => {
  return invokeApi({
    path: `api/consultant/booking/update/${bookingId}`,
    method: "PUT",
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

export const BOOKING_PASS = ({ token, navigation, data, bookingId }) => {
  return invokeApi({
    path: `api/consultant/pass_booking/${bookingId}`,
    method: "PUT",
    postData: data,
    token,
    navigation,
  })
}

export const BOOKING_CONSULTANT_LIST = ({ token, navigation }) => {
  return invokeApi({
    path: `api/consultant/list/for_delegate/`,
    method: "GET",
    token,
    navigation,
  })
}

export const BOOKING_CONSULTANT_LIST_V1 = ({ token, navigation, body: {
  data_type, member_type, search_text,delegates_type,consultant_id
} }) => {
  return invokeApi({
    path: `api/consultant/get_sale_page_member_list_for/booking`,
    method: "POST",
    postData: {
      data_type, member_type, search_text,delegates_type,consultant_id
    },
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


export const BOOKING_NOTES_LIST = ({ token, navigation, id }) => {
  return invokeApi({
    path: `api/booking_note/${id}`,
    method: "GET",
    token,
    navigation,
  })
}

export const BOOKING_NOTES_DELETE = ({ token, navigation, id }) => {
  return invokeApi({
    path: `api/booking_note/${id}`,
    method: "DELETE",
    token,
    navigation,
  })
}

export const BOOKING_NOTES_ADD = ({ token, navigation, body: {
  add_as_personal_note, booking_id, note
} }) => {

  return invokeApi({
    path: `api/booking_note/`,
    method: "POST",
    postData: { add_as_personal_note, booking_id, note },
    token,
    navigation,
  })
}

export const BOOKING_NOTES_UPDATE = ({ token, navigation, id, note }) => {
  return invokeApi({
    path: `api/booking_note/${id}`,
    method: "PUT",
    postData: { note },
    token,
    navigation,
  })
}
