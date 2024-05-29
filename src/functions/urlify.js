export default function urlify(text) {
  let newText = text;
  // let urlRegex = /(https?:\/\/[^\s]+)/g;
  let urlRegex = /(?<!\()\bhttps?:\/\/[^\s]+(?!\))/g
  if (urlRegex.test(text)) {
    try {
      newText = newText.replace(urlRegex, function (url) {
        if (!!url) {
          return `[${url}](${url})`;
        }
      })
      return newText;
    } catch (e) {
      return text
    }
  } else {

    return text
  }
}