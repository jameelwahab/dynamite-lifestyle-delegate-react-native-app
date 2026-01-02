import invokeApi from '../functions/invokeAPI';

export const CHAT_LIST = ({
  token,
  navigation,
  body: {event_id, search_text, chat_type},
  page,
}) => {
  return invokeApi({
    path: `api/chat/list_chat_with_event_delegate/list/v1?page=${page}&limit=20`,
    method: 'POST',
    token: token,
    navigation: navigation,
    postData: {event_id, search_text, chat_type},
    isNewAPI: true,
  });
};

export const PORTAL_LIST = ({token, navigation}) => {
  return invokeApi({
    path: `api/consultant/protal_list_for_chat/delegate`,
    method: 'GET',
    token: token,
    navigation: navigation,
    isNewAPI: true,
  });
};

export const CHAT_MEMBERS_LIST = ({
  token,
  navigation,
  body: {search_text, event_id},
}) => {
  return invokeApi({
    path: `api/member/consultant_member_list_delegate/search`,
    method: 'POST',
    postData: {search_text, event_id},
    token: token,
    navigation: navigation,
    isNewAPI: true,
  });
};

export const MESSAGE_LIST_BY_CHAT_ID = ({token, navigation, chatId, page}) => {
  return invokeApi({
    path: `api/chat/list_message/${chatId}?page=${page}&limit=20`,
    method: 'GET',
    token: token,
    navigation: navigation,
    isNewAPI: true,
  });
};

export const MEMBERS_LIST = ({
  token,
  navigation,
  data: {event_id, search_text},
}) => {
  return invokeApi({
    path: `api/member/consultant_member_list_delegate/search`,
    method: 'POST',
    postData: {
      event_id,
      search_text,
    },
    token: token,
    navigation: navigation,
    isNewAPI: true,
  });
};

export const IS_CHAT_EXIST = ({token, navigation, memberId}) => {
  return invokeApi({
    path: `api/chat/check_chat_existing/${memberId}`,
    method: 'GET',
    token: token,
    navigation: navigation,
    isNewAPI: true,
  });
};

export const READ_ALL_MESSAGES = ({token, navigation, chatId}) => {
  return invokeApi({
    path: `api/chat/read_message/${chatId}`,
    method: 'GET',
    token: token,
    navigation: navigation,
    isNewAPI: true,
  });
};

export const MARK_AS_UNREAD = ({token, navigation, messageId}) => {
  return invokeApi({
    path: `api/chat/mark_as/unread/${messageId}`,
    method: 'GET',
    token: token,
    navigation: navigation,
    isNewAPI: true,
  });
};

export const ADD_AS_NOTE = ({
  token,
  navigation,
  body: {member_id, message_id},
}) => {
  return invokeApi({
    path: `api/member/add_note/from_chat`,
    method: 'POST',
    postData: {member_id, message_id},
    token: token,
    navigation: navigation,
    isNewAPI: true,
  });
};

export const UPLOAD_FILE_FOR_CHAT = ({token, navigation, file}) => {
  return invokeApi({
    path: `app/update_image_on_s3_for_chat/`,
    method: 'POST',
    headers: {'Content-Type': 'Multipart/form-data'},
    postData: file,
    token: token,
    navigation: navigation,
    isNewAPI: true,
  });
};
