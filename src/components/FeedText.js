import { View, Text, Linking, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import ParsedText from 'react-native-parsed-text';
import { colors } from '../utilities/colors';
import convertToMentionabableText from '../functions/convertToMentionabableText';
import MyText from './MyText';
import openUrl from '../functions/openUrl';
import { fonts } from '../utilities/fonts';


const FeedText = ({ text, list }) => {
  const [isSeeMoreActive] = useState(text.length > 150)
  const [isSeeMoreEnable, setSeeMoreEnable] = useState(true);


  const findLinks = (text) => {
    const linkRegex = /(?<!\()\bhttps?:\/\/[^\s]+(?!\))/g
    const links = [];
    let match;
    while ((match = linkRegex.exec(text)) !== null) {
      links.push({ start: match.index, length: match[0].length });
    }
    return links;
  };



  let nText = "";
  if (isSeeMoreActive) {
    if (isSeeMoreEnable) {
      nText = text.slice(0, 150);
    } else {
      nText = text
    }
  } else {
    nText = text
  }


  const links = findLinks(nText);
  const parts = convertToMentionabableText(nText, list, links);

  return (
    <MyText >
      {parts.map((part, index) => {
        if (part.isLink) {
          return (
            <Text key={index}
              onPress={() => openUrl(part.text)}
              style={{ color: colors.primary, textDecorationLine: "underline" }}>{part.text}</Text>
          );
        }
        return (
          <Text key={index} style={{ color: part.highlight ? colors.primary : colors.white }}>
            {part.text}
          </Text>
        )
      })}
      {isSeeMoreActive &&
        <Text>{isSeeMoreEnable && "... "}
          <Text
            onPress={() => setSeeMoreEnable((val) => !val)}
            style={{
              color: colors.primary,
              fontFamily: fonts.medium
            }} >{isSeeMoreEnable ? "See More" : " See Less"}</Text>
        </Text>}
    </MyText>
  )
}

export default FeedText