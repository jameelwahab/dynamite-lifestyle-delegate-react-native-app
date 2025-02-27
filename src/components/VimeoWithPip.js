import React, { Component, createRef } from 'react';
import { AppState, ActivityIndicator, View, Platform, Image, Text, Pressable, ImageBackground, } from 'react-native';
import { NativeModules } from 'react-native';
import Video from 'react-native-video';
import { icons } from '../utilities/icons';
import { colors } from '../utilities/colors';
import invokeApi from '../functions/invokeAPI';
import extractVimeoData from '../functions/extractVimeoData';
import isObject from '../functions/isObject';


const { PipModule } = NativeModules;

export default class VimeoWithPip extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      videoUrl: "",
      canPlay: false,
      poster: "",
      controls: false,
      started: false,
      paused: true,
      error: false,
      isInPipMode: false,
      haveToSeek: false
    }

    this.isPlaying = false;
    this.playedTime = 0;
    this.totalTime = 0;
    this.firstTime = true;
    this.player = createRef();
    this.stateEvent = null;
  }

  componentDidMount() {
    this.stateEvent = AppState.addEventListener("change", (appstate) => {
      // return
      if (Platform.OS === "android" && !!this.player) {
        if (appstate == "background" && this.isPlaying) {
          this.setState({ isInPipMode: true });
          this.player?.current?.presentFullscreenPlayer?.();
          PipModule.enterPipMode();

        } else if (appstate == "active" && this.state.isInPipMode) {
          setTimeout(() => {
            this.setState({ isInPipMode: false });
            try {
              this.player?.current?.dismissFullscreenPlayer?.();
            } catch (e) {
            }

          }, 500);

        }
      }
    })

    this.getLink()


  }



  getLink = async () => {

    let Id = await this.getVimeoId(this.props.url)

    if (!!Id) {
      try {
        // let res = await fetch(`https://player.vimeo.com/video/${Id}`);
        let res = await invokeApi({
          path: `https://player.vimeo.com/video/${Id}`,
          excludeBaseURL: true,
        })
        let data = await extractVimeoData(res);
        console.log("data:", data.request.files.hls.cdns[data.request.files.hls.default_cdn].url, data)
        this.setState({
          videoUrl: data.request.files.hls.cdns[data.request.files.hls.default_cdn].url,
          poster: isObject(data.video.thumbs) ? data.video.thumbs['640'] : !!data?.thumbnail_url ? data?.thumbnail_url : !!data?.video?.thumbnail_url ?data?.video?.thumbnail_url : ""
        })

      } catch (e) {
        console.log(e, "Vimer Error")
        this.setState({ loading: false, error: true })
      }


    }
  }

  async getVimeoId(url) {

    try {
      let res = await invokeApi({
        path: "https://vimeo.com/api/oembed.json?url=" + encodeURIComponent(url),
        excludeBaseURL: true,
        // showConsole: false
      });

      return res?.video_id;
    } catch (e) {

    }
  }

  componentWillUnmount() {
    // if (this.stateEvent) {
    //   this.stateEvent.remove()
    // }
    // if (this.isPlaying) {
    //   this.sendTheTimeToServer()
    // }

  }

  sendTheTimeToServer() {
    if (this.playedTime > 0 && !!this.props.id) {
      let obj = {
        is_complete: this.playedTime >= this.totalTime ? true : false,
        recording_id: this.props.id,
        total_video_duration: !!this.props?.totalDuration && !!this.props?.totalDuration != "00:00" ? this.props?.totalDuration : this.totalTime.toString(),
        type: this.props.type,
        video_duration: this.playedTime.toString(),
      };
      this.storeTime(obj)
    }
  }


  componentDidUpdate(prevProp) {
    if (prevProp.focused == true && this.props.focused == false) {
      this.setState({ started: false })
    }
  }




  render() {
    return (
      <View
        style={{
          minHeight: !this.state.isInPipMode ? 260 : undefined,
          flex: this.state.isInPipMode ? 1 : undefined,
          position: this.state.isInPipMode ? "absolute" : "relative",
          marginHorizontal: Platform.OS == "ios" ? -20 : 0
        }}>
        <View style={{ flex: 1 }}>
          {((!!this.state.videoUrl && Platform.OS == "ios") || (Platform.OS == "android" && this.props.focused && !!this.state.videoUrl)) ?
            <Video
              useTextureView={false}
              key={!!this.props.id ? this.props.id : null}
              source={{ uri: this.state.videoUrl }}   // Can be a URL or a local file.
              ref={this.player}
              poster={!!this.props.noPoster == false && this.state.poster}
              paused={(this.props.focused && Platform.OS == "android") ? !this.state.started : Platform.OS == "ios" ? !this.state.started : true}
              onError={this.videoError}
              playInBackground={true}
              resizeMode='cover'
              ignoreSilentSwitch="ignore"
              allowsExternalPlayback={true}
              pictureInPicture={!!this.props.pip ? this.props.pip : true}
              controls={Platform.OS == "android" ? true : true}
              onReadyForDisplay={(res) => {
                this.setState({ loading: false })
                // if (this.firstTime) {
                //   this.firstTime = false
                //   if (Number(this.props.startFrom) > 0) {
                //     this.player?.current?.seek((this.props.startFrom - 1))
                //   }
                //   this.setState({ loading: false })
                // } else if (this.state.haveToSeek && Platform.OS == "android") {
                //   this.setState({ haveToSeek: false })
                //   if (Number(this.playedTime) > 0) {
                //    
                //     this.player?.current?.seek((this.playedTime - 1))
                //   }
                // }
              }}

              onPlaybackStateChanged={(e) => {
                this.isPlaying = e.isPlaying;
                // if (!e.isPlaying) {
                //   this.sendTheTimeToServer();
                // }
              }}



              onProgress={(res) => {
                this.playedTime = res?.currentTime.toFixed(2);
                this.totalTime = res?.seekableDuration;
              }}




              // Store reference         // Callback when video cannot be loaded
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,

              }} />

            : this.state.error &&
            <View style={{ flex: 1, backgroundColor: "#000", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 20, color: "#FFF", fontWeight: "600" }} >Sorry</Text>
              <Text style={{ fontSize: 16, color: "#FFF" }} > This video does not exist</Text>
            </View>}


          {this.state.loading ?
            <ActivityIndicator color={"#FFF"} style={{
              position: 'absolute',
              backgroundColor: "black",
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            }} /> :
            !this.state.started && this.state.error == false &&
            <Pressable
              onPress={() => {
                this.setState({ started: true, controls: true, paused: false });
              }}
              style={{
                position: 'absolute',
                // alignItems: "center",
                // justifyContent: "center",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                zIndex: 3
              }} >

              <ImageBackground style={{ flex: 1, alignItems: "center", justifyContent: "center", }} source={{ uri: this.state.poster }} >
                <View style={{ height: 50, width: 50, borderRadius: 25, backgroundColor: "#FFF" }}>
                  {/* <Image style={{ height: 50, width: 50, tintColor: colors.golden }} source={ic_playButton} /> */}
                  {icons.playCircle(colors.primary, 50)}
                </View>
              </ImageBackground>

            </Pressable>
          }


        </View>
      </View>



    )
  }

  onBuffer = (buffer) => {

  }
  videoError = (err) => {

    this.setState({ loading: false })
  }

  // storeTime = async (obj) => {
  //   let { token } = await getDataFromlocalStorage();
  //   await invokeApi({
  //     path: "api/member/activity/video_activity",
  //     method: "POST",
  //     postData: obj,
  //     headers: {
  //       'x-sh-auth': token
  //     }
  //   })
  // }
}