import invokeApi from "../functions/invokeAPI";

export const GET_CALENDAR_GROUPS_LIST = ({ token, navigation, }) => {
  return invokeApi({
    path: `api/group/consultant`,
    method: "GET",
    token,
    navigation,
  })
}

export const GET_CALENDAR_DETAIL = ({ token, navigation, slug }) => {
  return invokeApi({
    path: `api/group/detail/${slug}`,
    method: "GET",
    token,
    navigation,
  })
}

export const GET_CALENDAR_ALL_MEMBER = ({ token, navigation, slug, page, searchText }) => {
  return invokeApi({
    path: `api/group/all_group_members/${slug}?page=${page}&limit=20&search_text=${searchText}`,
    method: "GET",
    token,
    navigation,
  })
}

export const ADD_CALENDAR_GROUP = ({ token, navigation, body }) => {
  return invokeApi({
    path: `api/group`,
    method: "POST",
    postData: body,
    token,
    navigation,
  })
}

export const UPDATE_CALENDAR_GROUP = ({ token, navigation, slug, body }) => {
  return invokeApi({
    path: `api/group/${slug}`,
    method: "PUT",
    postData: body,
    token,
    navigation,
  })
}


export const DELETE_CALENDAR_GROUP = ({ token, navigation, slug }) => {
  return invokeApi({
    path: `api/group/${slug}`,
    method: "DELETE",
    token,
    navigation,
  })
}

export const GET_MEMBERS_AND_PROGRAMMES_LIST_FOR_CALENDAR_GROUP =
  ({ token, navigation, }) => {
    return invokeApi({
      path: `api/consultant/list_main_portal_program/delegate`,
      method: "POST",
      postData: { filter_array: ['program', 'portal'] },
      token,
      navigation
    })
  }

export const GET_PROGRAMMES_EVENTS_SALEPAGES_LIST_FOR_CALENDAR_GROUP =
  ({ token, navigation, search = "", type = "", sale_page = undefined }) => {
    return invokeApi({
      path: `api/member/list_members_and_programs_v2`,
      method: "POST",
      postData: { search, type, sale_page },
      token,
      navigation
    })
  }