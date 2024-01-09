import invokeApi from "../functions/invokeAPI";

export const GET_FEED_LIST =
  ({ token, navigation, level, type }) => {
    return invokeApi({
      path: `api/feeds/delegate_portal/listing?list_type=${type}&level_or_type=${level}`,
      method: "GET",
      token,
      navigation,
    })
  }


export const GET_COMMENT_LIST =
  ({ token, navigation, body }) => {
    return invokeApi({
      path: `api/feeds/comment_by_feed/delegate?page=0&limit=50`,
      headers: { 'Content-Type': 'multipart/form-data'},
      method: "POST",
      postData: body,
      token,
      navigation,
    })
  }