import invokeApi from "../functions/invokeAPI";

export const GET_PODS_LIST = ({ token, navigation,
  community_level, pod_type, search_text, page, room_type }) => {
  return invokeApi({
    path: `api/room/room_list_with/type/search/v1?page=${page}&limit=20&room_type=${room_type}`,
    method: "POST",
    postData: { community_level, pod_type, search_text, },
    token,
    navigation,
  })
}

export const GET_PODS_LIST_FOR_DELEGATE = ({ token, navigation }) => {
  return invokeApi({
    path: `api/delegates_room/list_room_for_delegate`,
    method: "GET",
    token,
    navigation,
  })
}

export const POD_ADD = ({ token, navigation, formData }) => {
  return invokeApi({
    path: `api/room/consultant`,
    method: "POST",
    headers: { "Content-Type": "multipart/form-data" },
    postData: formData,
    token,
    navigation,
  })
}

export const POD_UPDATE = ({ token, navigation, formData, slug }) => {
  return invokeApi({
    path: `api/room/consultant/${slug}`,
    method: "PUT",
    headers: { "Content-Type": "multipart/form-data" },
    postData: formData,
    token,
    navigation,
  })
}

export const POD_DELETE = ({ token, navigation,  slug }) => {
  return invokeApi({
    path: `api/room/${slug}`,
    method: "DELETE",
    token,
    navigation,
  })
}

export const POD_DELEGATE_DETAIL = ({ token, navigation, slug }) => {
  return invokeApi({
    path: `api/delegates_room/room_detail/${slug}`,
    method: "GET",
    token,
    navigation,
  })
}

export const POD_GROUPS_AND_MEMBERS = ({ token, navigation, }) => {
  return invokeApi({
    path: `api/consultant/groups_and_members/list`,
    method: "GET",
    token,
    navigation,
  })
}

export const POD_DETAIL_V1 = ({ token, navigation, slug }) => {
  return invokeApi({
    path: `api/room/detail/v1/${slug}`,
    method: "GET",
    token,
    navigation,
  })
}

export const POD_DETAIL = ({ token, navigation, slug }) => {
  return invokeApi({
    path: `api/room/detail/${slug}`,
    method: "GET",
    token,
    navigation,
  })
}

export const POD_ROOM_USER_LIST = ({ token, navigation, slug, page, type,searctText }) => {
  return invokeApi({
    path: `api/room/room_users_list/${slug}?page=${page}&limit=20&type=${type}&search_text=${searctText}`,
    method: "GET",
    token,
    navigation,
  })
}

export const EXCLUDE_ROOM_MEMBERS = ({ token, navigation,slug,type, members }) => {
  return invokeApi({
    path: `api/challenge/exclude/member`,
    method: "PUT",
    postData:{slug,type,members},
    token,
    navigation,
  })
}