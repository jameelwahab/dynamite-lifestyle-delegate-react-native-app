import routes from "../routes";
import { icons } from "../../utilities/icons";
import StackSupportTicket from "../NestedStacks/StackSupportTicket";
import StackChat from "../NestedStacks/StackChat";
import StackInternalTickets from "../NestedStacks/StackInternalTicket";
import StackContactSupport from "../NestedStacks/StackContactSupport";

export const drawerMenuList = [
  {
    name: 'Support Tickets',
    key: routes.supportTicketNavigator,
    component: StackSupportTicket,
    icon: icons.handPromise,
    params: {
      type: "support_ticket"
    }
  },
  {
    name: 'Internal Tickets',
    key: routes.internalTicketNavigator,
    component: StackInternalTickets,
    icon: icons.handPromise,
    params: {
      type: "internal_ticket"
    }
  },
  // {
  //   name: 'Chat',
  //   key: routes.chatNavigator,
  //   component: StackChat,
  //   icon: icons.handPromise,
  //   params: {}
  // },
  {
    name: 'Contact Support',
    key: routes.contactSupportNavigator,
    component: StackContactSupport,
    icon: icons.handPromise,
    params: {}
  },
];