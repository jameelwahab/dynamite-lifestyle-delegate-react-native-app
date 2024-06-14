import { Dimensions, TouchableOpacity } from "react-native";
import RenderHTML, { HTMLContentModel, HTMLElementModel, defaultSystemFonts } from "react-native-render-html";
import IframeRenderer, { iframeModel } from '@native-html/iframe-plugin';
import { colors } from "../utilities/colors";
import { fonts } from "../utilities/fonts";
import { Component } from "react";
import WebView from "react-native-webview";
import { isUrl } from "../functions/regex";
import openUrl from "../functions/openUrl";
import { urlifyWithAchorTag } from "../functions/urlify";



export class MyWebview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: true,
      collapedEnabled: !!this.props?.enableCollapse,
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return ((JSON.stringify(this.props) != JSON.stringify(nextProps)) || this.state.isCollapsed != nextState.isCollapsed)
  }


  renderers = {
    "iframe": IframeRenderer,

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

  toggleCollapse = (event, href) => {
    console.log("toggleCollapse", event.currentTarget, href, isUrl(href))
    if (isUrl(href)) {
      openUrl(href)
    } else {
      console.log(this.state.isCollapsed, "this.state.isCollapsed ")
      this.setState({ isCollapsed: !this.state.isCollapsed });
    }
  }


  onPress(event, href) {
    Alert.alert(`You just pressed ${href}`);
  }


  renderersProps = {
    a: {
      onPress: this.onPress
    }
  };

  render() {
    console.log(this.state.collapedEnabled)
    let { html, style, baseStyle } = this.props;
    html = urlifyWithAchorTag(html);
    html = "<div>" + html.replace(/padding/g, "") + "</div>";
    let ammededHtml = (this.state.collapedEnabled && html.length > 150) ?
      this.state.isCollapsed ?
        html.slice(0, 150) + " ..." + `<a href='see'> See More </a>`
        : html + "<a href='see' > See Less </a>" :
      html;

    return (
      <RenderHTML
        WebView={WebView}
        contentWidth={this.props.fullWidth ? Dimensions.get("window").width - 40 : !!this.props.width ? this.props.width : Dimensions.get("window").width / 1.5}
        source={{ html: ammededHtml }}
        customHTMLElementModels={this.customHTMLElementModels}
        renderers={this.renderers}
        enableExperimentalMarginCollapsing={true}
        baseStyle={baseStyle}
        enableExperimentalBRCollapsing={true}
        enableExperimentalGhostLinesPrevention={true}
        tagsStyles={{
          a: {
            color: colors.primary,
            textDecorationColor: colors.primary,
            fontFamily: this.props.html.includes("<b>") ? undefined : fonts.regular,
            fontSize: 14,
            margin: 0,
          },
          div: {
            color: colors.white,
            fontFamily: this.props.html.includes("<b>") ? undefined : fonts.regular,
            margin: 0,
            // padding: 0,
          },
          p: {
            margin: 0,
          },
          h1: {
            margin: 0
          },
          h2: {
            margin: 0,
            color: colors.primary
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
          img: {
            marginTop: 5,
          },
          ...style
        }}
        classesStyles={{
          "mentioned-name": {
            color: colors.primary
          },
          // "seeMoreBtn":{
          //   color:colors.primary
          // }
        }}
        systemFonts={[...defaultSystemFonts, ...Object.values(fonts)]}
        renderersProps={{
          a: {
            onPress: (event, href) => {
              if (isUrl(href)) {
                openUrl(href)
              } else {
                console.log(this.state.isCollapsed, "this.state.isCollapsed ")
                this.setState({ isCollapsed: !this.state.isCollapsed });
              }
            }
          },
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
            },

          }
        }}
      />
    )
  }
}

export default MyWebview;


