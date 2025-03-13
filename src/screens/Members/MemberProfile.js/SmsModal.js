import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import Modal from 'react-native-modal'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import MyInputs from '../../../components/MyInputs'
import { MEMBER_SMS_SYSTEM } from "../../../DAL"
import {colors} from "../../../utilities/colors"
import {icons} from "../../../utilities/icons"
import {textSize} from "../../../utilities/styles"

const SmsModal = forwardRef(({ }, ref) => {
  const [isVisible, setIsVisible] = useState(false)
  const [val, setVal] = useState("")
  const [data, setData] = useState({token:"", nav:"", to:"",})
  const [loading, setLoading] = useState(false)

  const openModal = ({token, navigation, user}) => {
			setData({token, navigation, to:user})
    setIsVisible(true)
  }
  
  const sendSMS = async () => {
			// setLoading(true)
			// const res = await MEMBER_SMS_SYSTEM({token: data.token,navigation: data.nav, msg:val, to:"+"+data.to })
			// if(res.code==200){
			// 	setLoading(false)
			// }else setLoading(false)
			//
			setData({})
			setVal("")
			closeModal()
				
	}

  const closeModal = () => {
    setIsVisible(false)
  }

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
      animationIn="zoomIn"
      animationOut="zoomOut"
      animationInTiming={300}
      animationOutTiming={300}
      avoidKeyboard={true}
      style={{ margin: 10 }}>
      <View style={__styles.container}>

				<View style={__styles.heading_container}>
						<View />
						<MyText type="bold" fontSize={textSize.heading}>SMS Message</MyText>
						<TouchableOpacity
								onPress={closeModal}
								style={__styles.cross_btn}>
								{icons.crosss(colors.primary)}
						</TouchableOpacity>
				</View>

			<MyInputs
						style={{marginTop:10,}}
						value={val}
						onChangeText={txt=> setVal(txt)}
						placeholder="Message*"
						multiline
				/>
		<TouchableOpacity
				// disabled={loading}
				style={__styles.btn_container}
				onPress={sendSMS}
			>
				<MyText
						fontSize={textSize.title} 
						color={colors.primary}
						type="semi">
								{!loading ? "Send" : "Sending"}
				</MyText>

				<View style={__styles.share_icon_container}>
						{icons.share()}
				</View>
		</TouchableOpacity>
							
				
      </View>
    </Modal>
  )
})

const __styles = StyleSheet.create({
		container:{
				padding:15,
				backgroundColor: colors.secondaryVariant,
				marginHorizontal:15, 
				borderRadius:10 
		},
		heading_container:{
				paddingBottom:20,
				flexDirection:"row",
				alignItems:'center',
				justifyContent:"space-between",
				borderBottomWidth:1,
				borderBottomColor:colors.border,

		},
		cross_btn:{
				backgroundColor:colors.lightPrimary3,
				padding:6,
				borderRadius:30
		},
		btn_container:{
				marginTop:10,
				flexDirection:"row",
				alginItems:"center",
				justifyContent:"center",
				paddingVertical:15,
				borderRadius:10,
				borderWidth:1,
				borderColor:colors.primary,
		},
		share_icon_container:{
				marginLeft:10,
				transform: [{rotate: "-45deg"}],
		}
})

export default SmsModal
