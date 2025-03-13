import MyImage from "./MyImage"
import MyText from "./MyText"
import {S3_URL} from "../utilities/constants"
import {View} from "react-native"

const ImgAndTxt =({img,txt}) => {
				return (
						<View style={{flexDirection:"row", alignItems:'center'}}>
								<MyImage source={{uri: S3_URL + img }} style={{width:17, height:17,marginRight:12}}/>
								<MyText>{txt}</MyText>
						</View>
				)
}

export default ImgAndTxt;
