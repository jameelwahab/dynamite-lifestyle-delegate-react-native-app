import routes from "../routes";
import { icons } from "../../utilities/icons";
import StackSupportTicket from "../NestedStacks/StackSupportTicket";
import StackChat from "../NestedStacks/StackChat";
import StackInternalTickets from "../NestedStacks/StackInternalTicket";

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
  {
    name: 'Chat',
    key: routes.chatNavigator,
    component: StackChat,
    icon: icons.handPromise,
    params: {}
  },
];