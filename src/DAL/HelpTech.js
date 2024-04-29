import invokeApi from "../functions/invokeAPI";

export const GET_TECH_CATEGORY_LIST = ({ token, navigation, }) => {
  return invokeApi({
    path: `api/help_video/list_help_videos_with_category_for_consultant_v1`,
    method: "GET",
    token,
    navigation,
  })
}
