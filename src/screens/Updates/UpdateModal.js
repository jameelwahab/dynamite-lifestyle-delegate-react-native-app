import Modal from 'react-native-modal'
import { View, TouchableOpacity, StyleSheet, FlatList, Pressable } from "react-native";
import { forwardRef, useState, useImperativeHandle, useRef, useEffect } from "react"
import { colors } from '../../utilities/colors'
import { fonts } from '../../utilities/fonts'
import { icons } from '../../utilities/icons'
import MyText from '../../components/MyText'



const UpdatesModal = forwardRef(({list,currIndex, onChangeIndex}, ref)=> {

		const [isVisible, setVisible] = useState(false)
		const [selectedIndex,setSelectedIndex] = useState(currIndex)

		const  openModal = ()=>{
				setVisible(true)
		}

		const closeModal= () =>{
				setVisible(false)
		}

		useEffect(()=>{
				setSelectedIndex(currIndex)
		},[currIndex])

		useImperativeHandle(ref, () => {
				return {
						openModal
				}
		}, [])

		return (
				<Modal
				isVisible={isVisible}
				onBackdropPress={closeModal}
				onBackButtonPress={closeModal}
				useNativeDriverForBackdrop={true}
				animationIn="slideInRight"
				animationOut="slideOutRight"
				animationInTiming={300}
				animationOutTiming={300}
				hideModalContentWhileAnimating={true}
				style={{ margin:0 }}
				avoidKeyboard={true}>
						<View style={__styles.modalRootView}>
								<View style={__styles.headerContainer}>
										<MyText fontSize={18} type="bold" color={colors.primary}>All Sprint list</MyText>
										<Pressable
												style={__styles.crossIcon}
												onPress={closeModal}>
												{icons.crosss(colors.white, 17)}
										</Pressable>
								</View>
								<FlatList 
										data={list}
										style={{paddingTop:15,}}
										KeyExtractor={item=> item?._id}
										renderItem={({item,index})=> 
														<TouchableOpacity
																onPress={()=>{
																		closeModal()	
																		setTimeout(()=>{
																				setSelectedIndex(index)	
																				onChangeIndex(index)
																		},100)
																}}
																style={{
																		height:50,
																		paddingLeft:10,
																		justifyContent:"center",
																		borderRadius:10,
																		backgroundColor: selectedIndex == index ? colors.primary + "20" : colors.secondaryVariant
																}}>
																<MyText>
																		{item?.title}
																</MyText>
														</TouchableOpacity>
										}
								/>
						</View>
				</Modal>
		)
})

export default UpdatesModal

const __styles = StyleSheet.create({

		modalRootView:{
				backgroundColor: colors.secondaryVariant,
				borderRadius: 15,
				paddingHorizontal: 15,
				paddingVertical:20,
				height: "94%",
				width:"75%",
				marginLeft:"auto",
				marginTop:"auto",
		},

		crossIcon:{
				backgroundColor: colors.secondary,
				height:25,
				width:25,
				borderRadius: 25/2,
				alignItems:"center",
				justifyContent:"center" 
		},
		headerContainer:{
				flexDirection:"row",
				alignItem:"center",
				justifyContent:"space-between"
		}
})

