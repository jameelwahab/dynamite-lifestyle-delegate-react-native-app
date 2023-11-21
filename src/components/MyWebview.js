import { Dimensions } from "react-native";
import RenderHTML, { HTMLContentModel, HTMLElementModel, defaultSystemFonts } from "react-native-render-html";
import { colors } from "../utilities/colors";
import { fonts } from "../utilities/fonts";



export default MyWebView = ({ html = "", width = Dimensions.get('window').width - 30 }) => {
  const fontElementModel = {
    "font": HTMLElementModel.fromCustomModel({
      tagName: 'font',
      contentModel: HTMLContentModel.mixed,
      getUADerivedStyleFromAttributes({ face, color, size }) {
        let style = {};
        if (face) {
          style.fontFamily = face;
        }
        if (color) {
          style.color = color;
        }
        if (size) {
          // handle size such as specified in the HTML4 standard. This value
          // IS NOT in pixels. It can be absolute (1 to 7) or relative (-7, +7):
          // https://www.w3.org/TR/html4/present/graphics.html#edef-FONT
          // implement your solution here
        }

        return style;
      },
    }),
    // "iframe": defaultHTMLElementModels.iframe.extend({
    //   contentModel: HTMLContentModel.block,
    //   isOpaque: true
    // })
  }
  return (
    <RenderHTML
      contentWidth={Dimensions.get("window").width / 1.5}
      source={{ html: "<div>" + html + "</div>" }}
      customHTMLElementModels={fontElementModel}
      enableExperimentalMarginCollapsing={true}
      tagsStyles={{
        a: {
          color: colors.white,
          textDecorationColor:  colors.white ,
          fontFamily: html.includes("<b>") ? undefined : fonts.regular,
          fontSize: 16,
        },
        div: {
          color:  colors.white ,
          fontFamily: html.includes("<b>") ? undefined : fonts.regular,
        },
      }}
      systemFonts={[...defaultSystemFonts, ...Object.values(fonts)]}
    />
  )
}