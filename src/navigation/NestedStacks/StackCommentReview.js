import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'
import routes from '../routes'
import {View} from "react-native"
import ReviewComments from "../../screens/ContentReview/ReviewComments"


const FeedReviewStack = createNativeStackNavigator()

const StackCommentReview = ({route}) => {
    return(
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }} >
	<FeedReviewStack.Navigator
	    screenOptions={{ headerShown: false }} >
	    <FeedReviewStack.Screen
		name={routes.feedReviewScreen}
		component={ReviewComments}	
	    />
	
        {defaultScreens.map((x, i) => (
          <FeedReviewStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
	</FeedReviewStack.Navigator>
    </View>
    )
}

export default StackCommentReview
