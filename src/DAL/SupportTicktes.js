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
