import { View, Text } from 'react-native'
import React from 'react'
import routes from '../navigation/routes';
import notifee from '@notifee/react-native';

const notificationHandler = (remoteMessage, navigation, navbar) => {
  let { data } = remoteMessage;
  if (feedType.includes(data?.type)) {
    let navigator = "";
    if ((data?.feed_tab == "the_cosmos" || data.type == "feed_mentioned") && !!navbar.find(x => x.value == "the_cosmos")) {
      navigator = routes.feedNavigator;
    } else if (data?.tab_type == "event") {
      navigator = routes.portalNavigator;
    } else if (data?.tab_type == "program") {
      navigator = routes.trainingNavigator;
    } else if (data?.tab_type == "mission") {
      navigator = routes.missionNavigator;
    } else {
      if (!!navbar.find(x => x.value == "all_source_feed"))
        navigator = routes.allSourcesFeedNavigator;
      else if (!!navbar.find(x => x.value == "the_source_feed"))
        navigator = routes.sourceFeedNavigator;
    }
    if (!!navigator) {
      let params = { feedId: data?.feed_id };
      if (data?.tab_type == "event") {
        params["eventId"] = data?.event_id
        params["feedFor"] = "event"
      } else if (data?.tab_type == "program") {
        params["eventId"] = data?.event_id
        params["feedFor"] = "event"
      } else if (data?.tab_type == "mission") {
        params["eventId"] = data?.module_id
        params["feedFor"] = "mission"
      }

      if (data?.type == "addcomment" || data?.type == "addcommentreply" || data?.type == "commentlike" || data?.type == 'feed_comment_mentioned') {
        params["openCommentModal"] = true;
      }

      if (data?.tab_type == "event") {
        navigation.reset({
          routes: [{
            name: navigator,
            state: {
              routes: [
                {
                  name: routes.portalListScreen,
                },
                {
                  name: routes.portalDetailScreen,
                  params: {
                    eventId: data?.event_id,
                    feedFor: "event"
                  }
                },
                {
                  name: routes.feedDetailScreen,
                  params: params
                }],
            }
          }],
        })
      } else if (data?.tab_type == "program") {
        navigation.reset({
          routes: [{
            name: navigator,
            state: {
              routes: [
                {
                  name: routes.traininglist,
                },
                {
                  name: routes.trainingDetail,
                  params: {
                    slug: data?.program_slug,
                    curtab: "delegate_feed_tab_by_me",
                  }
                },
                {
                  name: routes.feedDetailScreen,
                  params: params
                }],
            }
          }],
        })
      } else if (data?.tab_type == "mission") {
					const val  =JSON.parse(data?.module_info)
        navigation.reset({
          routes: [{
            name: navigator,
            state: {
              routes: [
                {
                  name: routes.missionLevel,
                },
                {
                  name: routes.missionList,
                  params: {
                    id: val?.level_id,
                  }
                },
                {
                  name: routes.missionDetail,
                  params: {
                    id: val?.mission_id,
                    type: val?.type,
                    curTab: "community"
                  }
                },
                {
                  name: routes.feedDetailScreen,
                  params: params
                }],
            }
          }],
        })
      } else {
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

  } else if (data?.type == "message" && !!navbar.find(x => x.value == "chat")) {
    let profile = JSON.parse(data?.sender_info)
    navigation.reset({
      routes: [{
        name: routes.mainScreen,
        state: {
          routes: [{
            name: routes.chatNavigator,
            state: {
              routes: [
                {
                  name: routes.chatList,
                },
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
                    badge_color: profile?.color_code,
                  }
                }],
            }
          }],
        }
      }]
    })
  } else if (SupportTicketType.includes(data?.type)) {
    let navigator = "";
    let nestedNavigator = "";
    let params = {
      ticket: { _id: data?.support_ticket },
    }

    if (data?.type == "support_ticket_comment") {
      params["tab"] = 1
    } else if (data?.type == "support_ticket_internal_note") {
      params["tab"] = 2
    } else if (data?.type == "close_support_ticket") {
      params["route"] = "solved"
    }

    if (data?.support_ticket_tab == "contact_support" && !!navbar.find(x => x.value == "support")?.child_options.find(x => x.value == "contact_support")) {
      navigator = routes.contactSupportNavigator;
      nestedNavigator = routes?.ticketList
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
  } else if (data?.type == "goal_statement_completed") {

    navigation.reset({
      routes: [{
        name: routes.mainScreen,
        state: {
          routes: [{
            name: data?.type == "complete" ? routes.goalStatementCompleteNavigator : routes.goalStatementResponedNavigator,
            state: {
              routes: [
                {
                  name: data?.type == "complete" ? routes.goalStatementCompleteScreen : routes?.goalStatementResponedScreen,
                }, {
                  name: routes.goalStatmentDetail,
                  params: {
                    memberId: data?.sender
                  }
                }],
            }
          }],
        }
      }]
    })
  } else if (data?.type == "calender_event") {
    let event = JSON.parse(data?.event_data)
    navigation.reset({
      routes: [{
        name: routes.mainScreen,
        state: {
          routes: [{
            name: routes?.delegateEventsNavigator,
            state: {
              routes: [
                {
                  name: routes?.calendarEventsList,
                }, {
                  name: routes.calendarEventDetail,
                  params: {
                    eventId: event?.event_id,
                    iteration_id: event?._id,
                  }
                }],
            }
          }],
        }
      }]
    })
  } else if (data?.type == "commission_notification") {
    // navigation.navigate(routes.commissionNavigator)
    navigation.reset({
      routes: [{
        name: routes?.commissionNavigator,
        state: {
          routes: [
            {
              name: routes.commissionDetailScreen,
            }],
        }
      }],
    })
  }


  notifee.decrementBadgeCount();
}

export default notificationHandler;
const feedType = ["commentlike", "addcomment", "feedlike", "gratitude", "addcommentreply", "feed_mentioned", "feed_comment_mentioned", "poll_answer", "survey_answer"];
const SupportTicketType = ["send_support_ticket_reminder", "close_support_ticket", "support_ticket_comment", "add_support_ticket", "support_ticket_internal_note"];
