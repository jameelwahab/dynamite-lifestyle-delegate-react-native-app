import invokeApi from "../functions/invokeAPI"

export const GET_GROUP_LIST = ({token, navigation }) => 
		invokeApi({
				path:"api/group/list/get",
				token, navigation,
})
