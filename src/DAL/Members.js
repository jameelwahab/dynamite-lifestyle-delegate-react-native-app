import moment from "moment";
import invokeApi from "../functions/invokeAPI";

export const LIST_OF_MEMBERS = ({ token, navigation, page, searchText, body: {
  coins, coins_from = 0, coins_range = false, coins_to = 0, community = [], date = null,
  event_page = [], expiry_in = 3, filter_From = "", filter_name = null, from_date = null,
  is_date_range = false, lead_status = [], member_ship_expiry = "", membership_expiry = null,
  membership_purchase_expiry_from = moment(), membership_purchase_expiry_to = moment(),
  nurture = null, plan = null, sort_by = null, status = "", to_date = null,
  user_status_type = "", search_text = ""
} }) => {
  return invokeApi({
    path: `api/member/member_list_for_delegate?page=${page}&limit=10&search_text=${searchText}`,
    method: "POST",
    postData: {
      coins, coins_from, coins_range, coins_to, community, date, event_page, expiry_in, filter_From,
      filter_name, from_date, is_date_range, lead_status, member_ship_expiry, membership_expiry, membership_expiry,
      membership_purchase_expiry_from, membership_purchase_expiry_to, nurture, plan, sort_by, status, to_date, user_status_type,
      search_text
    },
    token,
    navigation,
  })
}



export const GET_FILTER_DATA = ({ token, navigation, }) => {
  return invokeApi({
    path: `api/consultant/filter_data_for/delegate?search_text=&delegate_search_text=&filter_on_tab_name=all-member`,
    method: "GET",
    token,
    navigation,
  })
}

export const LEAD_STATUS_LIST = ({ token, navigation, }) => {
  return invokeApi({
    path: `api/lead_status/active_lead_status`,
    method: "GET",
    token,
    navigation,
  })
}


export const CHANGE_LEAD_STATUS = ({ token, navigation, body: {
  changed_date_time, income_value, lead_status, member_id
} }) => {
  return invokeApi({
    path: `api/lead_status/change/for_member`,
    postData: {
      changed_date_time, income_value, lead_status, member_id
    },
    method: "PUT",
    token,
    navigation,
  })
}

export const EDIT_LEAD_STATUS = ({ token, navigation, body: {
  id, changed_date_time, income_value, lead_status, member_id
} }) => {
  return invokeApi({
    path: `api/lead_status/edit_lead_status/for_member`,
    postData: {
      id, changed_date_time, income_value, lead_status, member_id
    },
    method: "POST",
    token,
    navigation,
  })
}

export const LEAD_STATUS_HISTORY = ({ token, navigation, memberId }) => {
  return invokeApi({
    path: `api/lead_status/list_lead_status/for_member/${memberId}`,
    method: "GET",
    token,
    navigation,
  })
}

export const DELETE_STATUS_HISTORY = ({ token, navigation, body: {
  id, lead_status, member_id
} }) => {
  return invokeApi({
    path: `api/lead_status/delete_lead_status/for_member`,
    postData: {
      id, lead_status, member_id
    },
    method: "POST",
    token,
    navigation,
  })
}