import { View, Text } from 'react-native'
import React from 'react'
import routes from '../navigation/routes';
import notifee from '@notifee/react-native';

const notificationHandler = (remoteMessage, navigation, navbar) => {
  let { data } = remoteMessage;
  console.log(remoteMessage, "notificationHandler")
  if (feedType.includes(data?.type)) {
    let navigator = "";
    if (data?.feed_tab == "the_cosmos" && !!navbar.find(x => x.value == "the_cosmos")) {
      navigator = routes.feedNavigator;
    }
    else if (data?.feed_tab == "the_source") {
      if (!!navbar.find(x => x.value == "all_source_feed"))
        navigator = routes.allSourcesFeedNavigator;
      else if (!!navbar.find(x => x.value == "the_source_feed"))
        navigator = routes.sourceFeedNavigator;
    }
    console.log(navigator, "navigator")
    if (!!navigator) {
      let params = { feedId: data?.feed_id };
      if (data?.type == "addcomment" || data?.type == "addcommentreply" || data?.type == "commentlike") {
        params["openCommentModal"] = true;
      }
      navigation.reset({
        routes: [{
          name: routes.mainScreen,
          state: {
            routes: [{
              name: navigator,
              state: {
                routes: [{
                  name: routes.feedScreen,
                },
                {
                  name: routes.feedDetailScreen,
                  params: params
                }],
              }
            }],
          }
        }]
      })
    }

  }
  else if (data?.type == "message" && !!navbar.find(x => x.value == "chat")) {
    let profile = JSON.parse(data?.sender_info)
    navigation.reset({
      routes: [{
        name: routes.mainScreen,
        state: {
          routes: [{
            name: routes.chatNavigator,
            state: {
              routes: [
                //   {
                //   name: routes.chatList,
                // },
                {
                  name: routes.chatMessageList,
                  params: {
                    chatId: data?.chat_id,
                    isOnline: profile?.is_online,
                    memberId: profile?.action_id,
                    firstName: profile?.name,
                    lastName: "",
                    lastSeen: "",
                    profileImage: profile?.profile_image,
                  }
                }],
            }
          }],
        }
      }]
    })
  }
  else if (SupportTicketType.includes(data?.type)) {
    let navigator = "";
    let nestedNavigator = "";
    let params = {
      ticket: { _id: data?.support_ticket },
    }

    if (data?.type == "support_ticket_comment") {
      params["tab"] = 1
    } else if (data?.type == "close_support_ticket") {
      params["route"] = "solved"
    }

    if (data?.support_ticket_tab == "contact_support" && !!navbar.find(x => x.value == "support")?.child_options.find(x => x.value == "contact_support")) {
      navigator = routes.contactSupportNavigator;
      nestedNavigator = routes?.ticketList
      params["isMine"] = true;
    } else if (data?.support_ticket_tab == "internal_ticket" && !!navbar.find(x => x.value == "internal-tickets")) {
      navigator = routes.internalTicketNavigator;
      nestedNavigator = routes?.supportTicketList
    } else if (data?.support_ticket_tab == "support_ticket" && !!navbar.find(x => x.value == "support_ticket")) {
      navigator = routes.supportTicketNavigator;
      nestedNavigator = routes?.supportTicketList
    }

    if (navigator != "" && nestedNavigator != "") {
      navigation.reset({
        routes: [{
          name: routes.mainScreen,
          state: {
            routes: [{
              name: navigator,
              state: {
                index: 1,
                routes: [{
                  name: nestedNavigator,
                },
                {
                  name: routes.supportTicketDeatail,
                  params: params
                }
                ],
              }
            }],
          }
        }]
      })
    }
  }
  notifee.decrementBadgeCount();
}

export default notificationHandler;
const feedType = ["commentlike", "addcomment", "feedlike", "gratitude", "addcommentreply"];
const SupportTicketType = ["send_support_ticket_reminder", "close_support_ticket", "support_ticket_comment", "add_support_ticket"];