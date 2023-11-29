import { View, SafeAreaView, FlatList, Pressable, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { GAMES_LIST_WITHOUT_TOKEN } from '../DAL';
import MyText from './MyText';
import { MyButton } from './MyButton';
import MyLoader from './MyLoader';
import Modal from 'react-native-modal';
import { colors } from '../utilities/colors';
import MyRefreshControl from './MyRefreshControl';
import MyImage from './MyImage';
import { S3_URL } from '../utilities/constants';
import { check, cross } from '../utilities/icons';

const GameModal = ({ isVisible, closeModal, selectGame, value, multiple = false }) => {
  const [state, updateState] = useState({
    sportsList: [],
    modalLoading: false,
    refreshing: false,
    data: null,
    selectedSport: null,
  })
  const setData = (updation) => updateState({ ...state, ...updation })


  const api_gameslist = async () => {
    let res = await GAMES_LIST_WITHOUT_TOKEN();
    if (res.code == 200) {
      setData({
        sportsList: res.game,
        modalLoading: false,
        refreshing: false,
        selectedSport: value 
      })
    } else {
      setData({ modalLoading: false })
    }
  }

  const closeSportModal = () => {

  }

  const isGameSelected = (game) => {
    if (Array.isArray(state.selectedSport)) {
      let index = state.selectedSport.findIndex(x => x?._id == game?._id);
      if (index > -1) {
        return true
      } else {
        return false
      }
    } else {
      return state.selectedSport?._id == game?._id
    }
  }

  const selectGamefunc = (game) => {
    if (Array.isArray(state.selectedSport)) {
      let index = state.selectedSport.findIndex(x => x._id == game._id);
      if (index > -1) {
        state.selectedSport.splice(index, 1);
      } else {
        state.selectedSport.push(game);
      }
      setData({ selectedSport: state.selectedSport });
    } else {
      if (game._id == state.selectedSport?._id) {
        selectGame(null);
      } else {
        selectGame(game);
      }
      closeModal()
    }
  }

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        setData({ modalLoading: true,})
        api_gameslist()
      }, 500);
    
    } else {
      setData({ sportsList: [] })
    }
  }, [isVisible])


  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={closeSportModal}
      onBackdropPress={closeSportModal}
      useNativeDriverForBackdrop={true}
      style={{ margin: 0 }}
      animationInTiming={300}
      animationOutTiming={300}
    >
      <SafeAreaView style={{ flex: 0.9, marginTop: "auto" }} >
        <View style={{ flex: 1, backgroundColor: colors.modalBackgroud }}>

          <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10, paddingHorizontal: 10 }} >
            <MyText fontSize={20} type="bold" style={{ flex: 1 }} >Choose Sports</MyText>
            <Pressable onPress={closeModal} style={{ height: 25, width: 25, backgroundColor: colors.darkGrey, alignSelf: "flex-end", borderRadius: 25 / 2, alignItems: "center", justifyContent: "center", }}>
              <Image source={cross} style={{ height: 15, width: 15, }} />
            </Pressable>
          </View>
          <View style={{ flex: 1 }}>
            <FlatList
              refreshControl={
                <MyRefreshControl
                  refreshing={state.refreshing}
                  onRefresh={() => {
                    setData({ refreshing: true })
                    api_gameslist()
                  }}
                />}
              data={state.sportsList}
              renderItem={({ item, index }) => {
                return (
                  <Pressable
                    onPress={() => selectGamefunc(item)}
                    style={{
                      padding: 8,
                      margin: 2,
                      backgroundColor: isGameSelected(item) ? colors.white : undefined,
                      flexDirection: "row", alignItems: "center",
                      borderRadius: 10,
                      marginHorizontal: 10
                    }}>
                    <MyImage
                      source={{ uri: S3_URL + item.image }}
                      style={{ height: 45, width: 45, }}
                      imageStyle={{ borderRadius: 45 / 2 }}
                    />
                    <View style={{ flex: 1, marginLeft: 10 }} >
                      <MyText color={isGameSelected(item) ? colors.black : undefined} fontSize={16} type="medium" >{item.title}</MyText>
                    </View>
                    {isGameSelected(item) && (
                      <Image
                        source={check}
                        style={{ height: 30, width: 30 }}
                      />
                    )}
                  </Pressable>
                )
              }}
            />
          </View>
          {multiple &&
            <View style={{ padding: 10 }}>
              <MyButton title='SAVE'
                onPress={() => {
                  selectGame(state.selectedSport);
                }} />
            </View>
          }

        </View>

        <MyLoader enable={state.modalLoading} />
      </SafeAreaView>
    </Modal>
  )

}

export default GameModal