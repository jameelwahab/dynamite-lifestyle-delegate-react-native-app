import invokeApi from "../functions/invokeAPI";

export const GET_CALENDAR_EVENTS_LIST = ({ token, navigation, body: {
  created_for, end_date, start_date
} }) => {
  return invokeApi({
    path: `api/event/list`,
    method: "POST",
    postData: { created_for, end_date, start_date },
    token,
    navigation,
  })
}


export const GET_ALL_CALENDAR_EVENTS_LIST = ({ token, navigation }) => {
  return invokeApi({
    path: `api/event/consultant`,
    method: "GET",
    token,
    navigation,
  })
}

export const CALENDAR_EVENT_DELETE = ({ token, navigation, slug }) => {
  return invokeApi({
    path: `api/event/delete`,
    method: "POST",
    postData: slug,
    token,
    navigation,
  })
}

export const GET_GROUPS_AND_MEMBERS_FOR_CALENDAR = ({ token, navigation, searchText }) => {
  return invokeApi({
    path: `api/consultant/groups_and_members/list_for_delegate?search_text=${searchText}`,
    method: "GET",
    token,
    navigation,
  })
}


export const ADD_CALENDAR_EVENT = ({ token, navigation, body, by }) => {
  return invokeApi({
    path: `api/event/add/${by}`,
    method: "POST",
    postData: body,
    token,
    navigation,
  })
}

export const UPDATE_CALENDAR_EVENT = ({ token, navigation, slug, body, by }) => {
  return invokeApi({
    path: `api/event/update/${by}/${slug}`,
    method: "PUT",
    postData: body,
    token,
    navigation,
  })
}

export const UPDATE_CALENDAR_EVENT_ITERATION = ({ token, navigation, slug, body }) => {
  return invokeApi({
    path: `api/event/event_iteration/update/${slug}`,
    method: "PUT",
    postData: body,
    token,
    navigation,
  })
}

export const UPDATE_CALENDAR_EVENT_ITERATION_BY_MEMBER = ({ token, navigation, slug, body }) => {
  return invokeApi({
    path: `api/event/event_iteration/update/by_member/${slug}`,
    method: "PUT",
    postData: body,
    token,
    navigation,
  })
}


export const DELETE_CALENDAR_EVENT = ({ token, navigation, body: {
  event_slug, iteration_id, update_type
} }) => {
  return invokeApi({
    path: `api/event/delete`,
    method: "POST",
    postData: { event_slug, iteration_id, update_type },
    token,
    navigation,
  })
}


export const CALENDAR_EVENT_DETAIL_BY_Id = ({ token, navigation, id }) => {
  return invokeApi({
    path: `api/event/detail/id/${id}`,
    method: "GET",
    token,
    navigation,
  })
}

export const CALENDAR_EVENT_DETAIL_BY_Id_V2 = ({ token, navigation, id }) => {
  return invokeApi({
    path: `api/event/detail/${id}`,
    method: "GET",
    token,
    navigation,
  })
}


export const SYNC_GOOGLE_CALENDAR_WITH_SERVER = ({ token, navigation, googleServerCode }) => {
  return invokeApi({
    path: `app/sync_delegate_cylender`,
    method: "POST",
    postData: { code: googleServerCode },
    token,
    navigation,
  })
}

export const DESYNC_GOOGLE_CALENDAR_WITH_SERVER = ({ token, navigation, googleServerCode }) => {
  return invokeApi({
    path: `api/member/remove_google_access/remove`,
    method: "GET",
    token,
    navigation,
  })
}