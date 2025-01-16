import { View, Text, Image, Pressable, FlatList, StyleSheet } from 'react-native'
import React, { useRef } from 'react'
import BoxView from '../../UIComponents/BoxView';
import { Flex, Row } from '../../UIComponents/FlexViews';
import MyImage from '../MyImage';
import { S3_URL } from '../../utilities/constants';
import Divider from '../../UIComponents/Divider';
import InfoModal from '../InfoModal';
import breakReference from '../../functions/breakReference';
import { colors } from '../../utilities/colors';
import isArray from '../../functions/isArray';
import numFormatter from '../../functions/numFormatter';
import { icons } from '../../utilities/icons';
import { fonts } from '../../utilities/fonts';
import MyText from '../MyText';





const ic_coin_s = require("../../assets/icons/coin.png");
const ic_tropy = require("../../assets/icons/trophy.png");

const MissionRewardView = ({ badges = [], showEarnedBadges = true, badgesEarned = [], duration = 0, totalCoins = 0, acheivedCoins = 0, }) => {
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
          <Text style={[main.heading, { fontFamily: fonts.medium, }]}>{"Badges"}</Text>
        </Row>
        <Divider mt={10} />
        <View style={{ marginTop: 10 }}>
          <FlatList
            numColumns={4}
            scrollEnabled={false}
            data={list || []}
            renderItem={({ item, index }) => {
              return (
                <View style={{ flex: 1 / 4, marginTop: index > 3 ? 20 : 10 }} >
                  <Flex alignItems="center" justifyContent="center" flex={1}>
                    <Row alignItems="center">
                      {/* <Text style={[main.regular, { marginRight: 5, textAlign: "center" }]} >{item?.no_of_badges} x</Text> */}
                      <Text style={[main.regular, { fontSize: 16, marginRight: 5, fontFamily: fonts.medium }]} >{item?.no_of_badges} x</Text>
                      <MyImage
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
                {icons.calendar(colors.primary)}
                {/* <Image
                  source={ic_calendar}
                  style={{ height: 20, width: 20, tintColor: colors.primary2 }}
                /> */}
              </Flex>
              <Text style={[main.regular, { fontFamily: fonts.medium, }]}>{"Mission Duration"}</Text>
            </Row>
            <Flex flex={1} alignItems="flex-end"  >
              <Row alignItems="center" justifyContent="flex-end">
                <Text style={[main.regular, { fontFamily: fonts.medium }]} >{duration} days</Text>
              </Row>
            </Flex>
          </Row>
        </BoxView>}


      {(!!acheivedCoins || isArray(badges, 0) || !!totalCoins || showEarnedBadges) &&
        <View style={{ marginVertical: 10, marginTop: 15 }}>
          <MyText type='bold' fontSize={18} color={colors.primary}  >{"Rewards & Badges"}</MyText>
          <BoxView style={{ marginTop: 10 }}>
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
                    <Text style={[main.regular, { fontFamily: fonts.medium, }]}>{"Achievable Badges"}</Text>
                  </Row>
                  <Flex flex={1}  >
                    <Row alignItems="center" justifyContent="flex-end">
                      {badges.map((item, index) => {
                        if (index == 0) {
                          return (
                            <Row alignItems="center" justifyContent="flex-end">
                              <Text style={[main.regular, { fontSize: 16, marginRight: 5, fontFamily: fonts.medium }]} >{item?.no_of_badges} x</Text>
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
                      {badges.length > 1 &&
                        <Pressable
                          style={{ marginLeft: 5 }}
                          onPress={() => ref_info?.current?.openModal("", "", false, badgesView(badges))}
                        >
                          <Text style={[main.description, { textDecorationLine: "underline", color: colors.primary2 }]} >More</Text>
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
                    <Text style={[main.regular, { fontFamily: fonts.medium, }]}>{"Badges Earned"}</Text>
                  </Row>
                  <Flex flex={1}  >
                    <Row alignItems="center" justifyContent="flex-end">
                      {isArray(badgesEarned) ?
                        <>
                          {badgesEarned.map((item, index) => {
                            if (index == 0) {
                              return (
                                <Row alignItems="center" justifyContent="flex-end">
                                  <Text style={[main.regular, { fontSize: 16, marginRight: 5, fontFamily: fonts.medium }]} >{item?.no_of_badges} x</Text>
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
                          {badgesEarned.length > 1 &&
                            <Pressable
                              style={{ marginLeft: 5 }}
                            // onPress={() => ref_info?.current?.openModal("", "", false, "", null, badgesView(badgesEarned))}
                            >
                              <Text style={[main.description, { textDecorationLine: "underline", color: colors.primary2 }]} >More</Text>
                            </Pressable>
                          }
                        </> :
                        <MyText color={colors.lightText} >No Badges Earned</MyText>
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
                    <Text style={[main.regular, { fontFamily: fonts.medium, }]}>{"Achievable Coins"}</Text>
                  </Row>
                  <Flex flex={1} alignItems="flex-end"  >
                    <Row alignItems="center" justifyContent="flex-end">
                      <Text style={[main.regular, { fontFamily: fonts.medium }]} >{numFormatter(totalCoins, 1)}</Text>
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
                  <Text style={[main.regular, { fontFamily: fonts.medium, }]}>{"Coins Earned"}</Text>
                </Row>
                <Flex flex={1} alignItems="flex-end"  >
                  <Row alignItems="center" justifyContent="flex-end">
                    <Text style={[main.regular, { fontFamily: fonts.medium }]} >{numFormatter(acheivedCoins, 1)}</Text>
                  </Row>
                </Flex>
              </Row>}


          </BoxView>
        </View>}

      <InfoModal ref={ref_info} />
    </View>
  )
}

export default MissionRewardView

const main = StyleSheet.create({
  heading: {
    fontSize: 16,
    color: colors.primary,
    fontFamily: fonts.bold
  },
  regular: {
    fontSize: 14,
    color: colors.white,
    fontFamily: fonts.regular
  }
})