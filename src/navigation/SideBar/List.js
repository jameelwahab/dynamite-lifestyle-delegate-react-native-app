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
import StackTransactions from "../NestedStacks/StackTransactions";
import StackCommissions from "../NestedStacks/StackCommissions";
import StackPaymentsRequest from "../NestedStacks/StackPaymentsRequest";
import StackPortals from "../NestedStacks/StackPortals";
import StackMyPortals from "../NestedStacks/StackMyPortals";
import StackLinks from "../NestedStacks/StackLinks";
import StackSubscription from "../NestedStacks/StackSubscription";
import StackMembersAnswer from "../NestedStacks/StackMemberAnswer";

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
    params: {
      key: "mission_control"
    },
  },
  the_cosmos: {
    key: routes.feedNavigator,
    component: StackFeed,
    params: { feedFor: "the_cosmos", key: "the_cosmos" }
  },
  support_ticket: {
    key: routes.supportTicketNavigator,
    component: StackSupportTicket,
    params: { type: "support_ticket", key: "support_ticket" }
  },
  'internal-tickets': {
    key: routes.internalTicketNavigator,
    component: StackInternalTickets,
    params: { type: "internal_ticket", key: "internal-tickets" }
  },
  chat: {
    key: routes.chatNavigator,
    component: StackChat,
    params: { key: "chat" }
  },
  members: {
    key: null,
    component: null,
    params: { key: "members" }
  },
  the_source_feed: {
    key: routes.sourceFeedNavigator,
    component: StackFeed,
    params: {
      feedFor: "the_source",
      title: "The Source Feed",
      key: "the_source_feed"
    }
  },
  all_source_feed: {
    key: routes.allSourcesFeedNavigator,
    component: StackFeed,
    params: {
      feedFor: "all_source",
      title: "All Source Feed",
      key: "all_source_feed"
    }
  },
  scheduled_feeds: {
    key: routes.scheduledFeedNavigator,
    component: StackFeed,
    params: {
      feedFor: "scheduled",
      title: "Schedule Feed",
      key: "scheduled_feeds"
    }
  },
  support: {
    value: "support",
    key: null,
    params: {
      key: "support"
    }
  },
  whatsapp_chat: {
    key: routes.whatsappChatNavigator,
    component: StackWhatsApp,
    params: {
      key: "whatsapp_chat"
    }
  },
  payments: {
    key: null,
    component: null,
    params: {
      key: "payments"
    }
  },
  portals: {
    key: routes.portalNavigator,
    component: StackPortals,
    params: {
      key: "portals"
    }
  },
  my_portals: {
    key: routes.myPortalNavigator,
    component: StackMyPortals,
    params: {
      key: "my_portals"
    }
  },
  links: {
    key: routes.linksNavigator,
    component: StackLinks,
    params: {
      key: "links"
    }
  },

  member_answers_list: {
    key: routes.membersAnswersNavigator,
    component: StackMembersAnswer,
    params: {
      key: "member_answers_list"
    }
  },

  subscription_list: {
    key: routes.subscriptionNavigator,
    component: StackSubscription,
    params: {
      key: "subscription_list"
    }
  },
}

export const ChildComponents = {
  members: {
    key: routes.memberNavigator,
    component: StackMembers,
    params: { type: "member", key: "members", parentKey: "members" }
  },
  nurture_members: {
    key: routes.nurtureNavigator,
    component: StackNurtureMembers,
    params: { type: "nurture", key: "nurture", parentKey: "members" }
  },
  all_member_list: {
    key: routes.allMemberNavigator,
    component: StackAllMember,
    params: { type: "all-member", key: "all_member_list", parentKey: "members" }
  },
  contact_support: {
    key: routes.contactSupportNavigator,
    component: StackContactSupport,
    params: { key: "contact_support", parentKey: "support" }
  },
  transactions: {
    key: routes.transactionNavigator,
    component: StackTransactions,
    params: { key: "transactions", parentKey: "payments" }
  },
  commission_detail: {
    key: routes.commissionNavigator,
    component: StackCommissions,
    params: { key: "commission_detail", parentKey: "payments" }
  },
  payment_request: {
    key: routes.paymentRquesNavigator,
    component: StackPaymentsRequest,
    params: { key: "payment_request", parentKey: "payments" }
  },
}