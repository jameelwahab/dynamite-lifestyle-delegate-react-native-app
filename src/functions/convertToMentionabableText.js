import { Text } from "react-native";
import { colors } from "../utilities/colors"
import isArray from "./isArray";








export default convertToMentionabableText = (str, mentionList, links, keywords) => {
  let parts = [];
  let lastIndex = 0;
  let list = [...mentionList];
  if (isArray(keywords)) {
    keywords.forEach((link) => {
      list.push({
        ...link,
        isLink: false,
        isKeyword: true
      });
    });
    list.sort((a, b) => a.offset - b.offset);
  }

  if (links) {
    links.forEach((link) => {
      list.push({ offset: link.start, length: link.length, isLink: true, isKeyword: false });
    });
    list.sort((a, b) => a.offset - b.offset);
  }


  list.forEach(user => {
    let startIndex = user?.offset;
    let endIndex = user?.offset + user?.length
    if (lastIndex < startIndex) {
      parts.push({ text: str.slice(lastIndex, startIndex), highlight: false, isLink: false, isKeyword:false});
    }
    parts.push({
      text: str.substring(startIndex, endIndex),
      highlight: !user.isLink && !user?.isKeyword,
      isLink: user.isLink,
      isKeyword: user?.isKeyword
    });
    lastIndex = endIndex;
  });

  if (lastIndex < str.length) {
    parts.push({ text: str.slice(lastIndex), highlight: false, isLink: false });
  }

  return parts
}