import { Dimensions, Text, TouchableOpacity } from "react-native";
import RenderHTML, { HTMLContentModel, HTMLElementModel, defaultSystemFonts } from "react-native-render-html";
import IframeRenderer, { iframeModel } from '@native-html/iframe-plugin';
import { colors } from "../utilities/colors";
import { fonts } from "../utilities/fonts";
import { Component, useRef } from "react";
import WebView from "react-native-webview";
import { isUrl } from "../functions/regex";
import openUrl from "../functions/openUrl";
import { urlifyWithAchorTag } from "../functions/urlify";
import AudioPlayer from "./AudioPlayer";
import DeviceInfo from "react-native-device-info";



export class MyWebview extends Component {
  constructor(props) {
    super(props);
    this.state = {

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
    // "audio": (...params) => {

    //   console.log(params," audio props")

    //   return <View/>
    //   // const src = props?.tnode?.domNode?.children?.[0]?.attribs?.src;
    //   // return (
    //   //   <View style={{ marginVertical: 10 }}>
    //   //     <Text>Audio Player:</Text>
    //   //     {src ? (
    //   //       <AudioPlayer
    //   //         url={src}
    //   //       />
    //   //     ) : null}
    //   //   </View>
    //   // );
    // },


  }



  render() {
    let { html, style, baseStyle, spanColor, } = this.props;
    html = "<div>" + html.replace(/padding:/g, "") + "</div>";
    html = "<div>" + html.replace(/height:100%/g, "") + "</div>";

    // html = "<div>" + html.replace(/position:/g, "") + "</div>";
    return (
      <RenderHTML

        WebView={WebView}
        contentWidth={this.props.fullWidth ? Dimensions.get("window").width - 40 : !!this.props.width ? this.props.width : Dimensions.get("window").width / 1.5}
        source={{
          html: html,
          baseUrl: ""
        }}
        customHTMLElementModels={this.customHTMLElementModels}
        renderers={this.renderers}
        enableExperimentalMarginCollapsing={true}
        baseStyle={baseStyle}
        enableExperimentalBRCollapsing={true}
        // ignoredStyles={["padding"]}
        enableExperimentalGhostLinesPrevention={true}
        tagsStyles={{
          a: {
            color: colors.primary,
            textDecorationColor: colors.primary,
            fontFamily: this.props.html.includes("<b>") ? undefined : fonts.regular,
            fontSize: 16,
            margin: 0,
          },
          div: {
            color: this.props?.invert ? colors.black : colors.white,
            fontFamily: this.props.html.includes("<b>") ? undefined : fonts.regular,
            margin: 0,
            // padding: 0,
          },

          span: {
            fontFamily: !!this.props?.html.includes("<b>") ? undefined : fonts.light,
            margin: 0,
            // marginTop: 5,
            lineHeight: 12,
            fontSize: 13,
            color: this.props?.invert ? colors.black : colors.lightText,
          },
          p: {
            margin: 0,
            fontSize: 13,
            marginTop: 5,
            lineHeight: 20,
            color: this.props?.invert ? colors.black : colors.lightText,
          },

          
          ol: {
            margin: 0,
            marginTop: 5,
            fontFamily: fonts.regular,
            lineHeight: 20,
            fontSize: 13,
            fontWeight: Platform.OS == "android" ? "normal" : undefined,
            color: this.props?.invert ? colors.black : colors.lightText,
            // textAlign: "center"
          },
          ul: {
            margin: 0,
            marginTop: 5,
            fontFamily: fonts.regular,
            lineHeight: 20,
            fontSize: 13,
            fontWeight: Platform.OS == "android" ? "normal" : undefined,
            color: this.props?.invert ? colors.black : colors.lightText,
            // textAlign: "center"
          },
          h1: {
            margin: 0,
            marginTop: 5,
            color: this.props?.invert ? colors.black : colors.primary,
            fontWeight: Platform.OS == "android" ? "normal" : undefined,
            fontFamily: fonts.bold,
          },
          h2: {
            margin: 0,
            color: colors.primary,
            marginTop: 5,
            fontSize: 18,
            fontWeight: Platform.OS == "android" ? "normal" : undefined,
            fontFamily: fonts.bold,
          },
          h3: {
            margin: 0,
            marginTop: 5,
            fontSize: 16,
            fontFamily: fonts.bold,
            fontWeight: Platform.OS == "android" ? "normal" : undefined,
            color: this.props?.invert ? colors.black : colors.primary,
          },
          h4: {
            margin: 0,
            marginTop: 5,
            fontSize: 14,
            fontFamily: fonts.medium,
            fontWeight: Platform.OS == "android" ? "normal" : undefined,
            color: this.props?.invert ? colors.black : colors.white,
          },
          h5: {
            margin: 0,
            marginTop: 5,
            fontSize: 12,
            fontFamily: fonts.medium,
            fontWeight: Platform.OS == "android" ? "normal" : undefined,
            color: this.props?.invert ? colors.black : colors.white,
          },
          h6: {
            margin: 0,
            marginTop: 5,
            fontSize: 10,
            fontFamily: fonts.medium,
            fontWeight: Platform.OS == "android" ? "normal" : undefined,
            color: this.props?.invert ? colors.black : colors.white,
          },
          strong: {

            fontFamily: fonts.bold,
            fontWeight: Platform.OS == "android" ? "normal" : undefined,

          },
          b: {
            fontFamily: fonts.bold,
            fontWeight: Platform.OS == "android" ? "normal" : undefined,
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
            required: {
              fontFamily: fonts.regular,
              lineHeight: 20,
              fontSize: 16,
              color: colors.delete,
            },
            question: {
              fontFamily: fonts.regular,
              lineHeight: 20,
              fontSize: 16,
              color: colors.primary2,
            }
          // "seeMoreBtn":{
          //   color:colors.primary
          // }
        }}
        systemFonts={[...defaultSystemFonts, ...Object.values(fonts)]}
        renderersProps={{
          iframe: {
            // scalesPageToFit: true,
            javaScriptEnabled: true,
            webViewProps: {
              cacheEnabled: false,
              startInLoadingState: false,
              scrollEnabled: false,
              allowsAirPlayForMediaPlayback: true,
              allowsInlineMediaPlayback: true,
              // mediaPlaybackRequiresUserAction: true,
              allowsFullscreenVideo: true,
              // javaScriptEnabled: true,
              // sharedCookiesEnabled:true,
              // applicationNameForUserAgent:'DemoApp/1.1.0'
            }

          }
        }}
      />
    )
  }
}

export default MyWebview;


