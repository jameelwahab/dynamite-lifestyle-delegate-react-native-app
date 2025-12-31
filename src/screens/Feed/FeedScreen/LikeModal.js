import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import MyLoader from '../../../components/MyLoader';
import Modal from 'react-native-modal';
import utilities from '../../../utilities';
import {STRINGS} from '../../../utilities/strings';
import {colors} from '../../../utilities/colors';
import MyText from '../../../components/MyText';
import {icons} from '../../../utilities/icons';
import UserImage from '../../../components/UserImage';
import {dateTimeFormat} from '../../../utilities/constants';
import {convertTimezone} from '../../../functions/convertTime';
import FooterLoader from '../../../components/FooterLoader';

const LikeModal = ({
  isVisible,
  closeModal,
  likes = [],
  timezone,
  user,
  loader,
  onEndReached,
  footerLoader,
  onMessagePress,
  type = 'like',
  isChatAllowed,
}) => {
  const userLikeView = ({item, index}) => {
    return (
      <View style={type == 'report' ? __style.boxReportView : {}}>
        <View style={__style.boxView}>
          <View>
            <UserImage
              borderWidth={2}
              borderColor={
                item?.user_info_action_by?.badge_level_info?.color_code
              }
              image={item?.user_info_action_by?.profile_image}
              name={item?.user_info_action_by?.name}
              size={35}
            />
            {type == 'like' && (
              <View style={__style.heartIconPosition}>
                {icons.heartFilled(colors.heart, 15)}
              </View>
            )}
          </View>
          <View style={__style.marginLeft10Flex1}>
            <View style={__style.emptyView}>
              <MyText fontSize={13} type="bold">
                {item?.user_info_action_by?.name}
              </MyText>
              <MyText
                style={__style.marginTop3}
                fontSize={10}
                color={colors.lightText2}>
                {convertTimezone(item?.createdAt, timezone).format(
                  dateTimeFormat.dateTimeWithText('at'),
                )}
              </MyText>
            </View>
          </View>
          {isChatAllowed &&
            item?.user_info_action_by?.action_by == 'member_user' && (
              <TouchableOpacity
                onPress={() => onMessagePress?.(item)}
                style={__style.padding10}>
                {icons.message(colors.primary, 20)}
              </TouchableOpacity>
            )}
        </View>
        {!!item?.report_reason && type == 'report' && (
          <View style={__style.reportReasonContainer}>
            <MyText type="medium">{item?.report_reason}</MyText>
          </View>
        )}
      </View>
    );
  };

  const modalLike = () => {
    return (
      <Modal
        isVisible={isVisible}
        onBackdropPress={closeModal}
        onBackButtonPress={closeModal}
        useNativeDriverForBackdrop={true}
        animationIn="zoomIn"
        animationOut="zoomOut"
        animationInTiming={400}
        animationOutTiming={400}
        avoidKeyboard={true}
        style={__style.modalMargin}>
        <SafeAreaView style={__style.flex1}>
          <View style={__style.rootView}>
            <View style={__style.headingView}>
              <View style={__style.flexRowCenter}>
                {type == 'report'
                  ? icons.warnOctagon(colors.primary, 18)
                  : icons.heartFilled(colors.heart, 25)}
                <View style={__style.marginLeft5}>
                  <MyText fontSize={18} type="medium">
                    {type == 'report'
                      ? STRINGS.LIKE_MODAL.reportedUsers
                      : STRINGS.LIKE_MODAL.likes}
                  </MyText>
                </View>
              </View>
              <Pressable onPress={closeModal}>
                {icons.crosssWithCircle()}
              </Pressable>
            </View>
            <View style={__style.flex1}>
              <FlatList
                data={likes}
                showsVerticalScrollIndicator={false}
                renderItem={userLikeView}
                onEndReached={onEndReached}
                keyExtractor={item => item?._id}
                // ListEmptyComponent={!loader && <EmptyView label={"No Likes Exist"} />}
                ListFooterComponent={<FooterLoader enable={footerLoader} />}
              />
            </View>

            <MyLoader enable={loader} />
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  return <View>{modalLike()}</View>;
};

export default LikeModal;

const __style = StyleSheet.create({
  rootView: {
    // flex: 1,
    borderRadius: 20,
    backgroundColor: colors.secondaryVariant,
    height: utilities.screenHeight() / 2,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  headingView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1 / 3,
    borderBottomColor: colors.lightText,
  },
  boxReportView: {
    borderWidth: 1 / 2,
    borderColor: colors.primary2,
    borderRadius: 10,
    marginHorizontal: 5,
    marginTop: 5,
  },
  boxView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 5,
  },
  heartIconPosition: {
    position: 'absolute',
    bottom: 0,
    right: -5,
  },
  marginLeft10Flex1: {
    marginLeft: 10,
    flex: 1,
  },
  emptyView: {},
  marginTop3: {
    marginTop: 3,
  },
  padding10: {
    padding: 10,
  },
  reportReasonContainer: {
    marginLeft: 10,
    padding: 5,
  },
  modalMargin: {
    margin: 0,
    marginHorizontal: 5,
  },
  flex1: {
    flex: 1,
  },
  flexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  marginLeft5: {
    marginLeft: 5,
  },
});
