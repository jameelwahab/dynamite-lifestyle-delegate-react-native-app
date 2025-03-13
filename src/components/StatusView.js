import MyText from "./MyText"
import {colors} from "../utilities/colors"
import { View } from "react-native"

const StatusView = ({
		bgColor= colors.delete + "33",
		txtColor= colors.white,
		value,
})=> {
		return (
				<View style={{ backgroundColor: bgColor, paddingHorizontal: 10, paddingVertical: 2, alignSelf: "flex-start", borderRadius: 10 }}>
								<MyText type='medium' capitalize color={txtColor} >
										{value}
								</MyText>
						</View>
		);
}

export default StatusView
