import { View, Text, FlatList, Image, Pressable, TouchableHighlight } from 'react-native'
import React, { useState } from 'react'
import RootView from '../../../components/RootView'
import MyText from '../../../components/MyText'
import { icons } from '../../../utilities/icons'
import { colors } from '../../../utilities/colors'
import { TouchableOpacity } from 'react-native-gesture-handler'
import OptionModal from '../../../components/OptionModal'
import { CALLBACK_TYPE } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/gesture'
import { MyButton } from '../../../components/MyButton'
import routes from '../../../navigation/routes'
import Collapsible from 'react-native-collapsible';
import { fonts } from '../../../utilities/fonts'


const TicketDetail = ({ navigation, route }) => {
  const { ticket } = route?.params
  const [isMsgOptionModalVisible, setIsMsgOptionModalVisible] = useState(false)
  const [isOptionModalVisible, setIsOptionModalVisible] = useState(false)


  const renderMsg = ({ item, index }) => {
    return (
      <View style={{ padding: 10, marginBottom: 10, marginTop: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ height: 40, width: 40, borderRadius: 40 / 2, overflow: "hidden", borderWidth: 1 / 4, borderColor: colors.primary }}>
            <Image
              source={typeof (item.image) == "number" ? item.image : { uri: item.image }}
              style={{ height: "100%", width: '100%' }} />
          </View>
          <View style={{ marginLeft: 10, flex: 1 }}>
            <MyText type='medium'  >{item.name}</MyText>
            <MyText fontSize={10} color={colors.lightText} type='medium' >{item.createdAt}</MyText>
          </View>
          <TouchableHighlight
            underlayColor={colors.secondary}
            onPress={() => setIsMsgOptionModalVisible(true)}
            style={{ height: 35, width: 35, alignItems: "center", justifyContent: "center", borderRadius: 35 / 2 }}>
            {icons.threeDots()}
          </TouchableHighlight>
        </View>

        <View style={{ marginTop: 10 }}>
          <MyText fontSize={12} color={colors.lightText2} >{item?.message}</MyText>
        </View>

        <View style={{ marginTop: 10 }}>
          {!!item?.images && item?.images.map((x, i) => (
            <View style={{ backgroundColor: colors.secondaryVariant, height: 200, borderRadius: 10, overflow: "hidden", marginBottom: 15 }}>
              <Image source={{ uri: x }} style={{ height: 150, width: "100%" }} />
              <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ height: "100%", aspectRatio: 1, alignItems: "center", justifyContent: "center" }}>
                  <Image opacity={0.7} source={icons.photo} style={{ height: 25, width: 25 }} />
                </View>

                <View style={{ height: "100%", aspectRatio: 1, alignItems: "center", justifyContent: "center" }}>
                  <TouchableOpacity style={{ height: 35, width: 35, alignItems: "center", justifyContent: "center", backgroundColor: colors.lightPrimary3, borderRadius: 35 / 2 }}>
                    {icons.download()}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    )

  }

  const footerView = () => {
    return (
      <View>
        <View style={{ marginBottom: 10 }}>
          <MyButton textStyle={{ fontFamily: fonts.regular, textTransform: "capitalize" }} invert title={"Internal Notes"} />
        </View>
        <View style={{ marginBottom: 10, backgroundColor: colors.secondary, padding: 10, borderRadius: 10 }}>
          <MyText type='medium' fontSize={18} color={colors.primary}>
            {ticket?.subject}
          </MyText>
          <View style={{ marginTop: 5 }}>
            <MyText type='medium' fontSize={12} color={colors.lightText2}>
              {ticket?.describtion}
            </MyText>
          </View>
          <View style={{ marginTop: 5 }}>
            <MyText fontSize={12} color={colors.primary}>
              {"Created Date :"}  <Text style={{ color: colors.lightText2 }} > {" 24-07-2023 06:34 AM"}</Text>
            </MyText>
            <MyText fontSize={12} color={colors.primary}>
              {"Responded Time :"}  <Text style={{ color: colors.lightText2 }}> {" 24-07-2023 06:34 AM"}</Text>
            </MyText>
          </View>
        </View>
      </View>
    )
  }

  const headerView = () => {
    return (
      <View style={{ marginHorizontal: 50 }}>
        <MyButton
          onPress={() => navigation.navigate(routes.supportTicketReply)}
          style={{ borderRadius: 100 }}
          textStyle={{}}
          leftIcon={icons.reply}
          title='Reply'
          invert={true} />
      </View>
    )
  }

  const topView = () => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 10 }}>
        <MyText>{"Ammar Yousaf (y.amm4r@gmail.com)"}</MyText>
        <TouchableOpacity
          onPress={() => setIsOptionModalVisible(true)}
          style={{ height: 30, width: 30, borderRadius: 30 / 2, backgroundColor: colors.lightPrimary3, alignItems: "center", justifyContent: "center" }}>
          {icons.threeDots()}
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <RootView titleView={topView}  >
      <View style={{ flex: 1 }}>
        <FlatList
          contentContainerStyle={{ paddingVertical: 20 }}
          inverted={true}
          data={list}
          renderItem={renderMsg}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={headerView}
          ListFooterComponent={footerView}
          StickyHeaderComponent={footerView}
          // ItemSeparatorComponent={<View style={{ height: 0.1, backgroundColor: colors.lightText2 }} />}
        />
      </View>

      <OptionModal
        optionList={msgOptionList}
        closeModal={() => setIsMsgOptionModalVisible(false)}
        onSelected={() => setIsMsgOptionModalVisible(false)}
        isVisible={isMsgOptionModalVisible} />

      <OptionModal
        optionList={OptionList}
        closeModal={() => setIsOptionModalVisible(false)}
        onSelected={() => setIsOptionModalVisible(false)}
        isVisible={isOptionModalVisible} />
    </RootView>
  )
}

export default TicketDetail;

const msgOptionList = [{
  icon: icons.edit,
  title: "Edit"
},
{
  icon: icons.trash,
  title: "Delete"
}]

const OptionList = [{
  icon: icons.tick,
  title: "Mark Resolve"
},
{
  icon: icons.copy,
  title: "Copy Password"
}]


const list = [
  {
    message: "Hi, Hope you are well\nWe are looking forward to your issue",
    createdAt: "2 days ago",
    image: icons.dummyUser2,
    name: "John H. Fair",
    images: ["https://picsum.photos/id/337/200/300", "https://picsum.photos/id/537/200/300"]
  },
  {
    message: "Please do it as soon as possible, I have an urgent meeting on it.",
    createdAt: "2 days ago",
    image: "https://dynamite-lifestyle-dev-app-bucket.s3.amazonaws.com/member/46c006b0-3cee-46b2-91d8-161fbc4b5e15.jpg",
    name: 'Christopher M. Moore',
  },
  {
    message: "Quis commodo odio aenean sed adipiscing diam donec adipiscing tristique. Vel fringilla est ullamcorper eget nulla facilisi etiam. Etiam dignissim diam quis enim lobortis scelerisque fermentum dui faucibus. Dolor sed viverra ipsum nunc aliquet bibendum enim.",
    createdAt: "1 days ago",
    image: icons.dummyUser2,
    name: "John H. Fair",
  },
  {
    message: "Good! Thanks",
    createdAt: "8 minutes ago",
    image: "https://dynamite-lifestyle-dev-app-bucket.s3.amazonaws.com/member/46c006b0-3cee-46b2-91d8-161fbc4b5e15.jpg",
    name: 'Christopher M. Moore',
  },
  {
    message: "Thank you sir for your co-operation",
    createdAt: "just now",
    image: icons.dummyUser2,
    name: "John H. Fair",
    images: ["https://picsum.photos/id/337/200/300"]
  },

  {
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    createdAt: "8 minutes ago",
    image: "https://dynamite-lifestyle-dev-app-bucket.s3.amazonaws.com/member/46c006b0-3cee-46b2-91d8-161fbc4b5e15.jpg",
    name: 'Christopher M. Moore',
  },

  {
    message: "Senectus et netus et malesuada fames ac. Ac orci phasellus egestas tellus rutrum tellus pellentesque eu tincidunt. Quisque sagittis purus sit amet volutpat consequat mauris nunc congue. Libero enim sed faucibus turpis in eu. Ut tortor pretium viverra suspendisse. Tellus mauris a diam maecenas sed enim ut sem. Pharetra pharetra massa massa ultricies. Pharetra vel turpis nunc eget. Blandit volutpat maecenas volutpat blandit. Sed odio morbi quis commodo odio aenean sed adipiscing diam. Donec pretium vulputate sapien nec. Consequat nisl vel pretium lectus quam. Nunc scelerisque viverra mauris in aliquam sem fringilla ut. Lacus vestibulum sed arcu non odio euismod.",
    createdAt: "just now",
    image: icons.dummyUser2,
    name: "John H. Fair",
    images: ["https://picsum.photos/id/437/200/300"]
  },
].reverse()