import invokeApi from "../functions/invokeAPI"

export const WHATSAPP_CHATLIST = ({ token, navigation, page, searchText, filter }) => {
  return invokeApi({
    path: `api/whatsapp_chat/list_whatsapp_chat?chat_type=${filter}&search_text=${searchText}&page=${page}&limit=20`,
    method: "GET",
    token,
    navigation,
  })
}


export const GET_WHATSAPP_MEMBER_LIST = ({ token, navigation, searchText}) => {
  return invokeApi({
    path: `api/whatsapp_chat/member_list_delegate/whatsapp_chat`,
    method: "POST",
    postData:{search_text:searchText},
    token,
    navigation,
  })
}


export const INITIATE_WHATSAPP_CHAT = ({ token, navigation, receiver_id }) => {
  return invokeApi({
    path: `api/whatsapp_chat/initiate_chat`,
    method: "POST",
    postData: { receiver_id },
    token,
    navigation,
  })
}

export const WHATSAPP_MESSAGE_LIST = ({ token, navigation, userId }) => {
  return invokeApi({
    path: `api/whatsapp_chat/list_whatsapp_messages/${userId}`,
    method: "GET",
    token,
    navigation,
  })
}
