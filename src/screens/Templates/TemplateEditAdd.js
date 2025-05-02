import RootView from "../../components/RootView";
import MyInputs from "../../components/MyInputs";
import MyLoader from "../../components/MyLoader";
import showToast from "../../functions/showToast";
import routes from "../../navigation/routes"
import OptionModalWithSearch from "../../components/OptionModalWithSearch";
import MyTouchableInput from "../../components/MyTouchableInput";
import { MyButton, MyClearButton } from "../../components/MyButton";
import { GET_TEMPLATE_LIST, ADD_TEMPLATE, EDIT_TEMPLATE } from "../../DAL";
import { useState, useEffect } from "react"
import { View } from "react-native"
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'

const TemplateEditAdd = ({navigation, route}) => {
		const { type, item } = route?.params
		const [template, setTemplate] = useState(item || {})
		const { token } = useSelector(selectUser);
		const [list, setList] = useState([])
		const [isVisible, setIsVisible] = useState(false);
		const [loader, setLoader] = useState(false);
		const [tempTxt, setTempTxt] = useState(item?.page_alias_url || "")
		const getTemplateList = async () => {
				const result = await GET_TEMPLATE_LIST({ token, navigation })
				setLoader(false)
				if(result.code){
						setList(result.Sale_page)
				}
		}

		useEffect(()=>{
				if(type=="add")
				{
						setLoader(true)
						getTemplateList()
				}
		},[])

		const filterTheList = (list, text) => {
				if (text.trim() == "") {
						return list
				} else {
						return list.slice().filter(x => 
								x.meta_title.toLowerCase().includes(text.toLowerCase().trim()))
				}
		}

		const onSubmit = async () => {
				const formData = new FormData();	
				if (template?.page_alias_url == undefined || template?.page_alias_url == "") {
						showToast({title:"Alert", body:"Page Alias Text is required"});
						return;
				}
				formData.append("meta_title", template.meta_title);
				formData.append(
								"page_alias_url",
						!!template.page_alias_url ? template.page_alias_url : ""
				);
				formData.append("meta_description", template.meta_description);
				formData.append("payment_mode", template.payment_mode);
				formData.append("meta_keywords", template.meta_keywords);
				formData.append("pixel_code_header", template.pixel_code_header);
				formData.append(
"google_tracking_code_header",
						template.google_tracking_code_header
				);
				formData.append(
"google_tracking_code_body",
						template.google_tracking_code_body
				);
				formData.append(
"is_password_auto_generated",
						template.is_password_auto_generated
				);
				formData.append(
"is_email_send",
						template.is_password_auto_generated ? template.is_email_send : false
				);
				if (template.redirect_user == "other_link") {
						formData.append("custom_link", template.custom_link);
				}
				formData.append("website_portal_css_code", template.website_portal_css_code);
				formData.append("website_portal_js_code", template.website_portal_js_code);
				formData.append("pixel_code_body", template.pixel_code_body);
				formData.append("active_campaign_list_id", template.active_campaign_list_id);
				formData.append("active_campaign_tag_id", template.active_campaign_tag_id);
				formData.append("redirect_user", template.redirect_user);
				if (template.type_of_page == "book_a_call_page") {
						formData.append("booking_tracking", template.booking_tracking);
						formData.append("is_paid", template.is_paid);
						formData.append("book_a_call_custom_url", template.book_a_call_custom_url);
						formData.append("book_a_call_type", template.book_a_call_type);
				}
				formData.append(
"is_publically_accessible",
						template.is_publically_accessible
				);
				formData.append("sale_page_title", template.sale_page_title);
				formData.append("thankyou_page_content", template.thankyou_page_content);
				formData.append("is_general_brand_logo", template.is_general_brand_logo);
				formData.append("is_general_social_links", template.is_general_social_links);
				formData.append("is_default_commission", template.is_default_commission);
				if (template.is_default_commission) {
						formData.append(
"default_commission_percentage",
								template.default_commission_percentage
						);
				}
				formData.append(
"header_menu",
						template.header_menu == undefined ? "" : template.header_menu
				);
				formData.append(
"footer_menu",
						template.footer_menu == undefined ? "" : template.footer_menu
				);
		if (template.type_of_page == "sale_page") {
						formData.append(
"thanks_template",
								template.thanks_template ? template.thanks_template : ""
						);
						formData.append(
"payment_template",
								template.payment_template ? template.payment_template : ""
						);
				}
				if (type == "add") {
						formData.append("template", template.template);
				}
				if (template.is_general_social_links == false) {
						formData.append("facebook_link", template.facebook_link);
						formData.append("pinterest_link", template.pinterest_link);
						formData.append("youtube_link", template.youtube_link);
						formData.append("instagram_link", template.instagram_link);
						formData.append("mailbox_link", template.mailbox_link);
						formData.append("snap_chat_link", template.snap_chat_link);
						formData.append("twitter_link", template.twitter_link);
						formData.append("linkedin_link", template.linkedin_link);
						formData.append("tiktok_link", template.tiktok_link);
				}

				let result;
				if(type == "add"){
						setLoader(true)
						result = await ADD_TEMPLATE({ token, navigation, form: formData})
				}
				else if(type == "edit"){
						setLoader(true)
						result = await EDIT_TEMPLATE({ token, navigation, 
								form:formData, id: template.sale_page_title_slug })
				}
				if(result?.code==200){
						navigation.navigate(routes.templatesMain)
						setLoader(false)
				} else setLoader(false)
		}

		return (
				<RootView 
						title={type=="edit" ? "Edit Template" : "Add Template"}
						>
				{type=="add" && <MyTouchableInput 
								label="Choose Template*"
								value={tempTxt}
								onPress={()=>setIsVisible(true)}
								/> }
						<MyInputs
								label="Page Title*"
								value={template?.sale_page_title}
								onChangeText={(txt)=> setTemplate({ ...template, sale_page_title:txt })}
								/>

						<MyInputs
								label="Page Alias Title*"
								value={template?.page_alias_url}
								onChangeText={txt=> setTemplate({ ...template, page_alias_url:txt })}
								/>

						<MyInputs
								label="Meta Title*"
								value={template?.meta_title}
								onChangeText={txt=> setTemplate({ ...template, meta_title:txt })}
								/>
						<MyInputs
								label="Meta Keyword*"
								value={template?.meta_keywords}
								onChangeText={txt=> setTemplate({ ...template, meta_keywords:txt })}
								/>

						
						<View style={{ marginTop: 10 }}>
								<MyButton
										title='Submit'
										onPress={onSubmit}
								/>
						</View>

						<OptionModalWithSearch 
								isVisible={isVisible}
								closeModal={()=> setIsVisible(false)}
								title="Choose a template"
								titleKey="page_alias_url"
								optionList={list}
								filterTheList={filterTheList}
								onSelected={(data)=>{
										setIsVisible(false)
										setTemplate(data)
										setTempTxt(data.page_alias_url)
								}}
								/>
						<MyLoader enable={loader}/>
				</RootView>
		);
}

export default TemplateEditAdd;
