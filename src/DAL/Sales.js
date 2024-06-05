import invokeApi from "../functions/invokeAPI";


//? Teams
export const ADD_SALE_TEAM_MEMBER = ({ token, navigation, formData }) => {
  return invokeApi({
    path: `api/sales_team/add_team_member`,
    method: "POST",
    headers: { "Content-Type": "multipart/form-data" },
    postData: formData,
    token,
    navigation,
  })
}

export const UPDATE_SALE_TEAM_MEMBER = ({ token, navigation, memberId, formData, }) => {
  return invokeApi({
    path: `api/sales_team/update_team_member/${memberId}`,
    method: "PUT",
    headers: { "Content-Type": "multipart/form-data" },
    postData: formData,
    token,
    navigation,
  })
}

export const SALE_TEAM_LIST = ({ token, navigation, page, filter }) => {
  return invokeApi({
    path: `api/sales_team/list_team_for_delegate?page=${page}&limit=20`,
    method: "POST",
    postData: filter,
    token,
    navigation,
  })
}

export const SALE_TEAM_MEMBER_COMMISSION_LIST = ({ token, navigation, page, memberId, searchText }) => {
  return invokeApi({
    path: `api/consultant/subteam_transaction_list/${memberId}?page=${page}&limit=20`,
    method: "POST",
    postData: {
      type: "credit",
      search_text: searchText
    },
    token,
    navigation,
  })
}


export const DELETE_SALE_TEAM_MEMBER = ({ token, navigation, id }) => {
  return invokeApi({
    path: `api/sales_team/delete_team_member/${id}`,
    method: "DELETE",
    token,
    navigation,
  })
}


//? Commission

export const SALE_TEAM_BY_PAID_COMMISSION = ({ token, navigation, page, searchText }) => {
  return invokeApi({
    path: `api/consultant/get_sales_team_list/with_comission?page=${page}&limit=20`,
    method: "POST",
    postData: {
      search_text: searchText,
      type: "paid",
    },
    token,
    navigation,
  })
}

export const SALE_TEAM_BY_PENDING_COMMISSION = ({ token, navigation, page, searchText }) => {
  return invokeApi({
    path: `api/consultant/get_sales_team_list/with_comission?page=${page}&limit=20`,
    method: "POST",
    postData: { search_text: searchText, type: "pending" },
    token,
    navigation,
  })
}

//* TANSACTIONS


export const SALE_TRANSACTION_LIST = ({ token, navigation, page, searchText }) => {
  return invokeApi({
    path: `api/affiliate_transaction/get/for_delegate??page=${page}&limit=20&search_text=${searchText}`,
    method: "GET",
    token,
    navigation,
  })
}

export const GET_SALES_TEAM_LIST = ({ token, navigation, searchText }) => {
  return invokeApi({
    path: `api/sales_team/list_team_for_delegate/commission?search_text=${searchText}`,
    method: "GET",
    token,
    navigation,
  })
}

export const ADD_TRANSACTION_OF_COMMISSION = ({ token, navigation, body: {
  amount, currency, method, transaction_for, transaction_note, user_id
} }) => {
  return invokeApi({
    path: `api/affiliate_transaction/`,
    method: "POST",
    postData: { amount, currency, method, transaction_for, transaction_note, user_id },
    token,
    navigation,
  })
}