import invokeApi from "../functions/invokeAPI";

export const GET_TECH_CATEGORY_LIST = ({ token, navigation,
  startDate = undefined, endDate = undefined, categories = undefined, departments = undefined,
}) => {
  return invokeApi({
    // path: `api/help_video/list_help_videos_with_category_for_consultant_v1`,
    path: `api/help_video/list/for_delegate`,
    method: "POST",
    postData: {
      categories: categories,
      departments: departments,
      start_date: startDate,
      end_date: endDate
    },
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
