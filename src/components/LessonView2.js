import { Image, Platform, Pressable, StyleSheet, Text, TouchableWithoutFeedback, TouchableOpacity, View } from "react-native"
import { fonts } from "../utilities/fonts";
import { colors } from "../utilities/colors";
import { icons } from "../utilities/icons";
import { useState } from "react";
import MyImage from "./MyImage";
import { MenuButton } from './MyButton';
import MyText from "./MyText";
import ResponsiveImage3 from "./ResponsiveImage3";
import { main, textSize } from "../utilities/styles"
import CollapseText from "./CollapseText";
import { useSelector } from 'react-redux'
import { selectUser } from '../redux/reducers/userSlice'

const LessonView2 = ({
	title,
	style,
	heading,
	icon,
	missionDetail = false,
	desc,
	descView,
	handleClick,
	image,
	handlePress,
	duration,
	durationText,
	numberOfTitleLines = 2,
	showMenu = false,
}) => {
	const { S3_URL } = useSelector(selectUser)
	const [show, setShow] = useState()
	const [dynamicNumberOfTitleLines, setDynamicNumberOfTitleLines] = useState(1)
	return (
		<>
			{icon &&
				<View style={__styles.icon_container}>
					<MyImage source={{ uri: S3_URL + icon }} style={__styles.icon}
						resizeMode="contain" />
					<View style={{ marginLeft: 10, flex: 1 }} >
						<Text style={[main.title, { textTransform: "uppercase" }]}>{title}</Text>
					</View>
				</View>
			}
			<Pressable onPress={handlePress}>
				<View style={[__styles.container, style, !missionDetail && { backgroundColor: colors.secondary, }]} >
					<View style={{ overflow: 'hidden', position: "relative", }}>
						{image &&
							<View>
								<ResponsiveImage3

									source={{ uri: S3_URL + image }}
									// defaultSize={{ width: 150, height: 85 }}
									style={{ width: "100%" }} />
								{(duration || durationText) &&
									<View style={__styles.imgTag}>
										<MyText fontSize={10} type="medium" color={colors.black} >{durationText ? durationText : duration + " Days"}</MyText>
									</View>
								}
							</View>}
					</View>

					<View
						style={{
							width: '100%',
							// paddingHorizontal: image ? 5 : 0,
							padding: 5,
							// paddingVertical: 1,
							// flex: 1
						}}>
						<View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: showMenu ? 5 : 0, paddingRight: 5 }}>
							{!!heading &&
								<Text
									onTextLayout={({ nativeEvent: { lines } }) => {
										setDynamicNumberOfTitleLines(lines.length)
									}}
									numberOfLines={numberOfTitleLines}
									style={[main.title]}>
									{heading}
								</Text>}
							{!!showMenu && <MenuButton
								marginHorizontal={0}
								onPress={handleClick}
								size={20}
							/>}
						</View>
						{descView ? descView() :
							desc ?
								<View style={{ marginVertical: 2 }}>
									<CollapseText numOfLines={!missionDetail ? (dynamicNumberOfTitleLines > 1 ? 2 : 3) : 100} disable={missionDetail} desc={desc} style={main.miniDesc} />
								</View> : null}
					</View>
				</View>
			</Pressable>
		</>
	)
}
export default LessonView2

const __styles = StyleSheet.create({
	container: {
		// flexDirection: 'row',
		borderRadius: 10,
		overflow: "hidden"
	},
	icon_container: {
		flexDirection: 'row',
		marginBottom: 5,
	},
	icon: {
		width: 22,
		height: 22,
	},
	img: {
		width: 140,
		height: 100,
	},
	imgTag: {
		position: "absolute",
		right: 10,
		top: 10,
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



