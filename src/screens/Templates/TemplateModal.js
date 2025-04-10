import { View, Text, SafeAreaView, FlatList,
		TouchableOpacity, Statusbar, StyleSheet,
		Pressable, TouchableHighlight
} from "react-native"
import Modal from 'react-native-modal'
import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react'
import { colors } from "../../utilities/colors"
import { icons } from "../../utilities/icons"
import MyText from "../../components/MyText"
import Collapsible from 'react-native-collapsible'

const TemplateModal = forwardRef(({
		onSelect,
		list,
		user,
}, ref)=> {
		const [isVisible, setIsVisible] = useState(false);
		const [collapse, setCollapse] =useState([])
		const [item, setItem] = useState({})

		const closeModal = ()=>{
				setIsVisible(false);
				setCollapse([])
				setItem({})
		}

		const openModal = (data)=> {
				setIsVisible(true)
				setItem(data)
		}

		useImperativeHandle(ref, () => {
				return {
				openModal
				}
		}, [])

		const renderList = (item,index) => {
				const isCollap =  item?.isCollapse
				const isCollapse =  collapse.findIndex(x=> x.index == index) > -1;
				const handlePress = () => {
						if(!isCollap){
								closeModal()
								onSelect(item)
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

		const menuList = ()=> {
				const MENU_LIST = [];
				if(user.team_type !== "sub_team"){
						MENU_LIST.push({
								title: "Edit Template Setting",
								key:"edit_template_setting",
								icon: icons.editpencil,
						})
						if(hasAccessToOPtion(item.page_options_access, "update_page_content"))
						{
								MENU_LIST.push({
										title:"Update Content",
										key:"update_content",
										icon: icons.editpencil,
								});
						}
				}

				MENU_LIST.push({
						title:"Copy main URL",
						key:"copy_main_url",
						icon:icons.eye
				})

				if (item.type_of_page == "book_a_call_page") {
						MENU_OPTIONS.splice(5, 0, {
								title: "Copy Appointment URL",
								key:"copy_appointment_url",
								icon: icons.eye,
						});
				}

				if (userInfo.team_type !== "sub_team") {
						if (value.type_of_page == "book_a_call_page") {
								MENU_OPTIONS.splice(6, 0, {
										label: "Question Answers",
										icon: icons.eye,
								});
						}
				}

      if (hasAccessToOPtion(item.page_options_access, "thanks_page")) {
					if(!!value.thank_page){
							MENU_LIST.push({
									title:""
							})
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
										<MyText 
												fontSize={16} 
												>{item.title}
										</MyText>
												{isCollap && 
														(!isCollapse ? icons.downward(colors.primary):
																icons.upward(colors.primary))}
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
														paddingLeft:30
												}}>
										<MyText 
												fontSize={16} 
												>{el.title}
										</MyText>
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
								data={list}
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
