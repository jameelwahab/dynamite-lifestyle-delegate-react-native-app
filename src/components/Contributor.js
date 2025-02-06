import {View, Text, Image, StyleSheet} from "react-native"
import {colors} from "../utilities/colors"
import numFormatter from "../functions/numFormatter"
import {S3_URL} from "../utilities/constants"
const Contributor = ({num, name, img, points})=>{
    // 1200   120200 120 500
    const count = points < 1000 ? points : `${points/1000}k`
    const first = require("../assets/icons/1.png")
    const second = require("../assets/icons/2.png")
    const third = require("../assets/icons/3.png")
    return (
	<View style={__styles.comp_card}>
	    <View style={__styles.compl_sub}>
		<View style={__styles.num_cont}>
		{num > 3 ? 
		    <Text style={{color:"white"}}>{num}.</Text> :
		    <Image 
			style={__styles.svg} 
			source={num==1 && first || num==2 && second || third}
		    />
		}
		</View>
		<View style={__styles.img_cont}>
		    <Image 
			source={img ? ({uri: S3_URL + img}) : require("../assets/icons/dummy-user.png")}
			style={__styles.compl_img}
			/>
		</View>
		<View style={{width:10}}/>
		<Text style={{color:"white"}}>{name}</Text>
	    </View>
	    <Text style={{color:"white"}}>{count}</Text>
	</View>

    );
}

const __styles = StyleSheet.create({
    comp_card:{
	backgroundColor:colors.secondary,
	padding:10,
	borderRadius:10,
	flexDirection:"row",
	alignItems:'center',
	justifyContent:"space-between"
    },
    compl_sub:{
	flexDirection:"row",
	alignItems:'center'
    },
    num_cont:{
	width:30,
	alignItems:"center"
    },
    img_cont:{
	borderRadius:30,
	overflow:"hidden"
    },
    compl_img:{
	width:35,
	height:35,
    },
    svg:{
	width:20,
	height:20,
    }
})

export default Contributor;
