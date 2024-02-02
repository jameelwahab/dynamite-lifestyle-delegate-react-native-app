import { View, Text } from 'react-native'
import React from 'react'
import { create } from 'react-test-renderer'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import routes from '../routes';
import PaymentRequest from '../../screens/Payments/PaymentRequest';
import { colors } from '../../utilities/colors';
import { defaultScreens } from './defaultScreens';
import PaymentrequestDetail from '../../screens/Payments/PaymentRequest/PaymentrequestDetail';
import AddPaymentRequest from '../../screens/Payments/PaymentRequest/AddPaymentRequest';


const PaymentRequestStack = createNativeStackNavigator();
const StackPaymentsRequest = ({ route }) => {
  return (
    <View style={{ flex: 1, backgroundColor: colors.darkSecondary }}>
      <PaymentRequestStack.Navigator
        initialRouteName={routes.paymentRequestScreen}
        screenOptions={{ headerShown: false }}>
        <PaymentRequestStack.Screen initialParams={route.params}
          name={routes.paymentRequestScreen} component={PaymentRequest} />

        <PaymentRequestStack.Screen name={routes.addEditPaymenyRequestScreen} component={AddPaymentRequest} />
        <PaymentRequestStack.Screen name={routes.PaymenyRequestDetailScreen} component={PaymentrequestDetail} />

        {/*//? Default Screens Start */}
        {defaultScreens.map((x, i) => (
          <PaymentRequestStack.Screen key={x.name} name={x.name} component={x.component} />
        ))}
        {/*//? Default Screens End */}
      </PaymentRequestStack.Navigator>
    </View>
  )
}

export default StackPaymentsRequest