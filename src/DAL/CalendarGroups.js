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
    path: `api/group/consultant/${slug}`,
    method: "GET",
    token,
    navigation,
  })
}

export const GET_CALENDAR_ALL_MEMBER = ({ token, navigation, slug, page,searchText }) => {
  return invokeApi({
    path: `api/group/all_group_members/${slug}?page=${page}&limit=20&search_text=${searchText}`,
    method: "GET",
    token,
    navigation,
  })
}

export const ADD_CALENDAR_GROUP = ({ token, navigation, body: {
  group_by, member, program, title, status
} }) => {
  return invokeApi({
    path: `api/group/consultant`,
    method: "POST",
    postData: { group_by, member, program, title, status },
    token,
    navigation,
  })
}

export const UPDATE_CALENDAR_GROUP = ({ token, navigation, slug, body: {
  group_by, member, program, title, status
} }) => {
  return invokeApi({
    path: `api/group/consultant/${slug}`,
    method: "PUT",
    postData: { group_by, member, program, title, status },
    token,
    navigation,
  })
}


export const DELETE_CALENDAR_GROUP = ({ token, navigation, slug }) => {
  return invokeApi({
    path: `api/group/consultant/${slug}`,
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