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

export function urlifyWithAchorTag(text) {
  var urlRegex = /(https?:\/\/[^\s]+)/g;

  return text.replace(urlRegex, function (url) {
    var hyperlink = url;
    if (!hyperlink.match("^https?://")) {
      hyperlink = "http://" + hyperlink;
    }
    return (
      '<a class="click-able-link" target="_blank" href="' +
      url +
      '" rel="noopener" noreferrer>' +
      url +
      "</a>"
    );
  });
}