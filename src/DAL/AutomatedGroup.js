import invokeApi from "../functions/invokeAPI";

export const GET_AUTOMATED_GROUP_LIST = ({ token, navigation, id, type }) => {
  return invokeApi({
    path: `api/group/automated_group_list/${id}?created_for=${type}`,
    method: "GET",
    token,
    navigation,
  })
}

export const ADD_AUTOMATED_GROUP = ({ token, navigation, data }) => {
  return invokeApi({
    path: `api/group/add_automated_group`,
    method: "POST",
    postData: data,
    token,
    navigation,
  })
}

export const EDIT_AUTOMATED_GROUP = ({ token, navigation, slug, data }) => {
  return invokeApi({
    path: `api/group/update_automated_group/${slug}`,
    method: "PUT",
    postData: data,
    token,
    navigation,
  })
}


export const DELETE_AUTOMATED_GROUP = ({ token, navigation, slug, }) => {
  return invokeApi({
    path: `api/group/${slug}`,
    method: "DELETE",
    token,
    navigation,
  })
}

export const GET_AUTOMATED_GROUP_DETAIL = ({ token, navigation, slug, }) => {
  return invokeApi({
    path: `api/group/detail/${slug}`,
    method: "GET",
    token,
    navigation,
  })
}


export const GET_AUTOMATED_GROUP_MEMBERS_LIST = ({ token, navigation, slug, searchText, type, page }) => {
  return invokeApi({
    path: `api/group/all_group_members/${slug}?page=${page}&limit=10&search_text=${searchText}&type=${type}`,
    method: "GET",
    token,
    navigation,
  })
}