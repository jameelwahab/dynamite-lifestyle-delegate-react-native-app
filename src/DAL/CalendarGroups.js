import invokeApi from "../functions/invokeAPI";

export const GET_CALENDAR_GROUPS_LIST = ({ token, navigation, group_by, badge_levels, group_by_ids  }) => {
  return invokeApi({
    path: `api/group/consultant`,
    method: "GET",
    token,
    navigation,
		
  })
}

export const GET_CALENDAR_GROUPS_LIST_FILTER = ({ token, navigation, body, badge_levels, search, group_by, group_by_ids }) => {
  return invokeApi({
    path: `api/group/group_filter?page=0&limit=50`,
    method: "POST",
    token,
    navigation,
		postData: {
				group_by,
				badge_levels,
				search,
				group_by_ids,
		},
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

export const GET_CALENDAR_ALL_MEMBER = ({ token, navigation, slug, page, searchText, type }) => {
  return invokeApi({
    path: `api/group/all_group_members/${slug}?page=${page}&limit=20&type=${type}&search_text=${searchText}`,
    method: "GET",
    token,
    navigation,
  })
}

export const ADD_CALENDAR_GROUP = ({ token, navigation, body }) => {
  return invokeApi({
    // path: `api/group`,
    path:`api/group/add_group_v1`,
    method: "POST",
    postData: body,
    token,
    navigation,
  })
}

export const UPDATE_CALENDAR_GROUP = ({ token, navigation, slug, body }) => {
  return invokeApi({
    path: `api/group/update_group_v1/${slug}`,
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

export const EXCLUDE_GROUP_MEMBERS = ({ token, navigation, slug, type, members }) => {
  return invokeApi({
    path: `api/challenge/exclude/member`,
    method: "PUT",
    postData: { slug, type, members },
    token,
    navigation,
  })
}
