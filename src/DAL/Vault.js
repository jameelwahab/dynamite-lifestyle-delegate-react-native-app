import invokeApi from "../functions/invokeAPI";

export const GET_VAULT_LIST = ({ token, navigation, page = 0, limit = 10 }) => {
	return invokeApi({
		path: `api/delegate_recording/programs_recording/list/v1?page=${page}&limit=${limit}`,
		method: "GET",
		token,
		navigation,
	})
}
