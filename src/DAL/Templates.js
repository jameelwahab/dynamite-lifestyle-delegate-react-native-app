import invokeApi from "../functions/invokeAPI";

export const GET_TEMPLATES_LIST = ({token, navigation}) => invokeApi({
		path:"api/sale_page/get_sale_page_list_for_consultant",
		method:"GET",
		token,
		navigation,
}) 

export const IMPORT_TEMPLATES_DATA = ({token, navigation, sale_page_id}) => 
		invokeApi({
		path:"app/import_template_data",
		method:"POST",
		token,
		navigation,
		postData:{ sale_page_id } 
}) 

export const GET_TEMPLATE_LIST = ({token, navigation })=> 
		invokeApi({
				path:"api/sale_page/template_page_for_consultant",
				method:"GET",
				token,
				navigation,
		})

export const ADD_TEMPLATE = ({ token, navigation, form })=>
		invokeApi({
				path:"api/sale_page/add/by_consultant",
				method:"POST",
				token,
				navigation,
				postData: form 
		})

export const EDIT_TEMPLATE = ({ token, navigation, form,id })=>{
		return invokeApi({
				path:`api/sale_page/${id}`,
				method:"PUT",
				token,
				navigation,
				postData: form 
		})
}

export const DELETE_TEMPLATE = ({ token, navigation, slug })=>
		invokeApi({
				path:`api/sale_page/${slug}`,
				method:"DELETE",
				token, navigation,
		})

export const UPDATE_SOCIAL_SETTING = ({ token, navigation, slug, social_sharing  })=>
		invokeApi({
				path:`api/sale_page/update_page/social_sharing/${slug}`,
				method: "PUT",
				token, navigation,
				postData: { social_sharing }
		})

export const GET_PAYMENT_LIST = ({ token, navigation, id })=>
		invokeApi({
				path:`api/payment_plan/list_payment_plan_by_sale_page/${id}`,
				method:"GET",
				token, navigation
		})

