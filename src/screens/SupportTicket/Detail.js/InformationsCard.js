import { View, Text, TouchableOpacity, Pressable, ScrollView, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import MyText from '../../../components/MyText'
import { icons } from '../../../utilities/icons'
import { colors } from '../../../utilities/colors'
import moment from 'moment'
import UserImage from '../../../components/UserImage'
import MyImage from '../../../components/MyImage'
import { S3_URL } from '../../../utilities/constants'
import { MyButton, TransparentButton } from '../../../components/MyButton'
import ImageZoomer from '../../../components/ImageZoomer'

const InformationsCard = ({ ticket, user, moveToMarkResolve }) => {
  const [modalListImages, setModalListImages] = useState({ index: -1, list: [] });


  if (!!ticket) {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView>
          {/* <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10, marginTop: 10 }}>
            <UserImage
              image={ticket?.member?.profile_image}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <MyText fontSize={16} >{`${ticket?.member?.first_name} ${ticket?.member?.last_name}`}</MyText>
              <MyText fontSize={12}>{ticket?.member?.email}</MyText>
            </View>
          </View> */}
          <View>





            <View style={{ marginBottom: 10, padding: 10 }}>



              {!!ticket?.subject &&
                <MyText type='medium' fontSize={22} color={colors.primary}>
                  {ticket?.subject}
                </MyText>}

              {/* <View style={{ marginVertical: 5, }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MyText fontSize={12} color={colors.primary} style={{ flex: 1 }}>
                    {"Created Date : "}</MyText>
                  <MyText fontSize={12} style={{ color: colors.lightText2 }} > {moment(ticket?.createdAt).format("DD MMM YYYY [At] hh:mm A")}</MyText>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MyText fontSize={12} color={colors.primary} style={{ flex: 1 }}>
                    {"Responded Time : "}
                  </MyText>
                  <MyText fontSize={12} style={{ color: colors.lightText2 }}>  {moment(ticket?.updatedAt).format("DD MMM YYYY [At] hh:mm A")}</MyText>
                </View>
              </View> */}

              {!!ticket?.description &&
                <View style={{ marginTop: 5 }}>
                  <MyText type='medium' fontSize={14} color={colors.lightText2}>
                    {ticket?.description}
                  </MyText>
                </View>}

              {/* <View style={__styles.cardView}>
                <View style={__styles.cardItemView}>
                  <MyText style={__styles.cardItemText}>Department</MyText>
                  <MyText style={__styles.cardItemText}>{ticket?.department_info?.title}</MyText>
                </View>

                <View style={__styles.cardItemView}>
                  <MyText style={__styles.cardItemText}>Created at :</MyText>
                  <MyText style={__styles.cardItemText} > {moment(ticket?.createdAt).format("DD MMM YYYY [at] hh:mm A")}</MyText>
                </View>
                <View style={__styles.cardItemView}>
                  <MyText style={__styles.cardItemText}>Responded on:</MyText>
                  <MyText style={__styles.cardItemText}>{moment(ticket?.updatedAt).format("DD MMM YYYY [at] hh:mm A")}</MyText>
                </View> */}
              <View>

                {!!ticket?.ticket_images && ticket?.ticket_images.length > 0 &&
                  <View style={{ marginTop: 20 }}>
                    <MyText color={colors.primary} type='medium'  >Attachments</MyText>
                    <View style={{ flexDirection: "row", flexWrap: "wrap", height: 100, marginTop: 5 }}>
                      <ScrollView horizontal >
                        {ticket?.ticket_images.map((x, i) => (
                          <View style={{ height: 100, aspectRatio: 1, }}>
                            <Pressable
                              onPress={() => setModalListImages({ list: ticket?.ticket_images, index: i })}
                              style={{ margin: 5, borderRadius: 10, overflow: "hidden" }}>
                              <MyImage
                                source={{ uri: S3_URL + x.thumbnail_1 }}
                                style={{ height: "100%", width: "100%" }}
                              />
                            </Pressable>
                          </View>
                        ))}
                      </ScrollView>
                    </View>
                  </View>
                }



              </View>


            </View>

            <View style={{ marginTop: 20, marginLeft: "60%" }}>
              <MyButton title='Mark Resolve' onPress={moveToMarkResolve} textStyle={{ color: colors.black }} />
            </View>




          </View>
        </ScrollView >
        <ImageZoomer
          closeModal={() => setModalListImages({ index: -1, list: [] })}
          visible={modalListImages.list.length > 0}
          list={modalListImages.list}
          index={modalListImages.index}
        />
      </View >
    )
  }
}

export default InformationsCard;


const __styles = StyleSheet.create({
  cardView: {
    backgroundColor: colors.darkSecondary,
    borderRadius: 10,
    // paddingHorizontal: 10,
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
  },
  cardItemText: {
    fontSize: 12,
    color: colors.lightText2
  }
})