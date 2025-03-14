import moment from "moment";
import invokeApi from "../functions/invokeAPI";

export const LIST_OF_MEMBERS = ({ token, navigation, page, searchText, body: {
  coins, coins_from = 0, downloaded_app = null, coins_range = false, coins_to = 0, community = [], date = null, badge_levels = [],
  event_page = [], expiry_in = 3, filter_From = "", filter_name = null, from_date = null,
  is_date_range = false, lead_status = [], member_ship_expiry = "", membership_expiry = null,
  membership_purchase_expiry_from = moment(), membership_purchase_expiry_to = moment(),
  nurture = null, delegate = null, plan = null, sort_by = null, status = "", to_date = null,
  user_status_type = "", search_text = ""
} }) => {
  return invokeApi({
    path: `api/member/member_list_for_delegate?page=${page}&limit=20&search_text=${searchText}`,
    method: "POST",
    postData: {
      coins, coins_from, coins_range, coins_to, community, date, event_page, expiry_in, filter_From,
      filter_name, from_date, is_date_range, lead_status, member_ship_expiry, membership_expiry, membership_expiry,
      membership_purchase_expiry_from, downloaded_app, membership_purchase_expiry_to, nurture, delegate, plan, sort_by, status, to_date, user_status_type,
      search_text, badge_levels
    },
    token,
    navigation,
  })
}

export const LIST_OF_MEMBERS_ONLY = ({ token, navigation, page, searchText, body: {
  coins, coins_from = 0, downloaded_app = null, coins_range = false, coins_to = 0, community = [], date = null,
  event_page = [], expiry_in = 3, filter_From = "", filter_name = null, from_date = null,
  is_date_range = false, lead_status = [], member_ship_expiry = "", membership_expiry = null,
  membership_purchase_expiry_from = moment(), membership_purchase_expiry_to = moment(),
  nurture = null, plan = null, sort_by = null, status = "", to_date = null,
  user_status_type = "", search_text = "", badge_levels = []
} }) => {
  return invokeApi({
    path: `api/event_subscriber/subscriber_list_for_member_with_filter?page=${page}&limit=20&search_text=${searchText}`,
    method: "POST",
    postData: {
      coins, coins_from, coins_range, coins_to, community, date, event_page, expiry_in, filter_From,
      filter_name, from_date, is_date_range, lead_status, member_ship_expiry, membership_expiry, membership_expiry,
      membership_purchase_expiry_from, downloaded_app, membership_purchase_expiry_to, nurture, plan, sort_by, status, to_date, user_status_type,
      search_text, badge_levels
    },
    token,
    navigation,
  })
}

export const LIST_OF_NURTURE = ({ token, navigation, page, searchText, body: {
  coins, coins_from = 0, downloaded_app = null, coins_range = false, coins_to = 0, community = [], date = null,
  event_page = [], expiry_in = 3, filter_From = "", filter_name = null, from_date = null,
  is_date_range = false, lead_status = [], member_ship_expiry = "", membership_expiry = null,
  membership_purchase_expiry_from = moment(), membership_purchase_expiry_to = moment(),
  delegate = null, plan = null, sort_by = null, status = "", to_date = null,
  user_status_type = "", search_text = "", badge_levels = []
} }) => {
  return invokeApi({
    path: `api/consultant/member_list_for/associate?page=${page}&limit=20&search_text=${searchText}`,
    method: "POST",
    postData: {
      coins, coins_from, coins_range, coins_to, community, date, event_page, expiry_in, filter_From,
      filter_name, from_date, is_date_range, lead_status, member_ship_expiry, membership_expiry, membership_expiry,
      membership_purchase_expiry_from, downloaded_app, membership_purchase_expiry_to, delegate, plan, sort_by, status, to_date, user_status_type,
      search_text, badge_levels
    },
    token,
    navigation,
  })
}

export const SAVE_FILTER = ({ token, navigation, body: {
  filter_on_tab_name, filter_name, filter_object
} }) => {
  return invokeApi({
    path: `api/consultant_init/save_portal_filter`,
    method: "POST",
    postData: { filter_on_tab_name, filter_name, filter_object },
    token,
    navigation,
  })
}

export const GET_FILTER_DATA = ({ token, navigation, searchText, type }) => {
  return invokeApi({
    path: `api/consultant/filter_data_for/delegate?search_text=&delegate_search_text=${searchText}&filter_on_tab_name=${type}`,
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


export const MEMBER_NOTES_LIST = ({ token, navigation, memberId }) => {
  return invokeApi({
    path: `api/member/list_personal_note/${memberId}`,
    method: "GET",
    token,
    navigation,
  })
}



export const MEMBER_ADD_NOTE = ({ token, navigation, member_id, personal_note }) => {
  return invokeApi({
    path: `api/member/update_personal_note`,
    method: "POST",
    postData: {
      member_id, personal_note
    },
    token,
    navigation,
  })
}

export const MEMBER_UPDATE_NOTE = ({ token, navigation, member_id, personal_note, note_id }) => {
  return invokeApi({
    path: `api/member/edit_personal_note`,
    method: "POST",
    postData: { member_id, personal_note, note_id },
    token,
    navigation,
  })
}

export const MEMBER_DELETE_NOTE = ({ token, navigation, member_id, note_id }) => {
  return invokeApi({
    path: `api/member/remove_personal_note`,
    method: "POST",
    postData: { member_id, note_id },
    token,
    navigation,
  })
}


export const MEMBER_SUBSCRIPTION_LIST = ({ token, navigation, memberId, page, searchText }) => {
  return invokeApi({
    path: `api/member/event_subscriber_list/member_id/${memberId}?page=${page}&limit=20&search_text=${searchText}`,
    method: "GET",
    token,
    navigation,
  })
}



export const MEMBER_DELETE_SUBSCRIPTION = ({ token, navigation, subscriptionId }) => {
  return invokeApi({
    path: `api/event_subscriber/delete_event_subscriber/${subscriptionId}`,
    method: "DELETE",
    token,
    navigation,
  })
}

export const MEMBER_QUESTIONS_MODULE_LIST = ({ token, navigation, memberId, page }) => {
  return invokeApi({
    path: `api/questionnaire/list_member_question_and_answers/${memberId}?page=${page}&limit=20`,
    method: "GET",
    token,
    navigation,
  })
}

export const MEMBER_PROFILE = ({ token, navigation, memberId, startDate, endDate }) => {
  return invokeApi({
    path: `api/member/${memberId}?start_date=${startDate}&end_date=${endDate}`,
    method: "GET",
    token,
    navigation,
  })
}


export const GET_EVENT_DETAIL = ({ token, navigation, slug }) => {
  return invokeApi({
    path: `api/event/detail/${slug}`,
    method: "GET",
    token,
    navigation,
  })
}

export const GET_MEMBER_LISTING_FOR_SUB_TEAM = ({ token, navigation, page, searchText }) => {
  return invokeApi({
    path: `api/event_subscriber/member_list_for_sub_team?page=${page}&limit=10&search_text=${searchText}`,
    method: "GET",
    token,
    navigation,
  })
}

export const ADD_CALL_HISTORY_NOTE = ({ token, navigation, memberId, body: {
  date, is_add_to_personal_notes, is_checked, notes
} }) => {
  return invokeApi({
    path: `api/member/call_history_note/add/${memberId}`,
    method: "POST",
    postData: { date, is_add_to_personal_notes, is_checked, notes },
    token,
    navigation,
  })
}


export const UPDATE_CALL_FUNCTIONALITY = ({ token, navigation, body: {
  is_call_allowed, member_id
} }) => {
  return invokeApi({
    path: `api/member/update_member_call_alowed`,
    method: "POST",
    postData: { is_call_allowed, member_id },
    token,
    navigation,
  })
}

export const MEMBER_MISSION_QUEST = ({ token, navigation, member_id }) =>invokeApi({
    path: `api/member/get/member_missions_and_quests`,
    method: "POST",
    token,
    navigation,
    postData:{ member_id }
  })

export const MEMBER_SMS_SYSTEM = ({token, navigation, msg, to})=> invokeApi({
		path: "api/consultant/send_sms_to_member",
		method:"POST",
		token,
		navigation,
		postData:{
				body:msg,
				to,
		}
})
