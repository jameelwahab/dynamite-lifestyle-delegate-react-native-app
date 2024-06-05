import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import { selectNavbar } from '../../../redux/reducers/navbarSlice'
import { ADD_TRANSACTION_OF_COMMISSION, GET_SALES_TEAM_LIST } from '../../../DAL'
import MyTouchableInput from '../../../components/MyTouchableInput'
import MyInputs from '../../../components/MyInputs'
import { MyButton } from '../../../components/MyButton'
import MyKeyboardAvoidingView from '../../../components/MyKeyboardAvoidingView'
import OptionModal from '../../../components/OptionModal'
import OptionModalWithSearch from '../../../components/OptionModalWithSearch'
import Collapsible from 'react-native-collapsible'
import showToast from '../../../functions/showToast'
import routes from '../../../navigation/routes'
import MyLoader from '../../../components/MyLoader'

const TransactionAddEdit = ({ navigation, route }) => {
  const { token } = useSelector(selectUser);
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [isCurrencyModalShown, setCurrencyModalShown] = useState(false);
  const [isSalesTeamModalShown, setSalesTeamModalShown] = useState(false)
  const [payouts, updatePayouts] = useState({
    member: null,
    payAmount: "0",
    currency: "gbp",
    method: "cash",
    note: "",
  })
  const setPayouts = (update) => updatePayouts((old) => ({ ...old, ...update }))

  useEffect(() => {
    getSalesTeam("")
  }, [])


  //! //////// API

  const onSubmitButtonPress = () => {
    if (!!payouts?.member == false) {
      showToast({ body: "Please select your sales team member", title: "Alert", type: "info" })
    } else if (payouts?.payAmount <= 0) {
      showToast({ body: "Payable amount must be greater than 0", title: "Alert", type: "info" })
    } else if (payouts?.member?.commission_due <= 0) {
      showToast({ body: "Net Remaining amount must be greater than 0", title: "Alert", type: "info" })
    } else {
      addTransactionToServer()
    }
  }

  const addTransactionToServer = async () => {
    setLoader(true)
    let res = await ADD_TRANSACTION_OF_COMMISSION({
      token, navigation, body: {
        amount: payouts?.payAmount,
        currency: payouts?.currency,
        method: payouts?.method,
        transaction_for: "sub_delegates",
        transaction_note: payouts?.note,
        user_id: !!payouts?.member ? payouts?.member?._id : ""
      }
    });
    if (res.code == 200) {
      navigation.navigate(routes?.salesTeamTransactionsListingScreen, { refresh: true });
      setLoader(false);
    } else {
      setLoader(false);
    }
  }

  const getSalesTeam = async (searchText) => {
    setLoader(true)
    let res = await GET_SALES_TEAM_LIST({ token, navigation, searchText: searchText.trim() });
    if (res.code == 200) {
      setList(res?.sales_team)
      setLoader(false);
    } else {
      setLoader(false);
    }
  }

  return (
    <RootView title={"Add Commission Payouts "}>
      <View style={{ flex: 1 }}>
        <MyKeyboardAvoidingView>
          <MyTouchableInput
            label='Select Sales Team*'
            onPress={() => setSalesTeamModalShown(true)}
            value={!!payouts?.member ?
              payouts?.member?.first_name + " " + payouts?.member?.last_name + " (" + payouts?.member?.email + ")" :
              ""
            }
            clearbutton={!!payouts?.member}
            onClearButtonPress={() => setPayouts({ member: null })}
          />

          <Collapsible collapsed={!payouts?.member}>
            <MyInputs
              label='Net Remaining*'
              value={String(payouts?.member?.commission_due)}
              editable={false}
            />
          </Collapsible>

          <MyInputs
            label='Payable Amount*'
            value={payouts?.payAmount}
            onChangeText={(text) => setPayouts({ payAmount: text })}
          />

          <MyTouchableInput
            label='Plan Currency*'
            value={currencyName[payouts?.currency]}
            onPress={() => setCurrencyModalShown(true)}
          />

          <View opacity={0.6}>
            <MyTouchableInput
              label='Payment Method*'
              value={payouts?.method}
            />
          </View>

          <MyInputs
            label='Transaction Note'
            multiline
            value={payouts?.note}
            onChangeText={(text) => setPayouts({ note: text })}
          />

          <MyButton
            title='Submit'
            onPress={onSubmitButtonPress}
          />
        </MyKeyboardAvoidingView>
      </View>

      <MyLoader enable={loader} />

      <OptionModalWithSearch
        isVisible={isSalesTeamModalShown}
        optionList={list}
        closeModal={() => setSalesTeamModalShown(false)}
        noIcon
        title='Sales Team'
        onSelected={(opt) => {
          console.log(opt, "onSelected")
          setPayouts({ member: opt })
          setSalesTeamModalShown(false)
        }}
        onSearchTextChange={(text) => getSalesTeam(text)}
        renderText={({ item }) =>
          <MyText fontSize={16}>{item?.first_name + " " + item?.last_name + " (" + item?.email + ")"}</MyText>
        }
      />

      <OptionModal
        isVisible={isCurrencyModalShown}
        optionList={currency_list}
        checkSelected={(opt) => payouts?.currency == opt}
        closeModal={() => setCurrencyModalShown(false)}
        noIcon
        onSelected={(opt) => {
          setPayouts({ currency: opt?.key })
          setCurrencyModalShown(false)
        }}
      />
    </RootView>
  )
}

export default TransactionAddEdit

const currency_list = [
  {
    title: "Dollar",
    key: "usd"
  },
  {
    title: "UK Pounds",
    key: "gbp"
  },
  {
    title: "Euro",
    key: "eur"
  }
]
const currencyName = {
  "usd": "Dollar",
  "gbp": "UK Pounds",
  "eur": "Euro",
}