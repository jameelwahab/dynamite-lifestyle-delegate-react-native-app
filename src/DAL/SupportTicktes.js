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


export const MOVE_TICKET = ({ token, body, navigation, ticketId = "" }) => {
  return invokeApi({
    path: `api/support_ticket/move_support_ticket_status/${ticketId}`,
    method: "POST",
    postData: body,
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

export const UPLOAD_TICKET_IMAGE = ({ token, body, navigation, }) => {
  return invokeApi({
    path: `api/support_ticket/upload_support_ticket_comment_images`,
    method: "POST",
    postData: body,
    headers: {
      "content-type": "multipart/form-data"
    },
    token,
    navigation,
  })
}

export const ADD_TICKET_COMMENT = ({ token,
  body: {
    support_ticket, message, comment_image
  },
  navigation, }) => {
  return invokeApi({
    path: `api/support_ticket/add_support_ticket_comment/`,
    method: "POST",
    postData: { support_ticket, message, comment_image },
    token,
    navigation,
  })
}

export const DELETE_TICKET_COMMENT = ({ token, navigation, commentId }) => {
  return invokeApi({
    path: `api/support_ticket/delete_support_ticket_comment/${commentId}`,
    method: "DELETE",
    token,
    navigation,
  })
}

export const EDIT_TICKET_COMMENT = ({ token,
  body: {
    message, comment_image
  },
  navigation, commentId }) => {
  return invokeApi({
    path: `api/support_ticket/edit_support_ticket_comment/${commentId}`,
    method: "PUT",
    postData: { message, comment_image },
    token,
    navigation,
  })
}


export const SEND_TICKET_REMINDER = ({ token, body: { message, support_ticket }, navigation, }) => {
  return invokeApi({
    path: `api/support_ticket/send_reminder`,
    method: "POST",
    postData: { message, support_ticket },
    token,
    navigation,
  })
}

