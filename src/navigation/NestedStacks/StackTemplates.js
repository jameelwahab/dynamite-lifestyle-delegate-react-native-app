import { View, Text } from "react-native";
import routes from "../routes";
import { colors } from '../../utilities/colors';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { defaultScreens } from "./defaultScreens";
import Templates from "../../screens/Templates"
import TemplateEditAdd from "../../screens/Templates/TemplateEditAdd"
import TemplateSocialSetting from "../../screens/Templates/TemplateSocialSetting"
import TemplateQuestionAnswer from "../../screens/Templates/TemplateQuestionAnswers"
import TemplateAnswerDetail from "../../screens/Templates/TemplateAnswerDetail"
import TemplatePaymentPlan from "../../screens/Templates/TemplatePaymentPlan"
import TemplateManageAccess from "../../screens/Templates/TemplateManageAccess"


const TemplatesStack  = createNativeStackNavigator();

const StackTemplates = ({ route }) => {
		return (
				<View style={{flex:1, backgroundColor: colors.darkSecondary }}>
						<TemplatesStack.Navigator 
								screenOptions={{headerShown: false}}>
								<TemplatesStack.Screen
										name={routes.templatesMain}
								 		component={Templates}
								 		initialParams={route.params}
								 		/>
								<TemplatesStack.Screen
										name={routes.templateAddEdit}
								 		component={TemplateEditAdd}
								 		initialParams={route.params}
								 		/>
								<TemplatesStack.Screen
										name={routes.templateSocialSetting}
								 		component={TemplateSocialSetting}
								 		initialParams={route.params}
								 		/>
								<TemplatesStack.Screen
										name={routes.templateQuestionAnswers}
								 		component={TemplateQuestionAnswer}
								 		initialParams={route.params}
								 		/>
								<TemplatesStack.Screen
										name={routes.templateAnswersDetails}
								 		component={TemplateAnswerDetail}
								 		initialParams={route.params}
								 		/>
								<TemplatesStack.Screen
										name={routes.templatePaymentPlans}
								 		component={TemplatePaymentPlan}
								 		initialParams={route.params}
								 		/>
								<TemplatesStack.Screen
										name={routes.templatePaymentManagePlan}
								 		component={TemplateManageAccess}
								 		initialParams={route.params}
								 		/>


								{defaultScreens.map((x, i) => (
										<TemplatesStack.Screen key={x.name} name={x.name} component={x.component} />
								))}

						</TemplatesStack.Navigator>
				</View>
		)
}

export default StackTemplates;
