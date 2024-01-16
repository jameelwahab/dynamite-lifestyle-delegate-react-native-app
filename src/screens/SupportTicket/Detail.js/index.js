import { View, Text, useWindowDimensions, SafeAreaView, TouchableOpacity, StyleSheet, TouchableHighlight } from 'react-native'
import React, { useState, useEffect } from 'react'
import RootView from '../../../components/RootView'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { colors } from '../../../utilities/colors';
import MyText from '../../../components/MyText';
import Comments from './Comments';
import InformationsCard from './InformationsCard';
import { MARK_RESOLVE_TICKET, SUPPORT_TCIKET_DETAIL } from '../../../DAL';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/reducers/userSlice';
import MyLoader from '../../../components/MyLoader';
import AddNote from '../../Notes/AddNote';
import Notes from '../Notes';
import List from '../../Notes/List';
import Modal from 'react-native-modal'
import { TransparentButton } from '../../../components/MyButton';
import Toast from 'react-native-toast-message';
import showToast from '../../../functions/showToast';
import UserImage from '../../../components/UserImage';
import moment from 'moment';
import Collapsible from 'react-native-collapsible';
import { icons } from '../../../utilities/icons';
import { convertTimezone } from '../../../functions/convertTime';
import { selectTimeZone } from '../../../redux/reducers/timezoneSlice';
import MyInputs from '../../../components/MyInputs';

let autoMessages = [];
const Detail = ({ navigation, route }) => {
  const { route: listRoute, refreshList, tab, isMine } = route?.params;
  const { token, user } = useSelector(selectUser);
  const timezone = useSelector(selectTimeZone);

  const layout = useWindowDimensions();
  const [index, setIndex] = useState(!!tab ? tab : 0);
  const [loader, setLoader] = useState(true);
  const [comments, setComments] = useState([]);
  const { _id } = route?.params?.ticket;
  const [ticket, setTicket] = useState(null);
  const [isMarkResolveModalVisible, setMarkResolveModalVisiblity] = useState(false);
  const [isInfoViewCollaspsed, setIsInfoViewCollaspsed] = useState(false)
  const [routes] = React.useState(!!isMine ? tabs.filter(x => x.index != 2) : tabs);


  useEffect(() => {
    autoMessages = [];
    api_ticketDetail()
  }, []);


  const moveToMarkResolve = async (reason, note) => {
    let obj = {
      support_ticket: ticket?._id,
      close_note: note,
      reason_to_solve: reason
    }
    setMarkResolveModalVisiblity(false);
    setLoader(true)

    let res = await MARK_RESOLVE_TICKET({
      token, navigation,
      body: obj,
    });
    setLoader(false)
    if (res.code == 200) {
      showToast({ title: "Marked resolved successfully ", body: res.message, type: "success" })
      route?.params?.refreshList?.()
    } else {

    }
  }

  const MarkResolveModal = () => {
    const [reson, setReson] = useState("Answered");
    const [note, setNote] = useState("");

    const btn_resolve = () => {
      if (reson == "") {
        showToast({ body: "Please select reason", type: "info" })
      } else if (note.trim() == "") {
        showToast({ body: "Please write note", type: "info" })
      } else {
        moveToMarkResolve(reson.toLowerCase(), note.trim())
        setReson("")
        setNote("")
      }
    }

    const optionView = (text) => {
      return (
        <TouchableOpacity
          onPress={() => setReson(text)}
          style={{ flexDirection: "row", paddingVertical: 5 }}
        >
          <View style={{ height: 20, width: 20, borderColor: reson == text ? colors.primary : colors.white, borderWidth: 1, borderRadius: 20 / 2, alignItems: "center", justifyContent: "center" }}>
            {reson == text &&
              <View style={{ height: 12, width: 12, borderRadius: 18 / 2, backgroundColor: colors.primary }} />}
          </View>
          <View style={{ marginLeft: 10 }}>
            <MyText fontSize={16} >{text}</MyText>
          </View>
        </TouchableOpacity>
      )
    }
    return (
      <Modal
        isVisible={isMarkResolveModalVisible}
        onBackdropPress={() => setMarkResolveModalVisiblity(false)}
        onBackButtonPress={() => setMarkResolveModalVisiblity(false)}
        useNativeDriverForBackdrop={true}
        avoidKeyboard={true}
        animationIn='zoomIn'
        animationOut='zoomOut'
        animationInTiming={300}
        animationOutTiming={300}
        style={{ margin: 10 }}>
        <SafeAreaView style={{ backgroundColor: colors.secondaryVariant, borderRadius: 10, }} >
          <View style={{ margin: 10 }}>
            <View style={{ margin: 10 }}>
              <MyText fontSize={18} color={colors.primary} type='medium'>Mark Resolve</MyText>

            </View>
            <View style={{ margin: 10 }}>
              <MyText isLabel>Reson to Solve*</MyText>
              <View>
                {optionView("Answered")}
                {optionView("Solved")}
                {optionView("Auto-Closure")}
              </View>
            </View>
            <View style={{ margin: 10 }}>
              <MyInputs
                multiline={true}
                value={note}
                label='Resolve Note*'
                onChangeText={(text) => setNote(text)}
              />
            </View>


            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 10 }}>
              <TransparentButton title='CANCEL' onPress={() => setMarkResolveModalVisiblity(false)} />
              <TransparentButton title='RESOLVE' onPress={btn_resolve} />
            </View>

          </View>
        </SafeAreaView>
        {isMarkResolveModalVisible && <Toast />}
      </Modal>)
  }

  const openMarkResolveModal = () => {
    setMarkResolveModalVisiblity(true)
  }


  const addMessage = (msg) => {
    comments.unshift(msg);
    setComments([...comments]);
    if (listRoute == 'waiting') {
      refreshList?.()
    }
    // flatlistRef?.current?.scrollToIndex({ index: 0, animated: true })
  }

  const api_ticketDetail = async () => {
    let res = await SUPPORT_TCIKET_DETAIL({
      token, navigation,
      ticketId: _id
    });
    if (res.code == 200) {
      autoMessages = res.auto_responder_message;
      setLoader(false)
      setTicket(res?.support_ticket)
      setComments(res?.support_ticket?.comment.reverse())
    } else {
      setLoader(false)
    }
  }

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: colors.primary }}
      style={{
        backgroundColor: colors.darkSecondary,
        shadowColor: colors.lightText2,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
      }}
      renderLabel={({ route, focused, color }) => (
        <>
          <MyText color={focused ? colors.primary : colors.lightText} type='medium' >
            {route.title
              // + " (" + badges[route?.key] + ")"
            }
          </MyText>
          {/* {((route?.key == 'need_fixes' && badges['need_to_fixed_dot'] > 0) ||
            user?.notify_tab == route?.key) &&
            <View style={__styles.badges} />
          } */}
        </>
      )}
    />
  );

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'ticket':
        return <InformationsCard
          moveToMarkResolve={openMarkResolveModal}
          ticket={ticket}
          listRoute={listRoute}
          user={user} />

      case 'comments':
        return <Comments
          commentsList={comments}
          ticket={ticket}
          listRoute={listRoute}
          user={user}
          autoMessages={autoMessages}
          addMessage={addMessage}
          timezone={timezone}
          isMine={isMine}
        />

      case 'notes':
        return <List
          ticket={ticket}
          user={user}
          timezone={timezone} />

    }
  }


  const renderTopView = () => {
    if (!!ticket) {
      return (
        <View
          style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10, marginTop: 10, position: "absolute", top: -65, left: 25, right: -10, zIndex: 2 }}>
          <UserImage
            image={ticket?.member?.profile_image}
            name={ticket?.member?.first_name}
            size={35}
          />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <MyText fontSize={16} >{`${ticket?.member?.first_name} ${ticket?.member?.last_name}`}</MyText>
            <MyText fontSize={12}>{ticket?.member?.email}</MyText>
          </View>


          <TouchableHighlight
            onPress={() => setIsInfoViewCollaspsed(!isInfoViewCollaspsed)}
            underlayColor={colors.lightPrimary2}
            style={{ width: 35, height: 35, borderRadius: 35 / 2, backgroundColor: colors.secondaryVariant, alignItems: "center", justifyContent: "center", paddingBottom: 5, paddingLeft: 5 }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", }}>
              <View style={{ alignItems: "center" }}>
                {icons.info(colors.white, 15)}
              </View>
              <View style={{ marginLeft: 2, marginTop: 3 }}>
                {isInfoViewCollaspsed ? icons.downward(colors.white, 10) : icons.upward(colors.white, 10)}
              </View>
            </View>
          </TouchableHighlight>
        </View>
      )
    }
  }

  const infoView = () => {
    if (!!ticket) {
      return (
        <Collapsible
          collapsed={isInfoViewCollaspsed}
          style={__styles.cardView}>
          <View style={__styles.cardItemView}>
            <MyText fontSize={12}>Department</MyText>
            <MyText fontSize={12}>{ticket?.department_info?.title}</MyText>
          </View>

          <View style={__styles.cardItemView}>
            <MyText fontSize={12}>Created at :</MyText>
            <MyText fontSize={12}>{convertTimezone(ticket?.createdAt, timezone).format("DD MMM YYYY [at] hh:mm A")}</MyText>
          </View>
          <View style={__styles.cardItemView}>
            <MyText fontSize={12}>Responded on:</MyText>
            <MyText fontSize={12}>{convertTimezone(ticket?.updatedAt, timezone).format("DD MMM YYYY [at] hh:mm A")}</MyText>
          </View>

        </Collapsible >
      )
    }
  }


  return (
    <RootView  >

      <View style={{ flex: 1 }}>
        {isMine == false && renderTopView()}
        {isMine == false && infoView()}
        <View style={{ flex: 1 }}>

          {!!ticket &&

            <TabView
              renderTabBar={renderTabBar}
              navigationState={{ index, routes }}
              renderScene={renderScene}
              onIndexChange={(index) => {
                setIndex(index);
              }}
              initialLayout={{ width: layout.width }}
            />}
        </View>
      </View>
      <MyLoader enable={loader} />
      {MarkResolveModal()}
    </RootView>
  )
}

export default Detail;

const tabs = [
  { key: 'ticket', title: 'Ticket', index: 0 },
  { key: 'comments', title: 'Comments', index: 1 },
  { key: 'notes', title: 'Internal Notes', index: 2 },
];



const __styles = StyleSheet.create({
  cardView: {
    backgroundColor: colors.secondary,
    minHeight: 100,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingBottom: 10,
    marginTop: 10
  },
  cardItemView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1 / 4,
    borderBottomColor: colors.lightText2,
    paddingBottom: 5,
    marginTop: 10
  }
})