import { Linking } from 'react-native'

export default function openUrl(link) {
  try {
    console.log('HI')
    if (!link.includes("http:") && !link.includes("https:")) {
      console.log(link,"link")
      link = "https://" + link;
    } else if (link.includes("http:")) {
      link = link.replace("http:", "https:")
    }
    console.log(link,"link")
    Linking.openURL(link)
  } catch (e) {
    console.log(e, "error opening URL")
  }
}