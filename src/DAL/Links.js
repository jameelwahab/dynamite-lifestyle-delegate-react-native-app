import invokeApi from "../functions/invokeAPI"

export const GET_LINKS_LIST = ({ token, navigation }) => {
  return invokeApi({
    path: `api/consultant/links_listing/`,
    method: "GET",
    token: token,
    navigation: navigation,
  })
}


export const GET_LINKS_PAYMENT_PLANS_LIST = ({ token, navigation, pageId }) => {
  return invokeApi({
    path: `api/consultant/get_plans_and_commission/details/${pageId}`,
    method: "GET",
    token: token,
    navigation: navigation,
  })
}

export const GET_LINKS_SALES_TEAM_LIST = ({ token, navigation, planId, pageId }) => {
  return invokeApi({
    path: `api/consultant/get_commission/details/team`,
    method: "POST",
    postData: {
      page_id: pageId,
      plan_id: planId,
    },
    token: token,
    navigation: navigation,
  })
}


export const UPDATE_LINKS_SALES_TEAM_COMMISSION = ({ token, navigation, planId, commissionList }) => {
  return invokeApi({
    path: `api/consultant/access_sales_commission/plan`,
    method: "POST",
    postData: {
      consultant_comission: commissionList,
      plan_id: planId,
    },
    token: token,
    navigation: navigation,
  })
}
