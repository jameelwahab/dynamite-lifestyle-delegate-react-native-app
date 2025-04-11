import RootView from "../../components/RootView";
import MyInputs from "../../components/MyInputs"
import MyImage from "../../components/MyImage"
import MyLoader from "../../components/MyLoader"
import MyText from "../../components/MyText"
import showToast from "../../functions/showToast"
import { MyButton } from "../../components/MyButton"
import { icons } from "../../utilities/icons"
import utilities from "../../utilities"
import { S3_URL } from "../../utilities/constants"
import routes from "../../navigation/routes"
import { UPDATE_SOCIAL_SETTING, UPLOAD_FILE_TO_S3 } from "../../DAL"
import ImageUploadModal from '../../components/ImageUploadModal'
import { colors } from "../../utilities/colors"
import { useState, useEffect } from "react"
import { useSelector } from 'react-redux'
import { selectUser } from '../../redux/reducers/userSlice'
import { StyleSheet, View, Pressable, TouchableOpacity } from "react-native"

const TemplateSocialSetting = ({navigation, route}) => {
		const {item}  = route.params
		const { token } = useSelector(selectUser);
		const [social, setSocial] = useState(!!item.social_sharing && item?.social_sharing!={} ? {...item?.social_sharing} : undefined)
		const [image, setImage]  = useState(undefined)
		const [loader, setLoader] = useState(false)
		const [isImageVisible,setImageModalVisibilty] = useState(false)

		const onImagePicked = (newImages) => {
				setImage(newImages)
		}

		const onSubmit = async () => {
				if(!!social?.title && !!social?.desc) {
						if(!!image?.url){
								setLoader(true)
								let fd = new FormData();
								fd.append("width", image.width);
								fd.append("image", image);
								let res = await UPLOAD_FILE_TO_S3({ token, navigation, body: fd });
								if(res.code == 200){
										setSocial({...social, icon: image_path})
										submitSocialSetting()
								} else setLoader(false)
						} 
						else submitSocialSetting() 
				}
				else {
						showToast({title:"Soical Setting missing", 
								body:"Please insert all the social settings" })
				}
		}

		const submitSocialSetting = async () => {
				setLoader(true)
				const result = await UPDATE_SOCIAL_SETTING({token, navigation,
						slug: item?.sale_page_title_slug, social_sharing: {...social}
				})
				if(result.code == 200) {
						setLoader(false)
						showToast({title:"Social sharing setting updated successfully", type:"success"})
						navigation.navigate(routes.templatesMain)
				} else setLoader(false)
		}

		return (
				<RootView title="Soical Sharing Setting">
						<MyInputs
								label="Title*"
								value={social?.title}
								onChangeText={(txt)=> setSocial({ ...social, title:txt })}
								/>
				{(!!image || !!social?.icon) && 
						<View>
								<MyImage
										source={{ uri: !!image?.uri ? image?.uri : S3_URL + social?.icon }}
										style={{ width: ((utilities.screenWidth() - 20) ), aspectRatio: 2, borderRadius: 10, marginRight: 10, overflow: "hidden", marginBottom:15 }}
								/>
								<TouchableOpacity
										onPress={() => {
												setImage(undefined)
										}}
										style={__styles.inputCrossBtn}>
												{icons.crosss(colors.black, 15)}
										</TouchableOpacity>
						</View>
				}
								<Pressable
										onPress={() => setImageModalVisibilty(true)}
										style={__styles.addPhotoView}>
										<MyText type='medium' color={colors.primary} >{!!image ? "Change" : "Add"} Photo</MyText>
										{icons.upload()}
								</Pressable>

						<MyInputs
								multiline
								label="Add Description*"
								value={social?.description}
								onChangeText={(text) => setSocial({...social, description:text})}
								/>
						<ImageUploadModal 
								closeModal={()=> setImageModalVisibilty(false)}
								isVisible={isImageVisible}
								onImagePicked={onImagePicked}
						/>
						
						<View style={{ marginTop: 10 }}>
								<MyButton
										title='Submit'
										onPress={onSubmit}
								/>
						</View>
				<MyLoader enable={loader} />
				</RootView>
		)
}

const __styles = StyleSheet.create({
		addPhotoView: {
				height: 120,
				backgroundColor: colors.lightPrimary3,
				borderRadius: 10,
				alignItems: "center",
				justifyContent: "center",
				marginBottom:10,
		},
		inputCrossBtn: {
				height: 20,
				width: 20,
				alignItems: "center",
				justifyContent: "center",
				borderRadius: 20 / 2,
				backgroundColor: colors.primary, 
				position: "absolute",
				left: 0,
				top: -8 
		},

})

export default TemplateSocialSetting 
