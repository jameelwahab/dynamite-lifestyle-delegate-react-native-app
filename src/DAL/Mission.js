import invokeApi from "../functions/invokeAPI";

export const GET_MISSION_LIST = ({token, navigation}) => invokeApi({
    path: "api/consultant/badge_level/list",
    token,
    navigation,
})

export const GET_MISSION_LIST_ID = ({token, navigation, id}) => invokeApi({
    path: `api/consultant/get/missions/${id}`,
    token,
    navigation,
}) 


export const GET_MISSION_DETAIL = ({token, navigation, id}) => invokeApi({
    path: `api/consultant/mission/details/${id}`,
    token,
    navigation,
}) 

export const GET_MISSION_INFO = ({token, navigation, id, page=0, limit=20, type}) => invokeApi({
    path: `api/consultant/mission_leaderboard/get/${id}?page=${page}&limit=${limit}&type=${type}`,
    token,
    navigation,
}) 

export const GET_MISSION_SCHEDULE = ({token,navigation,id})=> invokeApi({
    path:`api/consultant/mission_schedule/details/${id}`,
    token,
    navigation,
})

export const GET_MISSION_APP_LINK = ({token , navigation, mission_id, type}) => invokeApi({
    path:"api/member/create/branch_code_v1",
    method:"POST",
    token,
    navigation,
    postData:{ type, mission_id }
})
export const GET_MISSION_MEMBER_LIST = ({token, navigation, mission_id, page=0, limit=50, body})=> invokeApi({
		path:`api/mission/members_list/v2/${mission_id}?page=${page}&limit=${limit}`,
		method:"POST",
		token,
		navigation,
		postData: body
}) 




