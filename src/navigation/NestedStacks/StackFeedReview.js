import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'
import routes from '../routes'
import {View} from "react-native"
import ReviewFeeds from "../../screens/ContentReview/ReviewFeeds"

const CommentReviewStack = createNativeStackNavigator()

const StackFeedReview = ({route}) => {
    return(
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }} >
	<CommentReviewStack.Navigator
	    screenOptions={{ headerShown: false }} >
	    <CommentReviewStack.Screen
		name={routes?.comentReviewSceen}
		component={ReviewFeeds}
	    />
	  
        {defaultScreens.map((x, i) => (
          <CommentReviewStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
	</CommentReviewStack.Navigator>
    </View>
    )
}

export default StackFeedReview
