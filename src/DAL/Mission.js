import invokeApi from "../functions/invokeAPI";

export const GET_MISSION_LIST = ({token, navigation}) => invokeApi({
    path: "api/consultant/badge_level/list",
    token: token,
    navigation: navigation,
})

export const GET_MISSION_LIST_ID = ({token, navigation, id}) => invokeApi({
    path: `api/consultant/get/missions/${id}`,
    token: token,
    navigation: navigation,
}) 


export const GET_MISSION_DETAIL = ({token, navigation, id}) => invokeApi({
    path: `api/consultant/mission/details/${id}`,
    token: token,
    navigation: navigation,
}) 

export const GET_MISSION_INFO = ({token, navigation, id}) => invokeApi({
    path: `api/feeds/delegate_portal/extra_data/get?list_type=mission&mission_id=${id}`,
    token: token,
    navigation: navigation,
}) 

