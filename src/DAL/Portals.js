
import invokeApi from "../functions/invokeAPI";

export const GET_PORTAL_LIST = ({ token, navigation }) => {
  return invokeApi({
    path: `api/dynamite_event/portals/list?created_by=admin`,
    method: "GET",
    token,
    navigation,
  })
}

export const GET_PORTAL_DETAIL = ({ token, navigation, eventId }) => {
  return invokeApi({
    path: `api/dynamite_event/get_delegate_event_detail_by_id_v1/${eventId}`,
    method: "GET",
    token,
    navigation,
  })
}

export const GET_PORTAL_CHAT_LIST = ({ token, navigation, videoId }) => {
  return invokeApi({
    path: `api/dynamite_event_category_video_chat/v1/${videoId}?page=0&limit=50`,
    method: "GET",
    token,
    navigation,
  })
}

export const GET_PORTAL_CHAT_MESSAGE_LIKES = ({ token, navigation, id, page }) => {
  return invokeApi({
    path: `api/dynamite_event_category_video_chat/like/list?page=${page}&limit=20&comment_id=${id}`,
    method: "GET",
    token,
    navigation,
  })
}


export const GET_PORTAL_EXISTING_CHAT_BY_VIDEO_ID = ({ token, navigation, videoId, page }) => {
  return invokeApi({
    path: `api/dynamite_event_category_video_chat/existing_chat/list/${videoId}?page=${page}&limit=20`,
    method: "GET",
    token,
    navigation,
  })
}

export const GET_PORTAL_USER_LIST = ({ token, navigation, slug, searchText, status }) => {
  return invokeApi({
    path: `api/chat/list_of_member_for_chat_against_event/v1/${slug}?page=0&search_text=${searchText}&type=${status}`,
    method: "GET",
    token,
    navigation,
  })
}