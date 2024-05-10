import invokeApi from "../functions/invokeAPI";

export const GET_BROADCAST_CHAT_LIST = ({ token, navigation, body: { search_text }, page }) => {
  return invokeApi({
    path: `api/broadcast/list_broadcast?page=${page}&limit=20`,
    method: "POST",
    token: token,
    navigation: navigation,
    postData: { search_text, }
  })
}

export const GET_BROADCAST_CHAT_DETAIL = ({ token, navigation, chatId, page }) => {
  return invokeApi({
    path: `api/broadcast/broadcast_details/${chatId}?page=${page}&limit=20`,
    method: "GET",
    token: token,
    navigation: navigation,
  })
}


export const CREATE_NEW_BROADCAST_CHAT = ({ token, navigation, body:
  { broadcast_title, group, member }, }) => {
  return invokeApi({
    path: `api/broadcast/add_broadcast`,
    method: "POST",
    token: token,
    navigation: navigation,
    postData: { broadcast_title, group, member, }
  })
}


export const UPDATE_NEW_BROADCAST_CHAT = ({ token, navigation, chatId, body:
  { broadcast_title, group, member }, }) => {
  return invokeApi({
    path: `api/broadcast/update_broadcast/${chatId}`,
    method: "PUT",
    token: token,
    navigation: navigation,
    postData: { broadcast_title, group, member }
  })
}


export const GET_BROADCAST_MESSAGE_LIST = ({ token, navigation, chatId }) => {
  return invokeApi({
    path: `api/broadcast/list_broadcast_messages/${chatId}`,
    method: "GET",
    token: token,
    navigation: navigation,
  })
}

export const SEND_BROADCAST_MESSAGE = ({ token, navigation, body }) => {
  return invokeApi({
    path: `api/broadcast/add_broadcast_message`,
    method: "POST",
    postData: body,
    token: token,
    navigation: navigation,
  })
}

export const EDIT_SCHEDULE_BROADCAST_MESSAGE = ({ token, navigation, chatId, messageId, body }) => {
  return invokeApi({
    path: `api/broadcast/edit_broadcast_message/${chatId}/${messageId}`,
    method: "PUT",
    postData: body,
    token: token,
    navigation: navigation,
  })
}


export const DELETE_SCHEDULE_BROADCAST_MESSAGE = ({ token, navigation, chatId, messageId,  }) => {
  return invokeApi({
    path: `api/broadcast/delete_broadcast_message/${chatId}/${messageId}`,
    method: "DELETE",
    token: token,
    navigation: navigation,
  })
}

