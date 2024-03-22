import invokeApi from "../functions/invokeAPI"

export const GET_SALE_PAGES_LIST_FOR_SUBSCRIPTION = ({ token, navigation, }) => {
  return invokeApi({
    path: `api/sale_page/list/with_plans`,
    method: "GET",
    token: token,
    navigation: navigation,
  })
}



export const GET_SUBSCRIPTION_LIST_OF_MEMBERS = ({ token, navigation, page, filter, payment_plan, sale_page, search_text }) => {
  return invokeApi({
    path: `admin_users/subscription/list?page=${page}&limit=50`,
    method: "POST",
    postData: {
      filter, payment_plan, sale_page, search_text
    },
    token: token,
    navigation: navigation,
  })
}
