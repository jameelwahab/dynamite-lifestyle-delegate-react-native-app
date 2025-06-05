import invokeApi from "../functions/invokeAPI";



export const CONTACT_SUPPORT_TCIKETS_LIST_BY_TYPE =
  ({ token, body, navigation, }) => {
    return invokeApi({
      path: `api/support_ticket/get_filtered_list_support_ticket`,
      method: "POST",
      postData: body,
      headers: { "content-type": "multipart/form-data" },
      token,
      navigation,
    })
  }

export const DEPARTMENT_LIST_FOR_DELEGATE = ({ token, navigation, }) => {
  return invokeApi({
    path: `api/department/list_active_department?type=delegate`,
    method: "GET",
    token,
    navigation,
  })
}

export const ADD_TICKET_CONTECT_SUPPORT = ({ token, navigation, body: {
  subject, description, department, ticket_images, priority
} }) => {
  return invokeApi({
    path: `api/support_ticket/add_support_ticket`,
    method: "POST",
    postData: { subject, description, department, ticket_images, priority },
    token,
    navigation,
  })
}

export const EDIT_TICKET_CONTECT_SUPPORT = ({ token, navigation, ticketId, body: {
  subject, description, department, ticket_images, priority
} }) => {
  return invokeApi({
    path: `api/support_ticket/edit_support_ticket/${ticketId}`,
    method: "PUT",
    postData: { subject, description, department, ticket_images, priority, status: true },
    token,
    navigation,
  })
}


export const DELETE_TICKET_CONTECT_SUPPORT = ({ token, navigation, ticketId }) => {
  return invokeApi({
    path: `api/support_ticket/trash_support_ticket/${ticketId}`,
    method: "DELETE",
    token,
    navigation,
  })
}

export const MARK_RESOLVE_TICKET_CONTECT_SUPPORT = ({ token, navigation, ticketId }) => {
  return invokeApi({
    path: `api/support_ticket/close_support_ticket/${ticketId}`,
    method: "GET",
    token,
    navigation,
  })
}