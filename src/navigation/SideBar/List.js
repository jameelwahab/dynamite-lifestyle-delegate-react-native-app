import routes from "../routes";
import { icons } from "../../utilities/icons";
import StackSupportTicket from "../NestedStacks/StackSupportTicket";
import StackChat from "../NestedStacks/StackChat";
import StackInternalTickets from "../NestedStacks/StackInternalTicket";
import StackContactSupport from "../NestedStacks/StackContactSupport";
import StackMissionControl from "../NestedStacks/SackMisisonControl";

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