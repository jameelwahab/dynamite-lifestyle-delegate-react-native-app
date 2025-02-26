import { View, Text, Image, StyleSheet } from "react-native"
import { colors } from "../utilities/colors"
import numFormatter from "../functions/numFormatter"
import { S3_URL } from "../utilities/constants"
import MyText from "./MyText"
import MemberView from "./MemberView"
import { icons } from "../utilities/icons"
const Contributor = ({ num, name, img, points, user, showBadge=true, secondaryText }) => {
	const first = require("../assets/icons/1.png")
	const second = require("../assets/icons/2.png")
	const third = require("../assets/icons/3.png")


	return (
		<View style={__styles.comp_card}>
			<View style={__styles.compl_sub}>
				<View style={__styles.num_cont}>
					{(num == 1 && showBadge) ? icons.firstRank(25) :
						(num == 2 && showBadge) ? icons.secondRank(25) :
							(num == 3 && showBadge) ? icons.thirdRank(25) :
								<MyText>{num}.</MyText>}
				</View>
				<MemberView
					member={user}
					hideEmail
					subText={secondaryText}
				/>
			</View>
			<MyText>{numFormatter(points)}</MyText>
		</View>

	);
}

const __styles = StyleSheet.create({
	comp_card: {
		backgroundColor: colors.secondary,
		padding: 10,
		borderRadius: 10,
		flexDirection: "row",
		alignItems: 'center',
		justifyContent: "space-between"
	},
	compl_sub: {
		flexDirection: "row",
		alignItems: 'center'
	},
	num_cont: {
		width: 30,
		alignItems: "center"
	},
	img_cont: {
		borderRadius: 30,
		overflow: "hidden"
	},
	compl_img: {
		width: 35,
		height: 35,
	},
	svg: {
		width: 20,
		height: 20,
	}
})

export default Contributor;
