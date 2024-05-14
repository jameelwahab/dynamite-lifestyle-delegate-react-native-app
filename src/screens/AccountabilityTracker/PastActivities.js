import { View, Text, FlatList, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import RootView from '../../components/RootView'
import MyText from '../../components/MyText'
import { selectUser } from '../../redux/reducers/userSlice'
import { selectNavbar } from '../../redux/reducers/navbarSlice'
import { MenuButton } from '../../components/MyButton'
import { DELETE_ACCOUNTABILITY_TRACKER, GET_PAST_ACTIVITIES } from '../../DAL'
import { useSelector } from 'react-redux'
import MyLoader from '../../components/MyLoader'
import { colors } from '../../utilities/colors'
import moment from 'moment'
import OptionModal from '../../components/OptionModal'
import ConfirmationModal from '../../components/ConfirmationModal'
import { icons } from '../../utilities/icons'
import { dateTimeFormat } from '../../utilities/constants'
import EmptyView from '../../components/EmptyView'
import routes from '../../navigation/routes'
import showToast from '../../functions/showToast'


const PastActivities = ({ navigation, route }) => {
  const { removeFromList } = route?.params
  const { token } = useSelector(selectUser);
  const [list, setList] = useState([]);
  const [loader, setLoader] = useState(false)
  const [options, setOptions] = useState({ isVisible: false, item: null });
  const [confirmation, setConfirmation] = useState({ isVisible: false, item: null })

  useEffect(() => {
    setLoader(true)
    getPastActivitiesFromServer();
  }, [])


  //! APIs



  const getPastActivitiesFromServer = async () => {
    let res = await GET_PAST_ACTIVITIES({ navigation, token, });
    if (res.code == 200) {
      setList(res?.past_activities)
      setLoader(false);
    } else {
      setLoader(false);
    }
  }


  const deleteTrackerToServer = async (id) => {
    setLoader(true);
    let res = await DELETE_ACCOUNTABILITY_TRACKER({
      navigation, token, id
    });
    setLoader(false);
    if (res.code == 200) {
      showToast({ title: res?.message, type: "success" });
      removeFromList?.(id);
      setList((list) => list.slice().filter(x => x._id != id))
    }
  }



  //* Function

  const onSelected = (opt) => {
    let { item } = options;
    setOptions({ isVisible: false, item: null });
    setTimeout(() => {
      if (opt.key == "edit") {
        navigation.navigate(routes.accountabilityTrackerScreen, {
          date: moment(item?.date, "YYYY-MM-DD")
        })
      } else if (opt.key == "delete") {
        setConfirmation({ isVisible: true, item: item })
      }
    }, 400);
  }


  const onAgree = () => {
    let { item } = confirmation;
    setConfirmation({ isVisible: false, item: null })
    setTimeout(() => {
      deleteTrackerToServer(item?._id)
    }, 350);
  }


  const recentActivities = ({ item, index }) => {
    return (
      <View style={__styles.activityView} >
        <View style={__styles.activityRow}>
          <MyText>{item?.date}</MyText>
          <View style={__styles.activityNestedRow}>
            <MyText>{moment(item?.date_time, "YYYY-MM-DD HH:mm").format(dateTimeFormat.time)}</MyText>
            <MenuButton
              onPress={() => setOptions({ isVisible: true, item, item })}
            />
          </View>

        </View>
        <View style={{ marginTop: 10 }}>
          <MyText>{item?.statement_array[0]?.option}</MyText>
        </View>
      </View>
    )
  }



  return (
    <RootView title={"Past Activities"}  >
      <View style={{ flex: 1 }}>
        <FlatList
          data={list}
          renderItem={recentActivities}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={!loader && <EmptyView label={"Activities Not Found!"} />}
        />
      </View>
      <MyLoader enable={loader} />



      <OptionModal
        isVisible={options.isVisible}
        onSelected={onSelected}
        optionList={optionsList}
        closeModal={() => setOptions({ isVisible: false, item: null })}
      />


      <ConfirmationModal
        title={"Are you sure you want to delete?"}
        isVisible={confirmation.isVisible}
        onAgree={onAgree}
        closeModal={() => setConfirmation({ isVisible: false, item: null })}
      />
    </RootView>
  )
}

export default PastActivities


const __styles = StyleSheet.create({
  reminderView: {
    marginBottom: 10,
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    borderRadius: 10,
    paddingTop: 5
  },
  daysView: {
    flex: 1,
    paddingHorizontal: 10,
    flexDirection: "row",
    flexWrap: "wrap"
  },
  labelView: { marginVertical: 5 },
  addRemoveButton: {
    paddingLeft: 5,

  },
  activityView: {
    paddingLeft: 10, paddingVertical: 10, paddingRight: 5,
    backgroundColor: colors.secondary, marginTop: 10, borderRadius: 10
  },
  activityRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  activityNestedRow: { flexDirection: "row", alignItems: "center" }
})


const optionsList = [

  {
    title: "Edit",
    key: "edit",
    icon: icons.edit
  },
  {
    title: "Delete",
    key: "delete",
    icon: icons.trash
  },

]
