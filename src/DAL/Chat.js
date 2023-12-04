import invokeApi from "../functions/invokeAPI"



export const CHAT_LIST = ({ token, navigation, body: { event_id, search_text }, page }) => {
  return invokeApi({
    path: `api/chat/list_chat_with_event_delegate/list/v1?page=${page}&limit=50`,
    method: "POST",
    token: token,
    navigation: navigation,
    postData: { event_id, search_text }
  })
}


export const PORTAL_LIST = ({ token, navigation, }) => {
  return invokeApi({
    path: `api/consultant/protal_list_for_chat/delegate`,
    method: "GET",
    token: token,
    navigation: navigation,
  })
}

export const CHAT_MEMBERS_LIST = ({ token, navigation, body: { search_text, event_id } }) => {
  return invokeApi({
    path: `api/member/consultant_member_list_delegate/search`,
    method: "POST",
    postData: { search_text, event_id },
    token: token,
    navigation: navigation,
  })
}


export const MESSAGE_LIST_BY_CHAT_ID = ({ token, navigation, chatId, page }) => {
  return invokeApi({
    path: `api/chat/list_message/${chatId}?page=${page}&limit=10`,
    method: "GET",
    token: token,
    navigation: navigation,
  })
}

export const MEMBERS_LIST = ({ token, navigation, data: { event_id, search_text } }) => {
  return invokeApi({
    path: `api/member/consultant_member_list_delegate/search`,
    method: "POST",
    postData: {
      event_id, search_text
    },
    token: token,
    navigation: navigation,
  })
}


export const IS_CHAT_EXIST = ({ token, navigation, memberId, }) => {
  return invokeApi({
    path: `api/chat/check_chat_existing/${memberId}`,
    method: "GET",
    token: token,
    navigation: navigation,
  })
}