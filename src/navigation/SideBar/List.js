import routes from "../routes";
import { icons } from "../../utilities/icons";
import StackSupportTicket from "../NestedStacks/StackSupportTicket";
import StackChat from "../NestedStacks/StackChat";
import StackInternalTickets from "../NestedStacks/StackInternalTicket";
import StackContactSupport from "../NestedStacks/StackContactSupport";
import StackMissionControl from "../NestedStacks/SackMisisonControl";
import StackFeed from "../NestedStacks/StackFeed";
import StackAllMember from "../NestedStacks/StackAllMembers";

export const drawerMenuList = [
  {
    value: "",
    key: routes.dasboardNavigator,
    collapsible: false,
    component: StackMissionControl,
    icon: icons.sidebar.dashboard,
    params: {

    }
  },
  {
    value: "the_cosmos",
    key: routes.feedNavigator,
    collapsible: false,
    component: StackFeed,
    icon: icons.sidebar.cosmos,
    params: {
      feedFor: "the_cosmos"
    }
  },
  {
    value: "support_ticket",
    key: routes.supportTicketNavigator,
    collapsible: false,
    component: StackSupportTicket,
    icon: icons.sidebar.handPromise,
    params: {
      type: "support_ticket"
    }
  },
  {
    value: "internal-tickets",
    collapsible: false,
    key: routes.internalTicketNavigator,
    component: StackInternalTickets,
    icon: icons.sidebar.handPromise,
    params: {
      type: "internal_ticket"
    }
  },

  {
    value: "chat",
    collapsible: false,
    key: routes.chatNavigator,
    component: StackChat,
    icon: icons.sidebar.handPromise,
    params: {
    }
  },

  {
    value: "members",
    collapsible: true,
    key: null,
    icon: icons.sidebar.member,
    nestedmenu: [
      {
        value: "all_member_list",
        key: routes.allMemberNavigator,
        component: StackAllMember,
        icon: icons.sidebar.member,
        params: {}
      },
    ]
  },

  {
    value: "the_source_feed",
    key: routes.sourceFeedNavigator,
    collapsible: false,
    component: StackFeed,
    icon: icons.sidebar.handPromise,
    params: {
      feedFor: "the_source",
    }
  },

  {
    value: "all_source_feed",
    key: routes.allSourcesFeedNavigator,
    collapsible: false,
    component: StackFeed,
    icon: icons.sidebar.handPromise,
    params: {
      feedFor: "all_source"
    }
  },

  {
    value: "scheduled_feeds",
    key: routes.scheduledFeedNavigator,
    collapsible: false,
    component: StackFeed,
    icon: icons.sidebar.handPromise,
    params: {
      feedFor: "scheduled"
    }
  },

  {
    value: "support",
    collapsible: true,
    key: null,
    icon: icons.sidebar.help,
    nestedmenu: [
      {
        value: "contact_support",
        key: routes.contactSupportNavigator,
        component: StackContactSupport,
        icon: icons.sidebar.handPromise,
        params: {}
      },
    ]
  },

];