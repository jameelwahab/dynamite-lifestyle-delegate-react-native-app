import { Text } from "react-native";
import { colors } from "../utilities/colors"








export default convertToMentionabableText = (str, mentionList, links) => {
  let parts = [];
  let lastIndex = 0;
  let list = [...mentionList]
  if (links) {
    links.forEach((link) => {
      list.push({ offset: link.start, length: link.length, isLink: true });
    });
    list.sort((a, b) => a.offset - b.offset);
  }

  list.forEach(user => {
    let startIndex = user?.offset;
    let endIndex = user?.offset + user?.length
    if (lastIndex < startIndex) {
      parts.push({ text: str.slice(lastIndex, startIndex), highlight: false, isLink: false });
    }
    parts.push({ text: str.substring(startIndex, endIndex), highlight: !user.isLink, isLink: user.isLink  });
    lastIndex = endIndex;
  });

  if (lastIndex < str.length) {
    parts.push({ text: str.slice(lastIndex), highlight: false, isLink: false });
  }

  return parts
}