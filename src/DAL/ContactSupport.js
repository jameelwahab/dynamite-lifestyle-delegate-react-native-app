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
  subject, description, department
} }) => {
  return invokeApi({
    path: `api/department/list_active_department?type=delegate`,
    method: "POST",
    postData: { subject, description, department },
    token,
    navigation,
  })
}