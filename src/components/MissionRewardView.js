import { View, Text, Image, Pressable, FlatList } from 'react-native'
import React, { useRef } from 'react'
import BoxView from '../UIComponents/BoxView'
import { Flex, Row } from '../UIComponents/FlexViews'
import MyImage from "./MyImage"
import { fonts } from '../utilities/fonts'
import MyText from "../components/MyText"
import InfoModal from './InfoModal'
import numFormatter from '../functions/numFormatter'
import { colors } from '../utilities/colors'
import isArray from '../functions/isArray'
import Divider from '../UIComponents/Divider'
import { S3_URL } from '../utilities/constants'
import breakReference from '../functions/breakReference'




const ic_coin_s = require("../assets/icons/coin1.png");
const ic_calendar = require("../assets/icons/calendar.png");
const ic_tropy = require("../assets/icons/trophy.png");

const MissionRewardView = ({ isQuest = false, questReplayAccessDays = "", dateString = "", badges = [], showEarnedBadges = true, badgesEarned = [], showBadgesEarned = true, duration = 0, totalCoins = 0, acheivedCoins = 0, onReportPress }) => {
  const ref_info = useRef();

  const badgesView = (badgeList) => {
    let list = breakReference(badgeList);
    list.shift()
    return (
      <View>
        <Row alignItems="center" >
          <Flex alignItems="center" style={{ marginRight: 10 }}>
            <Image
              source={ic_tropy}
              style={{ height: 20, width: 20 }}
            />
          </Flex>
          <MyText>{"Badges"}</MyText>
        </Row>
        <Divider mt={10} />
        <View style={{ marginTop: 10 }}>
          <FlatList
            numColumns={4}
            scrollEnabled={false}
            keyExtraction={(_, index) => index.toString()}
            data={list || []}
            renderItem={({ item, index }) => {
              return (
                <View style={{ flex: 1 / 4, marginTop: index > 3 ? 20 : 10 }} >
                  <Flex alignItems="center" justifyContent="center" flex={1}>
                    <Row alignItems="center">
                      {/* <Text style={[main.regular, { marginRight: 5, textAlign: "center" }]} >{item?.no_of_badges} x</Text> */}
                      <MyText fontSize={16} marginRight={5} fontFamily={fonts.medium} >{item?.no_of_badges} x</MyText>
                      <Image
                        source={{ uri: S3_URL + item?.general_icon?.thumbnail_1 }}
                        style={{ height: 20, width: 20 }}
                      />
                    </Row>
                  </Flex>
                </View>
              )

            }}
          />
        </View>
      </View>
    )
  }



  return (
    <View>
      {!!duration &&
        <BoxView style={{ marginTop: 15 }} >
          <Row style={{ paddingVertical: 2 }} paddingHorizontal={5} alignItems="center">
            <Row alignItems="center" justifyContent="flex-end">
              <Flex alignItems="center" style={{ marginRight: 10 }}>
                <Image
                  source={ic_calendar}
                  style={{ height: 20, width: 20, tintColor: colors.primary2 }}
                />
              </Flex>
              <MyText  style={{ fontFamily: fonts.medium, }} >{isQuest ? "Quest Duration" : "Mission Duration"}</MyText>
            </Row>
            <Flex flex={1} alignItems="flex-end"  >
              <Row alignItems="center" justifyContent="flex-end">
                <MyText >{duration} days</MyText>
              </Row>
            </Flex>
          </Row>


          {isQuest && questReplayAccessDays &&
            <>
              <Divider mt={10} mb={15} />
              <Row paddingHorizontal={5} alignItems="center">
                <Row alignItems="center" justifyContent="flex-end">
                  <Flex alignItems="center" style={{ marginRight: 10 }}>
                    <Image
                      source={ic_calendar}
                      style={{ height: 20, width: 20, tintColor: colors.primary2 }}
                    />
                  </Flex>
                  <MyText style={{ fontFamily: fonts.medium, }}>{"Replay Access"}</MyText>
                </Row>
                <Flex flex={1} alignItems="flex-end"  >
                  <Row alignItems="center" justifyContent="flex-end">
                    <MyText>{questReplayAccessDays} days</MyText>
                  </Row>
                </Flex>
              </Row>
            </>
          }
          {!!dateString && isQuest &&
            <>
              <Divider mt={10} mb={15} />
              <Row paddingHorizontal={5} alignItems="center">
                <Row alignItems="center" justifyContent="flex-end">
                  <Flex alignItems="center" style={{ marginRight: 10 }}>
                    <Image
                      source={ic_calendar}
                      style={{ height: 20, width: 20, tintColor: colors.primary2 }}
                    />
                  </Flex>
                  <MyText style={{ fontFamily: fonts.medium, }}>{"Dates"}</MyText>
                </Row>
                <Flex flex={1} alignItems="flex-end"  >
                  <Row alignItems="center" justifyContent="flex-end">
                    <MyText color={colors.lightText2} style={{ fontFamily: fonts.medium }} >{dateString}</MyText>
                  </Row>
                </Flex>
              </Row>
            </>}

        </BoxView>}


      {
        (!!acheivedCoins || isArray(badges, 0) || !!totalCoins || showEarnedBadges) &&
        <View style={{ marginVertical: 10, marginTop: 15 }}>
          <Row justifyContent="space-between">
            <MyText fontSize={16} color={colors.primary} style={{ fontFamily: fonts.bold }}>{"Rewards & Badges"}</MyText>
            {!!onReportPress &&
              <Pressable onPress={onReportPress} >
                <MyText style={{ textDecorationLine: "underline", fontStyle: "italic" }} >View Report</MyText>
              </Pressable>}
          </Row>
          <BoxView>
            {!!badges && badges?.length > 0 &&
              <>
                <Row paddingHorizontal={5} alignItems="center">
                  <Row alignItems="center" justifyContent="flex-end">
                    <Flex alignItems="center" style={{ marginRight: 10 }}>
                      <Image
                        source={ic_tropy}
                        style={{ height: 20, width: 20 }}
                      />
                    </Flex>
                    <MyText style={{ fontFamily: fonts.medium, }}>{"Achievable Badges"}</MyText>
                  </Row>
                  <Flex flex={1}  >
                    <Row alignItems="center" justifyContent="flex-end">
                      <>

                        {badges.map((item, index) => {
                          if (index == 0) {
                            return (
                              <Row alignItems="center" justifyContent="flex-end">
                                {/* {showBadgesEarned && */}
                                  <MyText style={{ fontSize: 16, marginRight: 5, fontFamily: fonts.medium }} >{item?.no_of_badges} x</MyText>
                                {/* } */}
                                <Flex alignItems="center"  >
                                  <MyImage
                                    source={{ uri: S3_URL + item?.general_icon?.thumbnail_1 }}
                                    style={{ height: 20, width: 20 }}
                                  />
                                </Flex>
                              </Row>
                            )
                          } else return null
                        })}
                      </>

                      {badges.length > 1 &&
                        <Pressable
                          style={{ marginLeft: 10, flexDirection: "row" }}
                          onPress={() => ref_info?.current?.openModal("", "", false,  badgesView(badges))}>
                          <MyText style={{ textDecorationLine: "underline", color: colors.primary2 }}>More</MyText>
                        </Pressable>
                      }

                    </Row>
                  </Flex>
                </Row>
                {(!!totalCoins || !!acheivedCoins || showEarnedBadges) &&
                  <Divider mt={10} mb={15} />}
              </>}

            {isArray(badgesEarned, -1) && showEarnedBadges &&
              <>
                <Row paddingHorizontal={5} alignItems="center">
                  <Row alignItems="center" justifyContent="flex-end">
                    <Flex alignItems="center" style={{ marginRight: 10 }}>
                      <Image
                        source={ic_tropy}
                        style={{ height: 20, width: 20 }}
                      />
                    </Flex>
                    <MyText style={{ fontFamily: fonts.medium, }}>{"Badges Earned"}</MyText>
                  </Row>
                  <Flex flex={1}  >
                    <Row alignItems="center" justifyContent="flex-end">
                      {isArray(badgesEarned) ?
                        <>
                          {badgesEarned.map((item, index) => {
                            if (index == 0) {
                              return (
                                <Row alignItems="center" justifyContent="flex-end">
                                  <MyText style={{ fontSize: 16, marginRight: 5, fontFamily: fonts.medium }} >{item?.no_of_badges} x</MyText>
                                  {/* 
                                  <Flex alignItems="center"  >
                                    <CustomImage
                                      source={{ uri: Imagesdomain + item?.general_icon?.thumbnail_1 }}
                                      style={{ height: 20, width: 20 }}
                                    />
                                  </Flex>
				  */}
                                </Row>
                              )
                            } else return null
                          })}
                          {badgesEarned.length > 1 &&
                            <Pressable
                              style={{ marginLeft: 5 }}
                              onPress={() => ref_info?.current?.openModal("", "", false, "", null, badgesView(badgesEarned))}
                            >
                              <MyText style={{ textDecorationLine: "underline", color: colors.primary2 }} >More</MyText>
                            </Pressable>
                          }
                        </> :
                        <MyText >No Badges Earned</MyText>
                      }
                    </Row>
                  </Flex>
                </Row>
                {(!!totalCoins || !!acheivedCoins) &&
                  <Divider mt={10} mb={15} />}
              </>}




            {!!totalCoins &&
              <>
                <Row paddingHorizontal={5} alignItems="center">
                  <Row alignItems="center" justifyContent="flex-end">
                    <Flex alignItems="center" style={{ marginRight: 10 }}>
                      <Image
                        source={ic_coin_s}
                        style={{ height: 20, width: 20 }}
                      />
                    </Flex>
                    <MyText style={{ fontFamily: fonts.medium, }}>{"Achievable Coins"}</MyText>
                  </Row>
                  <Flex flex={1} alignItems="flex-end"  >
                    <Row alignItems="center" justifyContent="flex-end">
                      <MyText style={{ fontFamily: fonts.medium }} >{numFormatter(totalCoins, 1)}</MyText>
                    </Row>
                  </Flex>
                </Row>
                {!!acheivedCoins &&
                  <Divider mt={10} mb={15} />}
              </>}




            {!!acheivedCoins &&
              <Row paddingHorizontal={5} alignItems="center">
                <Row alignItems="center" justifyContent="flex-end">
                  <Flex alignItems="center" style={{ marginRight: 10 }}>
                    <Image
                      source={ic_coin_s}
                      style={{ height: 20, width: 20 }}
                    />
                  </Flex>
                  <MyText style={{ fontFamily: fonts.medium, }}>{"Coins Earned"}</MyText>
                </Row>
                <Flex flex={1} alignItems="flex-end"  >
                  <Row alignItems="center" justifyContent="flex-end">
                    <MyText style={{ fontFamily: fonts.medium }} >{numFormatter(acheivedCoins, 1)}</MyText>
                  </Row>
                </Flex>
              </Row>}


          </BoxView>
        </View>
      }

      <InfoModal ref={ref_info} />
    </View >
  )
}

export default MissionRewardView
