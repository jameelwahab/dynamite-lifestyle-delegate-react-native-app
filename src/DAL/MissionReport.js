import invokeApi from "../functions/invokeAPI";

export const GET_MEMBER_LIST_FOR_MISSION = ({ token, navigation, search_text, type, page }) => {
  return invokeApi({
    path: `api/consultant/member/list?page=${page}&limit=20&include_members=${type}&search_text=${search_text}`,
    method: "GET",
    token: token,
    navigation: navigation,
  })
}


export const GET_MISSION_LIST_BY_MEMBER = ({ token, navigation, memberId }) => {
  return invokeApi({
    path: `api/consultant/user_completed_missions/list/${memberId}`,
    method: "GET",
    token: token,
    navigation: navigation,
  })
}


export const GET_MISSION_DETAIL_BY_ID = ({ token, navigation, missionId, memberId }) => {
  return invokeApi({
    path: `api/mission/report/for_delegate`,
    method: "POST",
    token: token,
    navigation: navigation,
    postData: {
      data: "all",
      tab: "report",
      user_id: memberId,
      mission_id: missionId
    }
  })
}