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

