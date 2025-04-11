import { View, Text, SafeAreaView, FlatList,
		TouchableOpacity, Statusbar, StyleSheet,
		Pressable, TouchableHighlight
} from "react-native"
import Modal from 'react-native-modal'
import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import { colors } from "../../utilities/colors"
import { icons } from "../../utilities/icons"
import MyText from "../../components/MyText"
import isArray from "../../functions/isArray"
import Collapsible from 'react-native-collapsible'

const TemplateModal = forwardRef(({
		onSelect,
		list,
		user,
}, ref)=> {
		const [isVisible, setIsVisible] = useState(false);
		const [collapse, setCollapse] =useState([])
		const [item, setItem] = useState(false)
		const [tempIndex, setTempIndex] = useState(null)

		const closeModal = ()=>{
				setIsVisible(false);
				setCollapse([])
				setItem({})
		}

		const openModal = (data,i)=> {
				setIsVisible(true)
				setItem(data)
				setTempIndex(i)
		}

		useImperativeHandle(ref, () => {
				return {
						openModal
				}
		}, [])

  function hasAccessToOPtion(data, label) {
			return data?.findIndex(x=> x.label == label && x.is_access) > -1;
  }

		const menuList = ()=> {
				if(item == false) return;
				const MENU_LIST = [];
				if(user.team_type !== "sub_team"){
						MENU_LIST.push({
								title: "Edit Template Setting",
								key:"edit_template_setting",
								icon: icons.edit,
						})
						if(hasAccessToOPtion(item.page_options_access, "update_page_content"))
						{
								MENU_LIST.push({
										title:"Update Content",
										key:"update_content",
										icon: icons.edit,
								});
						}
				}

				MENU_LIST.push({
						title:"Copy main URL",
						key:"copy_main_url",
						icon:icons.copy
				})

				if (item.type_of_page == "book_a_call_page") {
						MENU_LIST.splice(5, 0, {
								title: "Copy Appointment URL",
								key:"copy_appointment_url",
								icon: icons.copy,
						});
				}

				if (user.team_type !== "sub_team") {
						if (item.type_of_page == "book_a_call_page") {
								MENU_LIST.splice(6, 0, {
										title: "Question Answers",
										key:"question_answers",
										icon: icons.eye,
								});
						}
				}
				if (hasAccessToOPtion(item.page_options_access, "thanks_page")) {
						if(!!item.thanks_page){
						let child_menu_options = [
								{
										title: "Edit Page Setting",
										icon: icons.edit,
								},
								{
										title: "Update Page Content",
										icon: icons.edit,
								},
						];

								MENU_LIST.push({
										title:"Thanks Page",
										key:"thanks_page",
										icon:icons.edit,
										isCollapse:true,
										list: child_menu_options, 
								})
						}
				}

				if(hasAccessToOPtion(item.page_options_access, "payment_page")){
						if(item.payment_page){
								let child_menu_options = [
										{
												title: "Edit Page Setting",
												icon: icons.edit,
										},
										{
												title: "Update Page Content",
												icon: icons.edit,
										},
								];

								MENU_LIST.push({
										title:"Payment Page",
										icon: icons.edit,
										isCollapse:true,
										list: child_menu_options
								})
						}
				}

				if(!item.is_template_data_imported){
						MENU_LIST.push({
								title:"Import Template Datala",
								key:"import_template_datala",
								icon: icons.edit,
						});
				}
				if(item.plan_count > 0)
				{
						MENU_LIST.push({
								title:"Set Commission",
								key:"set_commission",
								icon: icons.edit,
						})
				}
				item?.module_info?.map((module) => {
						if (module.is_access) {
								MENU_LIST.push({
										title: module.module_label_text,
										key: module.module_actual_name,
										icon: icons.edit,
						});
						}
				});

				MENU_LIST.push({
						title: "Delete",
						key:"delete",
						icon: icons.trash,
				});

				const res = item?.page_options_access?.find(x=> x?.is_access && x.label=="social_sharing_setting")
				
				if(!!res)
				{
						MENU_LIST.splice(2,0, {
								title: res.name,
								key: res.label,
								icon: icons.edit
						})
				}

				return MENU_LIST;

		}

		const renderList = (item,index) => {
				const isCollap =  item?.isCollapse
				const isCollapse =  collapse.findIndex(x=> x.index == index) > -1;

				const handlePress = () => {
						if(!isCollap){
								closeModal()
								onSelect(item,tempIndex)
						}
						else{
								if(collapse.findIndex(x=> x.index == index) > -1){
										setCollapse(collapse.filter(el=> el.index != index))
								}
								else{
										setCollapse([...collapse, {index}])
								}
						}
				}

				return (
						<>
						<TouchableHighlight
								onPress={handlePress}
								underlayColor={colors.secondary}
								style={[__styles.item_container, (isCollapse && isCollap) && {backgroundColor:colors.secondary} ]}
								>
								<View style={__styles.collapse_container}>
										<View style={{flexDirection:"row", alignItems:"center"}}>
										{item.icon()}
										<View style={{width:10}}/>
										<MyText 
												fontSize={16} 
												>{item.title}
										</MyText>
										</View>
												{isCollap && 
														(!isCollapse ? icons.downward(colors.primary):
																icons.upward(colors.primary))
												}
								</View>
						</TouchableHighlight>
						<Collapsible collapsed={!isCollapse}>
								{item?.list?.map((el,index)=>
										
								<TouchableHighlight
										onPress={()=> closeModal()}
										underlayColor={colors.secondary}
												key={index}
												style={{
														paddingVertical: 12,
														marginTop:5,
														paddingLeft:50,
														flexDirection:"row",
														alignItems:"center"
												}}>
										<>
										{el.icon()}
										<View style={{width:10}}/>
										<MyText 
												fontSize={16} 
												>{el.title}
										</MyText>
										</>
								</TouchableHighlight>)}
						 </Collapsible>
						</>
				);
		}

		return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={closeModal}
      onBackButtonPress={closeModal}
      useNativeDriverForBackdrop={true}
      animationInTiming={300}
      animationOutTiming={300}
      hideModalContentWhileAnimating={true}
      style={{ margin: 0 }}>
				<SafeAreaView style={__styles.container} >
						<View style={__styles.heading_container}>
								<MyText color={colors.primary} type="medium" fontSize={16}>
										Template Actions
								</MyText>
						<Pressable
              onPress={closeModal}
								style={{ alignSelf: "flex-end", }}>
              {icons.crosss(colors.primary)}
            </Pressable>
						</View>
						<FlatList 
								data={menuList()}
								style={{ marginTop:10 }}
								ItemSeparatorComponent={<View style={{height:5}}/>}
								showsVerticalScrollIndicator={false}
								keyExtractor={(_,index)=> index.toString()}
								renderItem={({item,index})=> renderList(item,index)}
								/>
				</SafeAreaView>
		</Modal>
		)
})

const __styles = StyleSheet.create({
		container:{
				backgroundColor: colors.secondaryVariant,
				marginTop: "auto",
				borderTopLeftRadius: 10,
				borderTopRightRadius: 10,
				maxHeight: 500 
		},
		heading_container:{
				flexDirection: "row",
				paddingTop: 15,
				paddingHorizontal: 15,
				alignItems:'center',
				justifyContent:"space-between"

		},
		item_container:{
				paddingVertical: 12,
				paddingHorizontal: 20,
		},
		collapse_container:{
				flex:1,
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "space-between"
		}
})

export default TemplateModal
