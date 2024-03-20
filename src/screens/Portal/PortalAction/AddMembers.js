import { View, Text, StyleSheet, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import MyTouchableInput from '../../../components/MyTouchableInput'
import { MyButton } from '../../../components/MyButton'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/reducers/userSlice'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import OptionModal from '../../../components/OptionModal'
import { ASSIGN_PROGRAM_MEMBERS_TO_PORTAL, PORTAL_PROGRAM_LIST } from '../../../DAL'
import { colors } from '../../../utilities/colors'
import showToast from '../../../functions/showToast'
import MyLoader from '../../../components/MyLoader'

const AddMembers = ({ navigation, route }) => {
  const { eventId } = route.params;
  let { token } = useSelector(selectUser);
  const [loader, setLoader] = useState(false);
  const [importFrom, setImportFrom] = useState(importList[0]);
  const [importModal, setImportModal] = useState(false);

  const [programModal, setProgramModal] = useState(false)
  const [list, setList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null)


  const getListFromServer = async () => {
    let res = await PORTAL_PROGRAM_LIST({ token, navigation, type: importFrom?.key });
    setLoader(false);
    if (res.code == 200) {
      if (importFrom.key == "group") {
        setList(res?.group_array)
      } else if (importFrom.key == "program") {
        setList(res?.programs)
      }
    }
  }

  useEffect(() => {
    setSelectedItem(null)
    getListFromServer()
  }, [importFrom])


  const onSubmit = async () => {
    if (!!selectedItem == false) {
      showToast({ body: "Please chosoe a program", title: "Alert" });
      return
    }
    setLoader(true)
    let res = await ASSIGN_PROGRAM_MEMBERS_TO_PORTAL({
      navigation, token, event_id: eventId, program_id: selectedItem?._id
    });
    setLoader(false)
    if (res.code == 200) {
      navigation.goBack();
    }
  }


  return (
    <RootView>
      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView>

          <MyTouchableInput
            label='Import From'
            onPress={() => setImportModal(true)}
            value={importFrom?.title}
          />

          <MyTouchableInput
            label={importFrom?.title}
            onPress={() => setProgramModal(true)}
            value={selectedItem?.title}
            subTextView={() => !!selectedItem && (
              <Pressable
                style={__styles.clearbtnView}
                onPress={() => setSelectedItem(null)}>
                <MyText color={colors.primary} >Clear</MyText>
              </Pressable>
            )}
          />

          <MyButton
            title='Import'
            onPress={onSubmit}

          />


        </KeyboardAwareScrollView>
      </View>

      <MyLoader enable={loader} />
      <OptionModal
        isVisible={importModal}
        closeModal={() => setImportModal(false)}
        onSelected={(item) => {
          setImportFrom(item);
          setImportModal(false)
        }}
        optionList={importList}
        noIcon
      />

      <OptionModal
        isVisible={programModal}
        closeModal={() => setProgramModal(false)}
        onSelected={(item) => {
          setSelectedItem(item);
          setProgramModal(false);
        }}
        optionList={list}
        noIcon
      />
    </RootView>
  )
}

export default AddMembers;

const __styles = StyleSheet.create({
  clearbtnView: {
    paddingBottom: 5, paddingLeft: 10, paddingRight: 5
  },
})

const importList = [
  {
    title: "Group",
    key: "group"
  },
  {
    title: "Programme",
    key: "program"
  },
]