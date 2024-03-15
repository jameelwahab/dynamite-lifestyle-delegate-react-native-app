
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