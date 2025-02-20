import { Image, Platform, Pressable, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native"
import { fonts } from "../utilities/fonts";
import { colors } from "../utilities/colors";
import { S3_URL } from "../utilities/constants";
import { useState } from "react";
import MyImage from "./MyImage";
import MyText from "./MyText";
import ResponsiveImage3 from "./ResponsiveImage3";

const LessonView = ({ title, style, heading, icon, desc, txtlen = 50, image, handlePress, duration }) => {
	const [show, setShow] = useState()
	return (
		<>
			{icon &&
				<View style={__styles.icon_container}>
					<Image source={{ uri: S3_URL + icon }} style={__styles.icon} />
					<Text style={[__styles.icon_heading, { marginLeft: 10 }]}>{title}</Text>
				</View>
			}
			<Pressable onPress={handlePress}>
				<View style={[__styles.container, style]} >
					<View style={{ height: 80, overflow:'hidden'}}>
						{image && 
						// <MyImage source={{ uri: S3_URL + image }} style={__styles.img} />
						<ResponsiveImage3
						width={150}
						defaultSize={{ width: 150, height: 80 }}
						style={{ width: "100%" }}
						source={{ uri: S3_URL + image }}
						/>
						}
						{duration &&
							<View style={__styles.imgTag}>
								<MyText fontSize={10} type="medium" color={colors.black} >{duration} Days</MyText>
							</View>
						}
					</View>
					<View style={__styles.sub_container}>
						<MyText style={__styles.heading}>{(show || heading.length <= 20) ? heading : `${heading.slice(0,20)}...`}</MyText>
						<View>
							<Text style={__styles.desc}>{show ? desc :`${ desc.slice(0, txtlen)}...`}</Text>
							{desc.length > txtlen &&
								<Text
									onPress={() => setShow(!show)}
									style={__styles.showText}>
									{show ? "See Less" : "See More"}
								</Text>
							}
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
	icon_heading: {
		color: colors.primary,
		fontFamily: fonts.medium,
		fontSize: 14,
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
		fontSize: 14,
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

