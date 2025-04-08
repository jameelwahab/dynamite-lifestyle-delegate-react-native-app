import RootView from "../../components/RootView"
import MyText from "../../components/MyText"
import MyWebView from "../../components/MyWebview"
import moment from "moment"
import { dateTimeFormat } from "../../utilities/constants"
import { icons } from "../../utilities/icons"
import { fonts } from "../../utilities/fonts"
import { colors } from "../../utilities/colors"
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import {useState} from "react"

const UpdateDetail = ({ navigation, route }) => {
		const { list, index } = route.params;
		const [curr, setCurr] = useState(index)

		const titleView = () => {

				return (
						<View style={{flexDirection:"row", alignItems:'center', justifyContent:"space-between", marginRight:15, paddingBottom:5}}>
								<View style={{ }}>
								<View />
								<MyText
										fontSize={20}
										color={colors.primary}
										type="bold"
										>{list[curr]?.title}</MyText>

										<MyText style={{opacity:0.5, marginTop:5}} type="semi">
												{moment(list[curr]?.date).format(dateTimeFormat.date)}
										</MyText>
								</View>

								<View style={{flexDirection:"row", alignItems:'center', justifyContent:"center"}}>
										<TouchableOpacity
												disabled={curr <= 0}
												onPress={()=> setCurr(curr-1)}
												style={[__styles.filterButton, curr <= 0 && {opacity:0.5}]}
												hitSlop={{ bottom: 5, top: 5, left: 5, right: 5 }}>
												{icons.leftcircle(colors.primary, 30)}
										</TouchableOpacity>
										<View  style={{marginHorizontal:10}}/>
										<TouchableOpacity
												disabled = {curr == list.length-1}
												onPress={()=> setCurr(curr+1)}
												style={[__styles.filterButton, curr == list.length-1 && {opacity:0.5}]}
												hitSlop={{ bottom: 5, top: 5, left: 5, right: 5 }}>
												{icons.rightcircle(colors.primary, 30)}
										</TouchableOpacity>
								</View>
						</View>
				)
		}

		return (
				<RootView titleView={titleView}>
						<ScrollView 
								showsVerticalScrollIndicator={false}
								style={{marginBottom:20}}
						>
						<View 
								style={{paddingHorizontal:15, paddingBottom:15, marginTop:5, borderRadius:10, backgroundColor: colors.secondary }}>
										<MyWebView 
												html={list[curr]?.fixed_issues_description}
												style={__webViewStyle}
								/>
						</View>
				</ScrollView>
				</RootView>
		);
}

const __styles = StyleSheet.create({
		filterButton: {
				height: "100%",
				justifyContent: "center",
				// width: 50,
				alignItems: "center",
				flexDirection: "row",
				// borderWidth: 1,
				borderColor: colors.primary,
				borderRadius: 10,
				// paddingHorizontal: 15,
				// paddingVertical: 8
		},
})

const __webViewStyle = StyleSheet.create({

		div: {
				color: colors.white,
				fontFamily: fonts.regular,
				marginTop:5
		},
		span:{
				color: colors.white,
				fontFamily: fonts.regular,
				marginTop:5
		},
		h3:{
				color: colors.primary,
				fontSize:14,
				margin: 0,
				fontWeight: "500",
		},
		b:{
				color: colors.primary,
				fontSize:14,
				margin: 0,
				fontWeight: "500",
		},
		strong:{
				color: colors.lightText2
		},
		font:{
				color: colors.primary,
				borderColor:'white',
				borderWidth:1,
				
		}
})

export default UpdateDetail
