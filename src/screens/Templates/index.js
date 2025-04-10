import RootView from "../../components/RootView"
import MyLoader from "../../components/MyLoader";
import MyText from "../../components/MyText";
import SearchView from '../../components/SearchView';
import MyRefreshControl from '../../components/MyRefreshControl'
import StatView from "../../components/StatView"
import TemplateModal from "./TemplateModal"
import { MenuButton } from '../../components/MyButton';
import FAB from '../../components/FAB'
import { colors } from "../../utilities/colors";
import { icons } from "../../utilities/icons";
import copyText from "../../functions/copyText"
import openUrl from "../../functions/openUrl"
import { useEffect, useState, useRef } from "react"
import { View, FlatList, Keyboard, StyleSheet, TouchableOpacity } from "react-native";
import { GET_TEMPLATES_LIST } from "../../DAL";
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'

const Templates = ({ navigation,route }) => {
		const [loader, setLoader] = useState(false);
		const [list,setList] = useState([])
		const { token, user } = useSelector(selectUser);
		const [searchText, setSearchText] = useState("")
		const [searching, setSearching] = useState(false);
		const [refreshing, setRefresh] = useState(false);
		const ref = useRef(null);

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

		useEffect(()=>{
				setLoader(true)
				getTemplateList()
		},[])

		const onSearch = ()=> {
				Keyboard.dismiss()
				console.log("Watashi wa Revel")
		}
		
		const onRefresh = () => {
				setRefresh(true)
				getTemplateList()
		}

		const onAddTemplate = () => {
				console.log("In a construction")
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
				const copy= () => copyText("Ano ningen", "Url copied to clipboard")
				const openLink = () => openUrl("Ano ningen")
				const handleClick = () => ref.current.openModal();

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
										value={item?.meta_title}
										/>
								<StatView 
										title={"Copy Link"}
										value={"Yoko so"}
										view={()=>linkView(icons.copy(), "Copy Url", copy)}
										/>
								<StatView 
										title={"URL"}
										view={()=>linkView(icons.gotoFill(), "Preview", openLink)}
										/>

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
								ListHeaderComponentStyle={{marginBottom:15}}
								ItemSeparatorComponent={<View style={{height:15}}/>}
								showsVerticalScrollIndicator={false}
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
								onSelect={(data)=>console.log(data)}
								list={modalList}
								user={user}
								/>
						<MyLoader enable={loader} />
				</RootView>
		)
}

const collapseList = [
		{title:"Edit Page Setting", value:"edit_page_setting"},
		{title:"Update Page Content", value:"update_page_content"}
]

const modalList = [
		{
				title: "Edit Template Setting",
				key:"edit_template",
		},
		{
				title:"Copy main URL",
				key:"copy_main_url",
		},
		{
				title: "Social Sharing Setting",
				key:"social_sharing_setting",
		},
		{
				title:"Thanks Page",
				key:"thanks_page",
				isCollapse: true,
				list: collapseList,
		},
		{
				title:"Payment Page",
				key: "payment_page",
				isCollapse: true,
				list: collapseList,
		},
		{
				title: "Set Commission",
				key: "set_commission",
		},
		{
				title:"Payment Plans",
				key:"payment_plans",
		},
		{
				title:"Strategy",
				key:"strategy",
		},
		{
				title: "Testimonial",
				key: "testimonial"
		},
		{
				title:"Venues",
				key:"venues",
		},
		{
				title: "Delete",
				key:"delete",
		}
]




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
