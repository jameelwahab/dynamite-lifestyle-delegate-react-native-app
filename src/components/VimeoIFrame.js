import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { Vimeo } from 'react-native-vimeo-iframe';
import invokeApi from '../functions/invokeAPI';
import { colors } from '../utilities/colors';



export class VimeoIFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      loaded: false
    }
  }
  async componentDidMount() {
    let id = await this.getVimeoId(this.props.url)
    this.setState({ id: id })
  }



  async getVimeoId(url) {
    try {
      let res = await invokeApi({
        path: "https://vimeo.com/api/oembed.json?url=" + url,
        excludeBaseURL: true,
        showConsole: false,
      });


      return res?.video_id;
    } catch (e) {
    }
  }

  render() {
    const runFirst = `
    document.body.style.backgroundColor = "${colors.darkSecondary}";
  `;
    return (
      <View style={{ height: 230, backgroundColor: colors.darkSecondary, marginTop: 15 }}>
        {this.state.id &&
          <Vimeo
            videoId={this.state.id}
            injectedJavaScript={runFirst}
            allowsInlineMediaPlayback={true}
            allowsFullscreenVideo={true}
            otherProps={{
              style: {
                backgroundColor: colors.darkSecondary,
              },
              containerStyle: {
                backgroundColor: colors.darkSecondary,
              }
            }}
          />

        }
      </View>
    )
  }
}

export default VimeoIFrame