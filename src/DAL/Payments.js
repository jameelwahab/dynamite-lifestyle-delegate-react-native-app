import invokeApi from "../functions/invokeAPI"



export const GET_TRANSACTIONS_LIST = ({ token, navigation, search_text, transaction_mode, page }) => {
  return invokeApi({
    path: `api/consultant/transaction/list_with_search?page=${page}&limit=20`,
    method: "POST",
    postData: { search_text, transaction_mode, },
    token,
    navigation
  })
}


export const GET_COMMISSION_LIST = ({ token, navigation,type,  page }) => {
  return invokeApi({
    path: `api/consultant/commision?page=${page}&limit=20&type=${type}`,
    method: "GET",
    token,
    navigation
  })
}
