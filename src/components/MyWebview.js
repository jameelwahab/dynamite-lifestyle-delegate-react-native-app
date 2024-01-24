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
    let { html, style, baseStyle } = this.props;
    return (
      <RenderHTML
        WebView={WebView}
        contentWidth={this.props.fullWidth ? Dimensions.get("window").width - 40 : Dimensions.get("window").width / 1.5}
        source={{ html: "<div>" + html + "</div>" }}
        customHTMLElementModels={this.customHTMLElementModels}
        renderers={this.renderers}
        enableExperimentalMarginCollapsing={true}
        baseStyle={baseStyle}
        enableExperimentalBRCollapsing={true}
        enableExperimentalGhostLinesPrevention={true}
        tagsStyles={{
          a: {
            color: colors.white,
            textDecorationColor: colors.white,
            fontFamily: this.props.html.includes("<b>") ? undefined : fonts.regular,
            fontSize: 14,
            margin: 0,
          },
          div: {
            color: colors.white,
            fontFamily: this.props.html.includes("<b>") ? undefined : fonts.regular,
            // margin: 0,
            // padding: 0,
          },
          p: {
            margin: 0,
          },
          h1: {
            margin: 0
          },
          h2: {
            margin: 0
          },
          h3: {
            margin: 0
          },
          h4: {
            margin: 0
          },
          h5: {
            margin: 0
          },
          h6: {
            margin: 0
          },
          ...style
        }}
        systemFonts={[...defaultSystemFonts, ...Object.values(fonts)]}
        renderersProps={{
          iframe: {
            // scalesPageToFit: true,
            webViewProps: {
              cacheEnabled: false,
              startInLoadingState: true,
              scrollEnabled: false,
              allowsAirPlayForMediaPlayback: true,
              allowsInlineMediaPlayback: true,
              mediaPlaybackRequiresUserAction: true,
              allowsFullscreenVideo: true,
            }
          }
        }}
      />
    )
  }
}

export default MyWebview;


