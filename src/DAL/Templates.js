import invokeApi from "../functions/invokeAPI";

export const GET_TEMPLATES_LIST = ({token, navigation, body}) => invokeApi({
		path:"api/sale_page/get_sale_page_list_for_consultant",
		method:"GET",
		token,
		navigation,
		postData: body
}) 
