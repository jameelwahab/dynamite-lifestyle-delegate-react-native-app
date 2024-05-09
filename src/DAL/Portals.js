
import invokeApi from "../functions/invokeAPI";

export const GET_PORTAL_LIST = ({ token, navigation, createdBy }) => {
  return invokeApi({
    path: `api/dynamite_event/portals/list?created_by=${createdBy}`,
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



export const ADD_PORTAL_EVENT = ({ token, navigation, formdata }) => {
  return invokeApi({
    path: `api/dynamite_event/`,
    method: "POST",
    headers: { "content-type": "multipart/form-data" },
    postData: formdata,
    token,
    navigation,
  })
}

export const UPDATE_PORTAL_EVENT = ({ token, navigation, formdata, eventSlug }) => {
  return invokeApi({
    path: `api/dynamite_event/${eventSlug}`,
    method: "PUT",
    headers: { "content-type": "multipart/form-data" },
    postData: formdata,
    token,
    navigation,
  })
}

export const DELETE_PORTAL_EVENT = ({ token, navigation, eventSlug }) => {
  return invokeApi({
    path: `api/dynamite_event/${eventSlug}`,
    method: "DELETE",
    token,
    navigation,
  })
}

export const DUBLICATE_PORTAL_EVENT = ({ token, navigation, eventId }) => {
  return invokeApi({
    path: `api/dynamite_event/add/dulicate/${eventId}`,
    method: "PUT",
    token,
    navigation,
  })
}

export const UPLDATE_PORTAL_LOCK_EVENT = ({ token, navigation, eventSlug, body: {
  detail_event_button_text = "", lock_event_button_link = "", lock_event_button_text = "",
  lock_event_description = "", lock_event_logo = ""
} }) => {
  return invokeApi({
    path: `api/dynamite_event/update/lock_configration/${eventSlug}`,
    method: "PUT",
    postData: {
      lock_configration: {
        detail_event_button_text,
        lock_event_button_link,
        lock_event_button_text,
        lock_event_description
        , lock_event_logo
      },
    },
    token,
    navigation,
  })
}

export const UPLDATE_PORTAL_TIMER_CONGIF = ({ token, navigation, eventSlug, body: {
  button_link, button_text, event_date, event_logo, event_time,
  is_enable, show_for, title,
} }) => {
  return invokeApi({
    path: `api/dynamite_event/update/event_timer_configration/${eventSlug}`,
    method: "PUT",
    postData: {
      event_timer_configration: {
        button_link, button_text, event_date, event_logo, event_time,
        is_enable, show_for, title,
      },
    },
    token,
    navigation,
  })
}


export const PORTAL_PROGRAM_LIST = ({ token, navigation, type }) => {
  return invokeApi({
    path: `api/consultant/list_main_portal_program/delegate`,
    postData: { filter_array: [type] },
    method: "POST",
    token,
    navigation,
  })
}

export const ASSIGN_PROGRAM_MEMBERS_TO_PORTAL = ({ token, navigation, event_id, program_id }) => {
  return invokeApi({
    path: `api/consultant/list_main_portal_program/delegate`,
    postData: { event_id, program_id },
    method: "POST",
    token,
    navigation,
  })
}


export const PORTAL_EVENT_LIST = ({ token, navigation, eventId }) => {
  return invokeApi({
    path: `api/home_event?type=event&event=${eventId}`,
    method: "GET",
    token,
    navigation,
  })
}

export const PORTAL_ADD_EVENT = ({ token, navigation, formdata }) => {
  return invokeApi({
    path: `api/home_event/`,
    method: "POST",
    headers: { "content-type": "multipart/form-data" },
    postData: formdata,
    token,
    navigation,
  })
}

export const PORTAL_UPDATE_EVENT = ({ token, navigation, eventSlug, formdata }) => {
  return invokeApi({
    path: `api/home_event/${eventSlug}`,
    headers: { "content-type": "multipart/form-data" },
    method: "PUT",
    postData: formdata,
    token,
    navigation,
  })
}
export const PORTAL_DELETE_EVENT = ({ token, navigation, eventSlug }) => {
  return invokeApi({
    path: `api/home_event/${eventSlug}`,
    method: "DELETE",
    token,
    navigation,
  })
}


export const PORTAL_MEMBER_LISTING = ({ token, navigation, eventId, searchText, page, }) => {
  return invokeApi({
    path: `api/member/get_live_dynamite_event_member_by_pagination_for_delegate/${eventId}?search_text=${searchText}&page=${page}&limit=20`,
    method: "GET",
    token,
    navigation,
  })
}


export const MEMBER_LISTING_ADDING = ({ token, navigation, eventId, searchText }) => {
  return invokeApi({
    path: `api/member/get_live_dynamite_event_another_member_for_delegate/${eventId}?search_text=${searchText}`,
    method: "GET",
    token,
    navigation,
  })
}


export const PORTAL_EVENT_ADD_MEMBER = ({ token, navigation, formdata }) => {
  return invokeApi({
    path: `api/member/add_dynamite_event_member`,
    headers: { "content-type": "multipart/form-data" },
    method: "POST",
    postData: formdata,
    token,
    navigation,
  })
}

export const PORTAL_EVENT_EDIT_MEMBER = ({ token, navigation, formdata }) => {
  return invokeApi({
    path: `api/member/edit_dynamite_event_member/`,
    headers: { "content-type": "multipart/form-data" },
    method: "PUT",
    postData: formdata,
    token,
    navigation,
  })
}

export const PORTAL_EVENT_DELETE_MEMBER = ({ token, navigation, formdata }) => {
  return invokeApi({
    path: `api/member/delete_dynamite_event_member/`,
    method: "POST",
    headers: { "content-type": "multipart/form-data" },
    postData: formdata,
    token,
    navigation,
  })
}





export const PORTAL_CATEGORY_LISTING = ({ token, navigation, eventId, }) => {
  return invokeApi({
    path: `api/dynamite_event_category/dynamite_event_category_list_by_event/${eventId}`,
    method: "GET",
    token,
    navigation,
  })
}




export const PORTAL_CATEGORY_ADD = ({ token, navigation, formdata }) => {
  return invokeApi({
    path: `api/dynamite_event_category`,
    headers: { "content-type": "multipart/form-data" },
    method: "POST",
    postData: formdata,
    token,
    navigation,
  })
}

export const PORTAL_CATEGORY_EDIT = ({ token, navigation, formdata, slug }) => {
  return invokeApi({
    path: `api/dynamite_event_category/${slug}`,
    headers: { "content-type": "multipart/form-data" },
    method: "PUT",
    postData: formdata,
    token,
    navigation,
  })
}

export const PORTAL_CATEGORY_DELETE = ({ token, navigation, slug }) => {
  return invokeApi({
    path: `api/dynamite_event_category/${slug}`,
    method: "DELETE",
    token,
    navigation,
  })
}


export const PORTAL_VIDEO_LISTING = ({ token, navigation, catId, }) => {
  return invokeApi({
    path: `api/dynamite_event_category_video/dynamite_event_category_video_list_by_category/${catId}`,
    method: "GET",
    token,
    navigation,
  })
}

export const PORTAL_VIDEO_ADD = ({ token, navigation, formdata }) => {
  return invokeApi({
    path: `api/dynamite_event_category_video/`,
    headers: { "content-type": "multipart/form-data" },
    method: "POST",
    postData: formdata,
    token,
    navigation,
  })
}

export const PORTAL_VIDEO_EDIT = ({ token, navigation, formdata, catId }) => {
  return invokeApi({
    path: `api/dynamite_event_category_video/${catId}`,
    headers: { "content-type": "multipart/form-data" },
    method: "PUT",
    postData: formdata,
    token,
    navigation,
  })
}

export const PORTAL_VIDEO_DELETE = ({ token, navigation, videoId }) => {
  return invokeApi({
    path: `api/dynamite_event_category_video/${videoId}`,
    method: "DELETE",
    token,
    navigation,
  })
}


export const PORTAL_VIDEO_DETAIL = ({ token, navigation, videoId }) => {
  return invokeApi({
    path: `api/dynamite_event_category_video/${videoId}`,
    method: "GET",
    token,
    navigation,
  })
}

export const PORTAL_VIDEO_QUESTION_CONFIG = ({ token, navigation, videoId, body: {
  module_type, question_configration
}, }) => {
  return invokeApi({
    path: `api/dynamite_event/question_configration/update/${videoId}`,
    method: "PUT",
    postData: { module_type, question_configration },
    token,
    navigation,
  })
}

export const GET_MEMBER_LIST_FOR_PERSONAL_NOTES = ({ token, navigation,searchText}) => {
  return invokeApi({
    path: `app/list_member_for_persoal_note/delegate?search_text=${searchText}`,
    method: "GET",
    token,
    navigation,
  })
}

export const ADD_PERSONAL_NOTE_FOR_PORTAL = ({ token, navigation,memberId,note}) => {
  return invokeApi({
    path: `api/member/update_personal_note`,
    method: "POST",
    postData:{
      member_id:memberId,
      personal_note:note
    },
    token,
    navigation,
  })
}