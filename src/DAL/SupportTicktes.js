import invokeApi from "../functions/invokeAPI";

export const SUPPORT_TCIKETS_LIST_BY_TYPE =
  ({ token, body, navigation, page, searchText }) => {
    return invokeApi({
      path: `api/support_ticket/get_filtered_list_support_ticket_by_consultant_v3?page=${page}&limit=10&search_text=${searchText}`,
      method: "POST",
      postData: body,
      token,
      navigation,
    })
  }

export const SUPPORT_TCIKET_DETAIL = ({ token, navigation, ticketId }) => {
  return invokeApi({
    path: `api/support_ticket/detail_support_ticket/${ticketId}`,
    method: "GET",
    token,
    navigation,
  })
}

export const SUPPORT_TCIKET_NOTES_LIST = ({ token, navigation, ticketId }) => {
  return invokeApi({
    path: `api/support_ticket/list_intenal_note/${ticketId}`,
    method: "GET",
    token,
    navigation,
  })
}


export const LIST_OF_DEPARTMENTS = ({ token, navigation, }) => {
  return invokeApi({
    path: `api/department/list_department/client/tickets`,
    method: "GET",
    token,
    navigation,
  })
}

export const CHANGE_DEPARTMENT_OF_TICKET = ({ token, body, navigation, ticketId }) => {
  return invokeApi({
    path: `api/support_ticket/edit_department_by_delegate/${ticketId}`,
    method: "PUT",
    postData: body,
    token,
    navigation,
  })
}


export const MOVE_TICKET = ({ token, body: {
  status_to_move, support_ticket
}, navigation, ticketId }) => {
  return invokeApi({
    path: `api/support_ticket/move_support_ticket_status/${ticketId}`,
    method: "POST",
    postData: {
      status_to_move, support_ticket
    },
    token,
    navigation,
  })
}


export const MARK_RESOLVE_TICKET = ({ token, body: {
  close_note, reason_to_solve, support_ticket
}, navigation, }) => {
  return invokeApi({
    path: `api/support_ticket/mark_resolve`,
    method: "POST",
    postData: { close_note, reason_to_solve, support_ticket },
    token,
    navigation,
  })
}

