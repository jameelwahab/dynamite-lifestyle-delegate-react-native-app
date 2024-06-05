import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import countriesList from '../assets/data/countryList.json'
import { parsePhoneNumber } from 'libphonenumber-js'
import moment_timezone from 'moment-timezone'
import CountryModal from './CountryModal'
import { colors } from '../utilities/colors'
import MyText from './MyText'
import { icons } from '../utilities/icons'
import { fonts } from '../utilities/fonts'

// const ic_down = require('../assets/down2.png')
const PhoneInput = ({ placeholder = "", label, value, onChange, onCountryChange, hideArrow = false, userCountry, selectCounrtyCode }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState(countriesList[0]);
  const [isCountryPickterVisible, setIsCountryPickterVisible] = useState(false);
  useEffect(() => {
    if (!!value) {
      try {
        let phone = value
        if (!phone.includes("+")) {
          phone = "+" + phone
        }
        let parsed = parsePhoneNumber(phone);
        setPhoneNumber(parsed?.nationalNumber);
        setCountry(countriesList.find(country => country.dial_code == "+" + parsed?.countryCallingCode))
      } catch (e) {
        console.log(e, "error parsing phone number")
        if (!!userCountry) {
          getByCountry()
        } else {
          getByTimeZone()
        }
      }
    } else if (!!userCountry) {
      getByCountry()
    } else {
      getByTimeZone()
    }
  }, [])

  const getByCountry = () => {
    let userC = countriesList.find(country => country.name.toLowerCase() == userCountry?.toLowerCase());
    if (!!userC)
      setCountry(userC)
  }

  const getByTimeZone = () => {
    let countryName = moment_timezone.tz.guess(true);
    let countyCode = moment_timezone.tz.zone(countryName).countries();
    let countryByMoment = ""
    if (!!countyCode[0]) {
      countryByMoment = countriesList.find(x => x.code == countyCode[0]);
      setCountry(countryByMoment)
    }
  }


  useEffect(() => {
    if (!!selectCounrtyCode) {
      setCountry(selectCounrtyCode)
    }
  }, [selectCounrtyCode])
  return (
    <View>
      <Text style={__styles.labelText}>{label}</Text>
      <View style={__styles.touchableInputView}>

        <TouchableOpacity
          onPress={() => setIsCountryPickterVisible(true)}
          style={__styles.countryView}>
          <MyText type='M' >{`${country?.flag} ${country?.dial_code}`}</MyText>
          {/* <Image source={ic_down} style={{ height: 15, width: 15, marginLeft: 5, tintColor: hideArrow ? colors.tranparent : colors.white }} /> */}
          {icons.down()}
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <TextInput
            value={phoneNumber}
            onChangeText={(text) => {
              setPhoneNumber(text)
              if (text == "") {
                onChange("")
              } else {
                onChange?.(country?.dial_code.replace("+", "") + text)
              }
            }}
            style={__styles.inputTouchableText}
            selectionColor={colors.white}
            placeholder={placeholder}
            keyboardType="phone-pad"
            autoCapitalize={"none"}
            keyboardAppearance="dark"
            autoCorrect={false}
            autoComplete="off"
            maxLength={17}
          />
        </View>
      </View>
      <CountryModal
        isVisible={isCountryPickterVisible}
        selectCountry={(country1) => {
          setCountry(country1)
          onChange?.(country1?.dial_code.replace("+", "") + phoneNumber)
          onCountryChange?.(country1)
        }}
        closeModal={() => setIsCountryPickterVisible(false)}
        showCountryCode
      />
    </View>
  )
}

export default PhoneInput
const __styles = StyleSheet.create({
  touchableInputView: {
    height: 45,
    borderWidth: 1,
    borderColor: colors.lightText,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15
  },
  labelText: {
    fontFamily: fonts.regular,
    includeFontPadding: false,
    color: colors.lightText,
    marginBottom: 5,
    marginLeft: 2,
  },
  inputTouchableText: {

    borderRadius: 5,
    color: colors.white,
    fontFamily: fonts.medium,
    flex: 1

  },
  countryView: {
    height: 40,
    width: 90,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    // backgroundColor:"pink"

  }

})