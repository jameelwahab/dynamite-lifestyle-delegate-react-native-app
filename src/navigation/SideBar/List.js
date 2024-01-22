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