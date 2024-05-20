import invokeApi from "../functions/invokeAPI";

export const GET_NOTIFICATION_LIST = ({ token, navigation, page }) => {
  return invokeApi({
    path: `api/feeds/notification_list_with_pagination/delegate?page=${page}&limit=20`,
    method: "GET",
    token,
    navigation,
  })
}

export const MARK_NOTIFICATION_AS_READ = ({ token, navigation, id }) => {
  return invokeApi({
    path: `api/feeds/read_notification_by_id/delegate/${id}`,
    method: "GET",
    token,
    navigation,
  })
}

export const MARK_ALL_NOTIFICATION_AS_READ = ({ token, navigation }) => {
  return invokeApi({
    path: `api/feeds/read_all_notification/delegate`,
    method: "GET",
    token,
    navigation,
  })
}

export const DELETE_SINGAL_NOTIFICATION= ({ token, navigation, id }) => {
  return invokeApi({
    path: `api/member/delete_member_notification/${id}`,
    method: "DELETE",
    token,
    navigation,
  })
}

export const DELETE_ALL_NOTIFICATION  = ({ token, navigation, }) => {
  return invokeApi({
    path: `api/member/delete_member_notification/all`,
    method: "DELETE",
    token,
    navigation,
  })
}
