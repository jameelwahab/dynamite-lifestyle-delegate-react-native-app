import invokeApi from "../functions/invokeAPI";

export const GET_FEED_LIST =
  ({ token, navigation, level, type, page }) => {
    return invokeApi({
      path: `api/feeds/delegate_portal/listing?page=${page}&limit=10&list_type=${type}&level_or_type=${level}`,
      method: "GET",
      token,
      navigation,
    })
  }


export const GET_COMMENT_LIST =
  ({ token, navigation, body,page }) => {
    return invokeApi({
      path: `api/feeds/comment_by_feed/delegate?page=${page}&limit=15`,
      headers: { 'Content-Type': 'multipart/form-data' },
      method: "POST",
      postData: body,
      token,
      navigation,
    })
  }


export const GET_LIKE_LIST =
  ({ token, navigation, body, page }) => {
    return invokeApi({
      path: `api/feeds/feed_activity_detail/delegate?page=${page}&limit=15`,
      headers: { 'Content-Type': 'multipart/form-data' },
      method: "POST",
      postData: body,
      token,
      navigation,
    })
  }


export const GET_COMMENT_LIKES_LIST =
  ({ token, navigation, body, page }) => {
    return invokeApi({
      path: `api/feeds/list_comment_by_action_with_pagination/delegate?page=${page}&limit=15`,
      headers: { 'Content-Type': 'multipart/form-data' },
      method: "POST",
      postData: body,
      token,
      navigation,
    })
  }