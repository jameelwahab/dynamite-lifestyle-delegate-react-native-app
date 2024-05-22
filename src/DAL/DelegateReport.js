import { bool } from "prop-types";
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


export const GET_SALES_PERDORMANCE_BY_DELEGATE = ({ token, navigation, page, body: {
  start_date, end_date, created_for, search_text, 
} }) => {
  return invokeApi({
    path: `api/consultant/list_sales_performance?page=${page}&limit=10`,
    method: "POST",
    postData: {
      start_date, end_date, created_for, search_text, 
    },
    token,
    navigation,
  })
}


export const GET_STREAK_PERFORMANCE_DETAIL_BY_DELEGATE = ({ token, navigation, body: {
  type, delegate_id, start_date, end_date,
} }) => {
  return invokeApi({
    path: `api/daily_dynamite_tracker/list_and_performance_stats_infor_for_delegate`,
    method: "POST",
    postData: {
      type, delegate_id, start_date, end_date,
    },
    token,
    navigation,
  })
}

export const GET_BOOKING_DETAIL_BY_DELEGATE = ({ token, navigation, body: {
  type, delegate_id, start_date, end_date,
} }) => {
  return invokeApi({
    path: `api/consultant/booking_stats/delegate`,
    method: "POST",
    postData: {
      type, consultant_id: delegate_id, start_date, end_date,
    },
    token,
    navigation,
  })
}

export const GET_MONTHY_REPORT_BY_DELEGATE = ({ token, navigation, body: {
  type, delegate_id, month_with_year,
} }) => {
  return invokeApi({
    path: `api/daily_dynamite_tracker/delegate_performance/stats_with_delegate_id`,
    method: "POST",
    postData: {
      type, delegate_id, month_with_year,
    },
    token,
    navigation,
  })
}


export const GET_ACCOUNTABILITY_TRACKER_BY_DELEGATE = ({ token, navigation, body: {
  delegate_id, date_from, date_to,
} }) => {
  return invokeApi({
    path: `api/daily_dynamite_tracker/daily_dynamites_for_delegate`,
    method: "POST",
    postData: {
      delegate_id, date_from, date_to,
    },
    token,
    navigation,
  })
}



export const GET_COMMISSION_DETAIL = ({ token, navigation, delegateId, body: {
  month_and_year, month_name, sale_page, year_name, page, compare_with
} }) => {
  return invokeApi({
    path: `api/consultant/commission_stats/${delegateId}`,
    method: "POST",
    postData: {
      month_and_year, month_name, sale_page, year_name, page, compare_with
    },
    token,
    navigation,
  })
}

export const GET_SALE_PAGES_AND_DELEGATES = ({ token, navigation, delegateId, searchText }) => {
  return invokeApi({
    path: `api/consultant/get_pages_for_delegate/sales/${delegateId}?search_text=${searchText}`,
    method: "GET",
    token,
    navigation,
  })
}

export const GET_REPORT_BOOKINS_LIST = ({ token, navigation, page, deleagteId, body }) => {
  return invokeApi({
    path: `api/consultant/delegate_booking/list/${deleagteId}?page=${page}&limit=20`,
    method: "POST",
    postData: body,
    token,
    navigation,
  })
}

export const GET_REPORT_BOOKING_STATUS_LIST = ({ token, navigation, }) => {
  return invokeApi({
    path: `api/booking_status/active_booking_status`,
    method: "GET",
    token,
    navigation,
  })
}

export const GET_REPORT_BOOKING_PAGES_LIST = ({ token, navigation, }) => {
  return invokeApi({
    path: `api/sale_page/booking_page/list_for_consultant?search_text=`,
    method: "GET",
    token,
    navigation,
  })
}

export const GET_ACCOUNTABILITY_TRACKER_BY_DATE_AND_DELEGATE = ({ token, navigation, delegateId, date }) => {
  return invokeApi({
    path: `api/daily_dynamite_tracker/daily_dynamite_intention/${delegateId}?date=${date}`,
    method: "GET",
    token,
    navigation,
  })
}