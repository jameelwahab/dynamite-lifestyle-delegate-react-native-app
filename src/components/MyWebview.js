import { Dimensions, Text, TouchableOpacity } from "react-native";
import RenderHTML, { HTMLContentModel, HTMLElementModel, defaultSystemFonts } from "react-native-render-html";
import IframeRenderer, { iframeModel } from '@native-html/iframe-plugin';
import { colors } from "../utilities/colors";
import { fonts } from "../utilities/fonts";
import { Component } from "react";
import WebView from "react-native-webview";
import { isUrl } from "../functions/regex";
import openUrl from "../functions/openUrl";
import { urlifyWithAchorTag } from "../functions/urlify";
import AudioPlayer from "./AudioPlayer";



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
    let { html, style, baseStyle } = this.props;
    html = "<div>" + html.replace(/padding/g, "") + "</div>";

    return (
      <RenderHTML
        WebView={WebView}
        contentWidth={this.props.fullWidth ? Dimensions.get("window").width - 40 : !!this.props.width ? this.props.width : Dimensions.get("window").width / 1.5}
        source={{ html: html }}
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


