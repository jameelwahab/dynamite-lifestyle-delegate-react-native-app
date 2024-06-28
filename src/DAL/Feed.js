import invokeApi from "../functions/invokeAPI";

export const GET_FEED_LIST =
  ({ token, navigation, level, type, page, eventId }) => {
    return invokeApi({
      path: `api/feeds/delegate_portal/listing?page=${page}&limit=10&list_type=${type}&level_or_type=${level}&event=${eventId}`,
      method: "GET",
      token,
      navigation,
    })
  }

export const GET_FEED_DETAIL =
  ({ token, navigation, feedId }) => {
    return invokeApi({
      path: `api/feeds/detail/delegate/${feedId}`,
      method: "GET",
      token,
      navigation,
    })
  }

export const GET_FEED_EXTRA_DATA =
  ({ token, navigation, level, }) => {
    return invokeApi({
      path: `api/feeds/delegate_portal/extra_data/get?list_type=${level}`,
      method: "GET",
      token,
      navigation,
    })
  }


export const GET_COMMENT_LIST =
  ({ token, navigation, body, page }) => {
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


export const FEED_ACTIONS = ({ token, navigation, formData }) => {
  return invokeApi({
    path: `api/feeds/status_action/client`,
    headers: { 'Content-Type': 'multipart/form-data' },
    method: "POST",
    postData: formData,
    token,
    navigation,
  })
}

export const UPLOAD_FEED_IMAGES = ({ token, navigation, formData }) => {
  return invokeApi({
    path: `app/feed/update_image_on_s3`,
    headers: { 'Content-Type': 'multipart/form-data' },
    method: "POST",
    postData: formData,
    token,
    navigation,
  })
}



export const CREATE_FEED = ({ token, navigation, formData }) => {
  return invokeApi({
    path: `api/feeds/delegate_portal/create`,
    headers: { 'Content-Type': 'multipart/form-data' },
    method: "POST",
    postData: formData,
    token,
    navigation,
  })
}

export const FEED_DETAIL = ({ token, navigation, feedId }) => {
  return invokeApi({
    path: `api/feeds/detail/delegate/${feedId}`,
    method: "GET",
    token,
    navigation,
  })
}

export const UPDATE_FEED = ({ token, navigation, formData, feedId }) => {
  return invokeApi({
    path: `api/feeds/update_feed_by_delegate/${feedId}`,
    headers: { 'Content-Type': 'multipart/form-data' },
    method: "PUT",
    postData: formData,
    token,
    navigation,
  })
}

export const DELETE_FEED_POST = ({ token, navigation, feedId }) => {
  return invokeApi({
    path: `api/feeds/${feedId}`,
    method: "DELETE",
    token,
    navigation,
  })
}


export const ADD_COMMENT = ({ token, navigation, body: { feed, message, parent_comment = undefined } }) => {
  return invokeApi({
    path: `api/comment/delegate`,
    method: "POST",
    postData: !!parent_comment ? { feed, message, parent_comment } : { feed, message, },
    token,
    navigation,
  })
}

export const ADD_COMMENT_V2 = ({ token, navigation, formData }) => {
  return invokeApi({
    path: `api/comment/delegate/add`,
    method: "POST",
    headers: { 'Content-Type': 'multipart/form-data' },
    postData: formData,
    token,
    navigation,
  })
}

export const EDIT_COMMENT = ({ token, navigation, formData, commentId }) => {
  return invokeApi({
    path: `api/comment/${commentId}`,
    method: "PUT",
    headers: { 'Content-Type': 'multipart/form-data' },
    postData: formData,
    token,
    navigation,
  })
}

export const EDIT_COMMENT_V2 = ({ token, navigation, formData, commentId }) => {
  return invokeApi({
    path: `api/comment/update/${commentId}`,
    method: "PUT",
    headers: { 'Content-Type': 'multipart/form-data' },
    postData: formData,
    token,
    navigation,
  })
}

export const DELETE_COMMENT = ({ token, navigation, commentId }) => {
  return invokeApi({
    path: `api/comment/${commentId}`,
    method: "DELETE",
    token,
    navigation,
  })
}


export const COMMENT_LIKE_ACTIONS = ({ token, navigation, body: {
  action, comment, feed
} }) => {
  return invokeApi({
    path: `api/feeds/delegate_portal/action`,
    method: "POST",
    postData: { action, comment, feed },
    token,
    navigation,
  })
}


export const FEED_LIKE_ACTIONS = ({ token, navigation, formdata }) => {
  return invokeApi({
    path: `api/feeds/delegate_portal/action`,
    method: "POST",
    headers: { 'Content-Type': 'multipart/form-data' },
    postData: formdata,
    token,
    navigation,
  })
}

export const GET_DELEGATES_LIST_FROM_SERVER_FOR_MENTION = ({ token, navigation, searchText }) => {
  return invokeApi({
    path: `api/feeds/delegate/list?list_type=the_cosmos&search_text=${searchText}`,
    method: "GET",
    token,
    navigation,
  })
}

export const GET_DELEGATES_LIST_FROM_SERVER_FOR_MENTION_V1 = ({ token, navigation, data: {
  community_levels = undefined,
  list_type = undefined,
  search_text = undefined,
  event_id = undefined
} }) => {
  return invokeApi({
    path: `api/feeds/delegate_or_member/list`,
    method: "POST",
    postData: { community_levels, list_type, search_text, event_id },
    token,
    navigation,
  })
}



