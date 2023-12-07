import { Dimensions } from "react-native";
import RenderHTML, { HTMLContentModel, HTMLElementModel, defaultSystemFonts } from "react-native-render-html";
import IframeRenderer, { iframeModel } from '@native-html/iframe-plugin';
import { colors } from "../utilities/colors";
import { fonts } from "../utilities/fonts";
import { Component } from "react";
import WebView from "react-native-webview";



export class MyWebview extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !(JSON.stringify(this.props) == JSON.stringify(nextProps))
  }


  renderers = {
    "iframe": IframeRenderer
  };
  customHTMLElementModels = {
    "iframe": iframeModel,
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

  }




  render() {
    let { html, style } = this.props;
    return (
      <RenderHTML
        WebView={WebView}
        contentWidth={Dimensions.get("window").width / 1.5}
        source={{ html: "<div>" + html + "</div>" }}
        customHTMLElementModels={this.customHTMLElementModels}
        renderers={this.renderers}
        enableExperimentalMarginCollapsing={true}
        enableExperimentalBRCollapsing={true}
        tagsStyles={{
          a: {
            color: colors.white,
            textDecorationColor: colors.white,
            fontFamily: this.props.html.includes("<b>") ? undefined : fonts.regular,
            fontSize: 16,
          },
          div: {
            color: colors.white,
            fontFamily: this.props.html.includes("<b>") ? undefined : fonts.regular,
          },
          ...style
        }}
        systemFonts={[...defaultSystemFonts, ...Object.values(fonts)]}
        renderersProps={{
          iframe: {
            // scalesPageToFit: true,
            webViewProps: {
              /* Any prop you want to pass to iframe WebViews */
            }
          }
        }}
      />
    )
  }
}

export default MyWebview;


