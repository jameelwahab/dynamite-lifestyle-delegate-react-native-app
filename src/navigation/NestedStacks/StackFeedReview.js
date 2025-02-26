import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { defaultScreens } from './defaultScreens'
import { colors } from '../../utilities/colors'
import routes from '../routes'
import { View } from "react-native"
import ReviewFeeds from "../../screens/ContentReview/ReviewFeeds"
import Detail from '../../screens/Feed/Detail'

const CommentReviewStack = createNativeStackNavigator()

const StackFeedReview = ({ route }) => {
    return (
        <View style={{ flex: 1, backgroundColor: colors.darkSecondary }} >
            <CommentReviewStack.Navigator screenOptions={{ headerShown: false }} >
                <CommentReviewStack.Screen name={routes?.comentReviewSceen} component={ReviewFeeds} />
                <CommentReviewStack.Screen name={routes.feedDetailScreen} component={Detail} />
                {defaultScreens.map((x, i) => (
                    <CommentReviewStack.Screen key={x.name} name={x.name} component={x.component} />
                ))}
            </CommentReviewStack.Navigator>
        </View>
    )
}

export default StackFeedReview
