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


export const GET_COMMISSION_LIST = ({ token, navigation, type, page }) => {
  return invokeApi({
    path: `api/consultant/commision?page=${page}&limit=20&type=${type}`,
    method: "GET",
    token,
    navigation
  })
}

export const GET_PAYMENT_REQUEST_LIST = ({ token, navigation, page, sort }) => {
  return invokeApi({
    path: `api/payment_request/list/consultant?page=${page}&limit=50&payment_status=${sort}`,
    method: "GET",
    token,
    navigation
  })
}



export const GET_MEMBER_LIST_FOR_PAYMENT_REQUEST = ({ token, navigation, searchText, memberType }) => {
  return invokeApi({
    path: `api/member/members_list_for_select/delegate?include_members=${memberType}&search_text=${searchText}`,
    method: "GET",
    token,
    navigation
  })
}


export const GET_PRODUCT_LIST = ({ token, navigation }) => {
  return invokeApi({
    path: `api/product/list/consultant?page=undefined&limit=undefined`,
    method: "GET",
    token,
    navigation
  })
}


export const GET_PAYMENT_TEMPLATE_AND_PROGRAMMES_LIST = ({ token, navigation, }) => {
  return invokeApi({
    path: `api/consultant/list_main_portal_program/delegate`,
    method: "POST",
    postData: { filter_array: ['program', 'payment_template'] },
    token,
    navigation
  })
}

export const GET_TEMPLATE_DETAIL = ({ token, navigation, templateId }) => {
  return invokeApi({
    path: `api/payment_template/${templateId}`,
    method: "GET",
    token,
    navigation
  })
}



export const ADD_PAYMENT_REQUEST = ({ token, navigation, body }) => {
  return invokeApi({
    path: `api/payment_request/add`,
    method: "POST",
    postData: body,
    token,
    navigation
  })
}

export const EDIT_PAYMENT_REQUEST = ({ token, navigation, body, slug }) => {
  return invokeApi({
    path: `api/payment_request/${slug}`,
    method: "PUT",
    postData: body,
    token,
    navigation
  })
}

export const DELETE_PAYMENT_REQUEST = ({ token, navigation, slug }) => {
  return invokeApi({
    path: `api/payment_request/${slug}`,
    method: "DELETE",
    token,
    navigation
  })
}

export const GET_PAYMENT_REQUEST_DETAIL = ({ token, navigation, slug }) => {
  return invokeApi({
    path: `api/payment_request/${slug}`,
    method: "GET",
    token,
    navigation
  })
}


export const PAY_RECURRING = ({ token, navigation, body: { payment_request_slug, source_token } }) => {
  return invokeApi({
    path: `api/member/pay_now_by_consultant`,
    method: "POST",
    postData: { payment_request_slug, source_token },
    token,
    navigation
  })
}

export const CONFIRM_RECURRING_PAYMENT = ({ token, navigation, body: {
  payment_request_slug, price_id, recurring_price_id,
  subscription_id
} }) => {
  return invokeApi({
    path: `api/member/confirm_subscription_incomplete_by_consultant`,
    method: "POST",
    postData: {
      payment_request_slug,
      price_id,
      recurring_price_id,
      subscription_id
    },
    token,
    navigation
  })
}




export const GET_CLIENT_SECRET_FOR_PAY_ONETIME = ({ token, navigation, body: { payment_request_slug } }) => {
  return invokeApi({
    path: `api/member/pay_one_time_by_consultant`,
    method: "POST",
    postData: { payment_request_slug },
    token,
    navigation
  })
}

export const CHANGE_ONETIME_PAYMNET_STATUS_TO_PAID =
  ({ token, navigation, body: { payment_request_slug } }) => {
    return invokeApi({
      path: `api/member/change_one_time_payment_status_by_consultant`,
      method: "POST",
      postData: { payment_request_slug },
      token,
      navigation
    })
  }



export const GET_PAYEMENT_DETAIL =
  ({ token, navigation, requestId }) => {
    return invokeApi({
      path: `api/payment_request/payment_request_detail_for/bank_by_delegate/${requestId}`,
      method: "GET",
      token,
      navigation
    })
  }

export const BANK_PAYMENT_LINK =
  ({ token, navigation, transactionId, currency = "" }) => {
    return invokeApi({
      path: `api/payment_request/get_bank_request_url/${transactionId}?payable_currency=${currency.toUpperCase()}`,
      method: "GET",
      token,
      navigation
    })
  }

export const MARK_PAYMENT_AS_CANCELLED_OR_PAID =
  ({ token, navigation, slug, type, note }) => {
    return invokeApi({
      path: `api/payment_request/change_one_time_payment_status/paid/canceled`,
      method: "POST",
      postData: {
        payment_request_slug: slug,
        type: type,
        verification_note: !!note ? note : undefined
      },
      token,
      navigation
    })
  }

export const GET_DATE_LIST_PLAN= ({token, navigation}) => {
		return invokeApi({
				path:"api/member/get_data_list/plan",
				method:"GET",
				token, navigation
		})
}

