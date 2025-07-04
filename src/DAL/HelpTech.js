import invokeApi from "../functions/invokeAPI";

export const GET_TECH_CATEGORY_LIST = ({ token, navigation,page,
  startDate = undefined, endDate = undefined, searchText="",category = undefined, departments = undefined,
}) => {
  return invokeApi({
    // path: `api/help_video/list_help_videos_with_category_for_consultant_v1`,
    // path: `api/help_video/list/for_delegate`,
    path:`api/help_video/get/for_delegate?page=${page}&limit=20`,
    method: "POST",
    postData: {
      category: category,
      departments: departments,
      start_date: startDate,
      end_date: endDate,
      search_text:searchText
    },
    token,
    navigation,
  })
}

export const GET_HELPTECH_CATEGORIES = ({ token, navigation }) => {
  return invokeApi({
    path: `api/help_video_category/list/for_delegate`,
    method: "GET",
    token,
    navigation,
  })
}


export const GET_CATEGORIES_AND_DEPARTMENT_LIST = ({ token, navigation }) => {
  return invokeApi({
    path: `app/categories_and_departments/list`,
    method: "GET",
    token,
    navigation,
  })
}
