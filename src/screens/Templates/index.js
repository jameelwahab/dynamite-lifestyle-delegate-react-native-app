import RootView from "../../components/RootView"
import MyLoader from "../../components/MyLoader";
import MyText from "../../components/MyText";
import routes from "../../navigation/routes"
import SearchView from '../../components/SearchView';
import EmptyView from '../../components/EmptyView'
import MyRefreshControl from '../../components/MyRefreshControl'
import StatView from "../../components/StatView"
import TemplateModal from "./TemplateModal"
import { MenuButton } from '../../components/MyButton';
import FAB from '../../components/FAB'
import { colors } from "../../utilities/colors";
import { websiteBaseUrl } from "../../utilities/constants";
import { icons } from "../../utilities/icons";
import copyText from "../../functions/copyText"
import openUrl from "../../functions/openUrl"
import showToast from "../../functions/showToast"
import ConfirmationModal2 from '../../components/ConfirmationModal2';
import { useEffect, useState, useRef } from "react"
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import { View, FlatList, Keyboard, StyleSheet, TouchableOpacity } from "react-native";
import { GET_TEMPLATES_LIST,
		IMPORT_TEMPLATES_DATA,
		DELETE_TEMPLATE
} from "../../DAL";

const Templates = ({ navigation,route }) => {
		const [loader, setLoader] = useState(false);
		const [list,setList] = useState([])
		const { token, user } = useSelector(selectUser);
		const [searchText, setSearchText] = useState("")
		const [searching, setSearching] = useState(false);
		const [refreshing, setRefresh] = useState(false);
		const ref = useRef(null);
		const ref_confirmModal = useRef();

		const getTemplateList = async () =>{
				const result = await GET_TEMPLATES_LIST({token, navigation})
				if(result.code == 200){
						setLoader(false)
						setList(result.Sale_page)
						setRefresh(false)
				}else{
						setLoader(false)
						setRefresh(false)
				}
		} 

		const importData = async (sale_page_id) => {
				setLoader(true)
				const result = await IMPORT_TEMPLATES_DATA({token, navigation, sale_page_id })
				if(result.code == 200){
						getTemplateList()
				}
		}

		const deleteTemplate = async (slug)=> {
				setLoader(true)
				const result = await DELETE_TEMPLATE({token, navigation, slug})
				if(result.code == 200)
				{
						showToast({title:"Sale Page deleted successfully", type:"success"})
						getTemplateList()
				}
				else{
						setLoader(false)
				}
		}


		useEffect(()=>{
				setLoader(true)
				getTemplateList()
		},[route])

		const onSearch = ()=> {
				Keyboard.dismiss()
		}
		
		const onRefresh = () => {
				setRefresh(true)
				getTemplateList()
		}

		const onAddTemplate = () => {
				navigation.navigate(routes.templateAddEdit, {type:"add"});
		}

		const handleModulePress = ({key}, index) => {
				if(key=="edit_template_setting"){
						navigation.navigate(routes.templateAddEdit, 
								{type:"edit", item:list[index] }
						);
				}
				else if (key == "delete")
				{
						setTimeout(()=>{
								ref_confirmModal?.current?.openModal({
										title:"Are you sure you want to delete this page?",
										agreeFunc: () => deleteTemplate(list[index].sale_page_title_slug),
								})
						}, 500)
				}
				else if(key == "copy_main_url")
				{
						const url  =  user.team_tyoe == "sub_team" 
								? websiteBaseUrl + list[index].sale_page_title_slug + "/"
										+ user.affiliate_url_name 
								: websiteBaseUrl + list[index].sale_page_title_slug;
						copyText(url, "Url copied to clipboard")
				}
				else if(key == "copy_appointment_url") {
						const url  =  user.team_tyoe == "sub_team" 
								? websiteBaseUrl + list[index].sale_page_title_slug + "/appointment/"
										+ user.affiliate_url_name 
								: websiteBaseUrl + list[index].sale_page_title_slug + "/appointment";
						copyText(url, "Url copied to clipboard")
				}
				else if(key == "social_sharing_setting") {
						navigation.navigate(routes.templateSocialSetting,
								{ item: list[index] } )
				}
				else if(key=="question_answers"){
						navigation.navigate(routes.templateQuestionAnswers, 
								{ item:list[index] })
				} else if(key == "payment_plans"){
						navigation.navigate(routes.templatePaymentPlans, {item:list[index]} )
				}
		}

		const headerComponent = () => {
				return (
						<View style={{ backgroundColor: colors.darkSecondary }}>
								<SearchView
										search={searchText}
										onChangeText={(text) => setSearchText(text)}
										onSearchPress={onSearch}
										loader={searching}
								/>
						</View>
				) }


		const linkView = (icon,txt, handlePress)=> {
				return (
						<TouchableOpacity
								onPress={handlePress}
								style={{alignSelf:"flex-start", flexDirection:"row", alignItems:"center"}}>
								{icon}
								<MyText
										color={colors.primary}
										style={{fontStyle:"italic", marginLeft:10}}
										>{txt}</MyText>
						</TouchableOpacity>
						) }

		const renderList = (item,index) => {

				const url  =  user.team_tyoe == "sub_team" 
												? websiteBaseUrl + item.sale_page_title_slug + (item?.type_of_page != "sale_page" ? "/appointment" : "") + "/" + user.affiliate_url_name 
												: websiteBaseUrl + item.sale_page_title_slug + (item?.type_of_page != "sale_page" ? "/appointment" : "");

				const copy= () => copyText(url, "Url copied to clipboard")
				const openLink = () => openUrl(url)
				const handleClick = () => ref.current.openModal(item,index);


				const importView = ()=> {
						const handleImportPress =()=> ref_confirmModal?.current?.openModal({
								title:"Are you sure you want to import template data?",
								subtitle:"Importing template data will update page content and copy other modules data.",
								agreeFunc: ()=> importData(item?._id)

						})
						return (
						<TouchableOpacity
								onPress={handleImportPress}
								style={{borderColor:colors.primary, borderWidth:1,width:200, paddingVertical:10, borderRadius:10}}
								>
								<MyText
										align={"center"}
										color={colors.primary}
										>Import Template Data</MyText>
						</TouchableOpacity>
						)
				}
 
				return(
						<View style={__styles.card_container}>
								<View style={__styles.card_heading}>
										<MyText>{index + 1})</MyText>
										<MenuButton
												marginHorizontal={0}
												onPress={handleClick}
												size={20}
										/>
								</View>
								<StatView 
										title={"Title"}
										value={item?.sale_page_title}
										/>
						{item.is_template_data_imported && <> 
								<StatView 
										title={"Main URL"}
										view={()=>linkView(icons.copy(), item?.type_of_page != "sale_page" ? "Copy Appointment URL" : "Copy Main URL" , copy)}
										/> 
								<StatView 
										title={"URL"}
										view={()=>linkView(icons.gotoFill(), "Preview", openLink)}
										/>
								</>
						}
				{!item.is_template_data_imported && 
								<StatView 
										title={"URL"}
										view={importView}
										/>
				}
						</View>
				)
		}

		function hasAccessToOPtion(data, label) {
				for (let obj of data) {
						if (obj.label === label && obj.is_access) {
								return true; // If found, return true
						}
				}
				return false; // If not found, return false
		}

		return (
				<RootView 
						hideBackBottomButton 
						title={route?.params?.title || "Templates"}
						subTitle={`Total Templates: ${list?.length}`}>
						<FlatList 
								data={list}
								keyboardShouldPersistTaps="handled"
								ListHeaderComponent={headerComponent}
								ItemSeparatorComponent={<View style={{height:15}}/>}
								showsVerticalScrollIndicator={false}
								ListEmptyComponent={!loader && <EmptyView />}
								stickyHeaderHiddenOnScroll={true}
								stickyHeaderIndices={[0]}
								refreshControl={<MyRefreshControl
										refreshing={refreshing}
										onRefresh={onRefresh}
								/>}
								KeyExtractor={(_,index)=>index.toString()}
								renderItem={({item,index})=>renderList(item,index)}
						/>
						
						<FAB icon={()=>icons.plus(colors.black)} onPress={onAddTemplate} />
						<TemplateModal 
								ref={ref}
								onSelect={(data,index)=>handleModulePress(data,index)}
								user={user}
								/>
						<ConfirmationModal2
								ref={ref_confirmModal}
						/>
						<MyLoader enable={loader} />
				</RootView>
		)
}




const __styles =  StyleSheet.create({
		card_container:{
				marginTop: 10,
				backgroundColor: colors.secondary,
				padding: 10,
				borderRadius: 10 
		},
		card_heading:{
				flexDirection:"row",
				alignItems:"center",
				justifyContent:"space-between"
		}
}) 

export default Templates
