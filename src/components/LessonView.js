import { Image, Platform, Pressable, StyleSheet, Text, TouchableWithoutFeedback, TouchableOpacity, View } from "react-native"
import { fonts } from "../utilities/fonts";
import { colors } from "../utilities/colors";
import { icons } from "../utilities/icons";
import { S3_URL } from "../utilities/constants";
import { useState } from "react";
import MyImage from "./MyImage";
import MyText from "./MyText";
import ResponsiveImage3 from "./ResponsiveImage3";
import { textSize } from "../utilities/styles"

const LessonView = ({ title, style, heading, icon,iconTextColor=colors.white, desc, txtlen = 50, hanldeCopy, copyEnable=false, image, handlePress, duration }) => {
	const [show, setShow] = useState()
	return (
		<>
			{icon &&
				<View style={__styles.icon_container}>
					<Image source={{ uri: S3_URL + icon }} style={__styles.icon} />
					<View style={{marginLeft:10}}/>
					<MyText fontSize={textSize.title} style={{letterSpacing:1}} type="bold" uppercase={true} color={iconTextColor}>{title}</MyText>
				</View>
			}
			<Pressable onPress={handlePress}>
				<View style={[__styles.container, style]} >
					<View style={{ overflow: 'hidden' }}>
						{image &&
							<Image
								style={{ width:145, height:95 }}
								source={{ uri: S3_URL + image }}
							/>}
						{duration &&
							<View style={__styles.imgTag}>
								<MyText fontSize={10} type="medium" color={colors.black} >{duration} Days</MyText>
							</View>
						}
					</View>
					<View style={__styles.sub_container}>
						<MyText numberOfLines={2} style={__styles.heading}>{heading}</MyText>
						<View>
						    <Text numberOfLines={!show ? 2 : 100} style={__styles.desc}>{desc}</Text>
						    {copyEnable && <View style={{height:5}}/>}
						    <View style={{flexDirection:'row', alignItems:'center',justifyContent:desc.length > txtlen ? "space-between" : "flex-end"}}>
							{desc.length > txtlen &&
							    <Text
								onPress={() => setShow(!show)}
								style={__styles.showText}>
								{show ? "See Less" : "See More"}
							    </Text>
							}
							{copyEnable &&
								<TouchableOpacity
								    style={{marginRight:5}}
								    onPress={hanldeCopy}
								    activeOpacity={0.5}
									>
								    {icons.copyOulined(15)}
								</TouchableOpacity>}
						    </View>
						</View>
					</View>
				</View>
			</Pressable>
		</>
	)
}

const __styles = StyleSheet.create({
	container: {
		backgroundColor: colors.secondary,
		flexDirection: 'row',
		borderRadius: 10,
		overflow: "hidden"
	},
	icon_container: {
		flexDirection: 'row',
		marginBottom: 6,
	},
	icon: {
		width: 20,
		height: 20,
	},
	img: {
		width: 140,
		height: 100,
	},
	imgTag: {
		position: "absolute",
		right: 10,
		bottom: 10,
		borderRadius: 3,
		paddingHorizontal: 10,
		paddingVertical: 2,
		backgroundColor: colors.lightText2
	},
	imgTitle: {
		fontSize: 10,
		color: "black",
	},
	sub_container: {
		flex: 1,
		padding: 4,
	},
	heading: {
		color: colors.white,
		fontFamily: fonts.bold,
		fontSize: textSize.title,
	},
	desc: {
		marginTop: 2,
		fontSize: 12,
		color: colors.lightText2,
		// opacity: 0.8,
		fontFamily: fonts.medium,
	},
	showText: {
		marginTop: 2,
		width: 80,
		color: colors.primary,
		fontFamily: fonts.medium,
		fontSize: 11,
		textDecorationLine: "underline",
		opacity: 0.8,
	}
})

export default LessonView

