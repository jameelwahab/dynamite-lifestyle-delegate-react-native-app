import invokeApi from "../functions/invokeAPI";


export const SELF_IMAGE_RESPONDED_MEMBER_LIST = ({ token, navigation, page, search }) => {
  return invokeApi({
    path: `api/member/history/list?page=${page}&limit=20&search_text=${search}`,
    method: "GET",
    token,
    navigation,
  })
}

export const SELF_IMAGE_RESPONDED_MEMBER_DETAIL = ({ token, navigation, memberId }) => {
  return invokeApi({
    path: `api/member/history/detail/${memberId}`,
    method: "GET",
    token,
    navigation,
  })
}


export const SELF_IMAGE_SAVE_AND_CLOSE = ({ token, navigation, memberId,isNotify }) => {
  return invokeApi({
    path: `api/questionnaire/self_image/responded/${memberId}?is_notify_user=${isNotify}`,
    method: "GET",
    token,
    navigation,
  })
}

export const SELF_IMAGE_INCOMPLETE = ({ token, navigation, memberId }) => {
  return invokeApi({
    path: `api/questionnaire/self_image/incomplete/${memberId}`,
    method: "GET",
    token,
    navigation,
  })
}

