import { View, Text, Pressable, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { icons } from '../../../utilities/icons'
import MyInputs from '../../../components/MyInputs'
import getCurrecncyName from '../../../functions/getCurrecncyName'
import Editor from '../../../components/Editor'
import { MyButton } from '../../../components/MyButton'
import { colors } from '../../../utilities/colors'
import { MARK_PAYMENT_AS_CANCELLED_OR_PAID } from '../../../DAL'
import showToast from '../../../functions/showToast'
import MyLoader from '../../../components/MyLoader'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import moment from 'moment'

const MarkAsPaid = ({ navigation, route }) => {
  const { data, changeStatus } = route?.params;
  const { token } = useSelector(selectUser);
  const [editorValue, setEditorValue] = useState("")
  const [loader, setLoader] = useState(false);

  const markPayemntCancelOrPaid = async (item, type, note = undefined) => {
    setLoader(true)
    let res = await MARK_PAYMENT_AS_CANCELLED_OR_PAID({
      navigation, token, slug: item?.payment_request_slug,
      type, note
    })
    if (res.code == 200) {
      changeStatus("paid", item)
      showToast({ "body": res?.message, type: "success" })
      navigation.goBack()
      setLoader(false)
    } else {
      setLoader(false)

    }
  }

  const onSubmit = () => {
    if (editorValue.trim() == "") {
      showToast({ body: "Transaction note is not allowed to be empty", type: "error" })
    } else {
      markPayemntCancelOrPaid(data, "paid", editorValue)
    }
  }
  return (
    <RootView title={data?.request_title} >
      <KeyboardAwareScrollView>
        <View>
          <View>
            <MyInputs
              editable={false}
              label='Member'
              value={data?.member?.first_name + " " + data?.member?.last_name}
            />
          </View>

          <View>
            <MyInputs
              label='Total Amount'
              editable={false}
              value={String(data?.total_amount)}
            />
          </View>

          <View>
            <MyInputs
              label='Currency'
              editable={false}
              value={getCurrecncyName(data?.currency)}
            />
          </View>

          <View style={{}}>
            <Editor
              label='Transaction Note *'
              initialValue={editorValue}
              onChange={(text) => setEditorValue(text)}
              height={150}
              backgroundColor={colors.secondaryVariant}
            />
          </View>

          <View style={__styles.btnView}>
            <MyButton
              title='Submit'
              invert
              style={{ paddingHorizontal: 10 }}
              onPress={onSubmit}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
      <MyLoader enable={loader} />
    </RootView>
  )
}

export default MarkAsPaid

const __styles = StyleSheet.create({
  rootView: {
    backgroundColor: colors.secondary,
    borderRadius: 10,
    flex: 1
  },
  innerView: {
    paddingHorizontal: 15,
    paddingVertical: 20
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: colors.white + "55",
    paddingBottom: 10,
    marginBottom: 10
  },
  checkboxView: {
    flexDirection: "row"
  },
  btnView: { alignItems: "flex-end", marginTop: 20 }
})