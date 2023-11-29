"use strict";
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Platform,
  TextInput,
  FlatList,
  TouchableHighlight,
  SafeAreaView,
  Pressable,
} from 'react-native';
import Modal from 'react-native-modal';
import { colors } from '../utilities/colors';
import { cross, icons, search } from '../utilities/icons';
import contriesList from "../assets/data/countryList.json"
import MyText from './MyText';
import { fonts } from '../utilities/fonts';


export default function CountryModal({ selectCountry = () => { }, isVisible, closeModal }) {
  const [searchText, setSearchText] = useState('');
  const [listData, setListData] = useState([])

  const searchInList = text => {
    setSearchText(text);
    if (text.trim() == '') {
      console.log("Check", "emprty")
      setListData(contriesList);
    } else {
      let filteredData = contriesList.filter(item => {
        return item.name
          .toLowerCase()
          .includes(text.toLowerCase().trim());
      });

      setListData(filteredData);
    }
  };

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        setListData(contriesList)
      }, 300);
    } else {
      setTimeout(() => {
        setListData([])
      }, 300);
    }

    return () => {
      setListData([])
    }
  }, [isVisible])


  const onSelectCountry = (country) => {
    closeModal()
    selectCountry(country);
    setSearchText("")
    setListData(contriesList)

  }


  return (
    <Modal
      isVisible={isVisible}
      onBackButtonPress={closeModal}
      onBackdropPress={closeModal}
      useNativeDriverForBackdrop={true}
      onModalHide={() => setSearchText("")}
      style={{ margin: 0 }}
      animationInTiming={300}
      animationOutTiming={300}
    >
      <SafeAreaView style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10, flex: 0.9, marginTop: "auto", backgroundColor: colors.secondary }}>

        <View style={ModalStyle.container}>

          <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 15, borderBottomWidth: 1 / 3, borderBottomColor: colors.lightText }}>
            <View>
              <MyText fontSize={18} type='medium' >Countries</MyText>
              <MyText color={colors.lightText} fontSize={12}>Select your country from list below</MyText>
            </View>
            <Pressable onPress={closeModal}>
              {icons.crosssWithCircle()}
            </Pressable>
          </View>
          {/* <View>
            <Pressable onPress={closeModal} style={{ alignSelf: "flex-end", marginRight: 10, marginBottom: 10 }}>
              {icons.crosssWithCircle()}
            </Pressable>
          </View> */}
          <View style={ModalStyle.searchView}>
            <View>
              {icons.search()}
            </View>
            <View style={{ flex: 1 }}>
              <TextInput
                value={searchText}
                onChangeText={searchInList}
                placeholder="Austrailia|Belgium"
                placeholderTextColor={colors.lightText}
                spellCheck={false}
                style={{ color: colors.text, paddingVertical: 12, marginLeft: 10, fontFamily: fonts.medium, includeFontPadding: false }}
                selectionColor={colors.black}
              />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={listData}
              maxToRenderPerBatch={50}
              keyboardShouldPersistTaps="handled"
              keyExtractor={(item, index) => {
                return index.toString();
              }}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    height: 0.7,
                    width: '100%',
                    alignSelf: 'center',
                    backgroundColor: '#B4B4B5',
                  }}
                />
              )}
              contentContainerStyle={{ paddingBottom: 30 }}
              renderItem={({ item, index }) => (
                <TouchableHighlight
                  underlayColor={colors.darkSecondary}
                  onPress={() => onSelectCountry(item)}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 15,
                      paddingHorizontal: 10,
                    }}>
                    <View>
                      {/* <SvgUri width={30} height={30} uri={item.image} /> */}
                      <MyText color={colors.disableText} >
                        {item.flag}
                      </MyText>
                    </View>
                    <View style={{ marginLeft: 10, flex: 1 }}>
                      <MyText fontSize={16} color={colors.text}>
                        {item.name}
                      </MyText>
                    </View>
                    <View>
                      <MyText fontSize={16} color={colors.text}>
                        {item.code}
                      </MyText>
                    </View>
                  </View>
                </TouchableHighlight>
              )}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const ModalStyle = StyleSheet.create({
  title: {
    fontSize: 24,
    color: colors.text,
    fontWeight: '500',
    textAlign: 'center',
  },
  modal: {
    margin: 0,
    marginTop: 'auto',
    flex: Platform.OS == 'android' ? 0.99 : 0.95,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  container: {
    flex: 1,
    paddingBottom: 10,
    paddingVertical: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  searchView: {
    flexDirection: 'row',
    backgroundColor: colors.secondaryVariant,
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom:10
  },
  flatlistItemText: {
    fontSize: 16,
    paddingVertical: 15,
    fontWeight: 'bold',
  },
});
