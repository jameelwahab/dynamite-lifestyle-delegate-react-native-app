import { Linking } from 'react-native'

export default function openUrl(link) {
  console.log(link,'link')
  try {
    if (!!link) {
      if (!link.includes("http:") && !link.includes("https:")) {
        link = "https://" + link;
      } else if (link.includes("http:")) {
        link = link.replace("http:", "https:")
      }
      Linking.openURL(link)
    } else {
      throw new Error("Link Empty")
    }
  } catch (e) {
    console.log(e, "error opening URL")
  }
}