import { Image, Platform, Pressable, StyleSheet, Text, TouchableWithoutFeedback, TouchableOpacity, View } from "react-native"
import { fonts } from "../utilities/fonts";
import { colors } from "../utilities/colors";
import { icons } from "../utilities/icons";
import { S3_URL } from "../utilities/constants";
import { useState } from "react";
import MyImage from "./MyImage";
import MyText from "./MyText";
import ResponsiveImage3 from "./ResponsiveImage3";
import { main, textSize } from "../utilities/styles"
import CollapseText from "./CollapseText";

const LessonView = ({ title, style, heading, icon, iconTextColor = colors.white, missionDetail=false, desc, txtlen = 50, hanldeCopy, copyEnable = false, image, handlePress, duration,
	numberOfTitleLines = 2
}) => {
	const [show, setShow] = useState()
	const [dynamicNumberOfTitleLines, setDynamicNumberOfTitleLines] = useState(1)
	return (
	    <>
	    {icon &&
		<View style={__styles.icon_container}>
		    <MyImage source={{ uri: S3_URL + icon }} style={__styles.icon}
			resizeMode="contain" />
		    <View style={{ marginLeft: 10,flex:1 }} >
			<Text style={[main.title,{textTransform:"uppercase"}]}>{title}</Text>
		    </View>
		</View>
	    }
	    <Pressable onPress={handlePress}>
		<View style={[__styles.container, style, !missionDetail && {backgroundColor: colors.secondary,} ]} >
		    <View style={{ overflow: 'hidden' }}>
			{image &&
			    <ResponsiveImage3
				width={150}
				source={{uri: S3_URL +image }}
				defaultSize={{ width: 150, height: 85 }}
				style={{ width: "100%" }} />}
			{copyEnable &&
			    <View style={{
				alignItems: "flex-end", justifyContent: "flex-end",
				position:"absolute",
				left:3,
				top:3 }}>
				<TouchableOpacity
				    style={{ backgroundColor: colors.secondarySelect+"88", padding: 5, borderRadius: 999 }}
				    onPress={hanldeCopy}
				    activeOpacity={0.5}
				    >
				    {icons.copy(colors.primary,15)}
				</TouchableOpacity>
			    </View>
			}
			{duration &&
			    <View style={__styles.imgTag}>
				<MyText fontSize={10} type="medium" color={colors.black} >{duration} Days</MyText>
			    </View>
			}
		</View>
		<View
		    style={{
			width: '100%',
		        paddingHorizontal: 5,
			 paddingVertical: 1,
			flex: 1
		    }}>
		    {!!heading &&
			<Text
			    onTextLayout={({ nativeEvent: { lines } }) => {
			    setDynamicNumberOfTitleLines(lines.length)
			}}
			numberOfLines={numberOfTitleLines}
			style={[main.title]}>
			    {heading}
			</Text>
		    }
		<View style={{ marginVertical: 2 }}>
		    <CollapseText numOfLines={!missionDetail && (dynamicNumberOfTitleLines > 1 ? 2 : 3) } disable={missionDetail} desc={desc} style={main.miniDesc} />
		</View>
	    </View>
	    </View>
	    </Pressable>
	    </>
	)
}

const __styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
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

