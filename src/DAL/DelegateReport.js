import invokeApi from "../functions/invokeAPI";

export const GET_DELEGATE_REPORT_LIST = ({ token, navigation, page, body: {
  start_date, end_date, created_for, search_text, type
} }) => {
  return invokeApi({
    path: `api/daily_dynamite_tracker/list_and_performance_stats_infor_for_delegate?page=${page}&limit=10`,
    method: "POST",
    postData: {
      start_date, end_date, created_for, search_text, type
    },
    token,
    navigation,
  })
}


export const GET_SALES_PERDORMANCE = ({ token, navigation, page, body: {
  start_date, end_date, created_for, search_text, type
} }) => {
  return invokeApi({
    path: `api/consultant/list_sales_performance?page=0&limit=10`,
    method: "POST",
    postData: {
      start_date, end_date, created_for, search_text, type
    },
    token,
    navigation,
  })
}

export const GET_MONTHY_REPORT_DETAIL = ({ token, navigation, type, page, body: {
  start_date, end_date, created_for, search_text
} }) => {
  return invokeApi({
    path: `api/daily_dynamite_tracker/${type}?page=${page}&limit=10&search_text=${searchText}`,
    method: "POST",
    postData: {
      search_text, start_date, end_date, created_for
    },
    token,
    navigation,
  })
}