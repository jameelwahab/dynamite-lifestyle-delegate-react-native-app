import invokeApi from "../functions/invokeAPI";

export const GET_UPDATES_LIST = ({token, navigation, body}) => invokeApi({
		path:"api/portal_updates/list_portal_updates_for_delegate",
		method:"POST",
		token,
		navigation,
		postData: body
}) 
