import routes from "../routes";
import { icons } from "../../utilities/icons";
import StackSupportTicket from "../NestedStacks/StackSupportTicket";
import StackChat from "../NestedStacks/StackChat";
import StackInternalTickets from "../NestedStacks/StackInternalTicket";
import StackContactSupport from "../NestedStacks/StackContactSupport";
import StackMissionControl from "../NestedStacks/SackMisisonControl";
import StackFeed from "../NestedStacks/StackFeed";
import StackAllMember from "../NestedStacks/StackAllMembers";
import StackNurtureMembers from "../NestedStacks/StackNurtureMembers";
import StackMembers from "../NestedStacks/StackMembers";
import StackWhatsApp from "../NestedStacks/StackWhatsApp";

export const drawerMenuList = [
  {
    value: "",
    collapsible: false,
    key: routes.dasboardNavigator,
    component: StackMissionControl,
    icon: icons.sidebar.dashboard,
    params: {

    }
  },
  {
    value: "the_cosmos",
    collapsible: false,
    icon: icons.sidebar.cosmos,
    key: routes.feedNavigator,
    component: StackFeed,
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
        value: "members",
        key: routes.memberNavigator,
        component: StackMembers,
        icon: icons.sidebar.member,
        params: {
          type: "member"
        }
      },

      {
        value: "nurture_members",
        key: routes.nurtureNavigator,
        component: StackNurtureMembers,
        icon: icons.sidebar.member,
        params: {
          type: "nurture"
        }
      },

      {
        value: "all_member_list",
        key: routes.allMemberNavigator,
        component: StackAllMember,
        icon: icons.sidebar.member,
        params: {
          type: "all-member"
        }
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
      title: "The Source Feed",
    }
  },

  {
    value: "all_source_feed",
    key: routes.allSourcesFeedNavigator,
    collapsible: false,
    component: StackFeed,
    icon: icons.sidebar.handPromise,
    params: {
      feedFor: "all_source",
      title: "All Source Feed",
    }
  },

  {
    value: "scheduled_feeds",
    key: routes.scheduledFeedNavigator,
    collapsible: false,
    component: StackFeed,
    icon: icons.sidebar.handPromise,
    params: {
      feedFor: "scheduled",
      title: "Schedule Feed",
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


export const ParentComponents = {
  mission_control: {
    key: routes.dasboardNavigator,
    component: StackMissionControl,
    params: {},
  },
  the_cosmos: {
    key: routes.feedNavigator,
    component: StackFeed,
    params: { feedFor: "the_cosmos" }
  },
  support_ticket: {
    key: routes.supportTicketNavigator,
    component: StackSupportTicket,
    params: { type: "support_ticket" }
  },
  'internal-tickets': {
    key: routes.internalTicketNavigator,
    component: StackInternalTickets,
    params: { type: "internal_ticket" }
  },
  chat: {
    key: routes.chatNavigator,
    component: StackChat,
    params: {}
  },
  members: {
    key: null,
    component: null,
    params: {}
  },
  the_source_feed: {
    key: routes.sourceFeedNavigator,
    component: StackFeed,
    params: {
      feedFor: "the_source",
      title: "The Source Feed",
    }
  },
  all_source_feed: {
    key: routes.allSourcesFeedNavigator,
    component: StackFeed,
    params: {
      feedFor: "all_source",
      title: "All Source Feed",
    }
  },
  scheduled_feeds: {
    key: routes.scheduledFeedNavigator,
    component: StackFeed,
    params: {
      feedFor: "scheduled",
      title: "Schedule Feed",
    }
  },
  support: {
    value: "support",
    key: null,
    params: {}
  },
  whatsapp_chat: {
    key: routes.whatsappChatNavigator,
    component: StackWhatsApp,
    params: {}
  },
}

export const ChildComponents = {
  members: {
    key: routes.memberNavigator,
    component: StackMembers,
    params: { type: "member" }
  },
  nurture_members: {
    key: routes.nurtureNavigator,
    component: StackNurtureMembers,
    params: { type: "nurture" }
  },
  all_member_list: {
    key: routes.allMemberNavigator,
    component: StackAllMember,
    params: { type: "all-member" }
  },
  contact_support: {
    key: routes.contactSupportNavigator,
    component: StackContactSupport,
    params: {}
  },
}