import routes from "../../navigation/routes";
import { icons } from "../../utilities/icons";
import TicketsList from "../SupportTicket/Listings";
import Chat from '../Chat/ChatScreen'
import StackSupportTicket from "../../navigation/NestedStacks/StackSupportTicket";
import StackChat from "../../navigation/NestedStacks/StackChat";
import SupportTicketList from '../SupportTicket/Listings'
import ChatScreen from "../Chat/ChatScreen";
export const drawerMenuList = [
  {
    name: 'Support Tickets',
    key: routes.supportTicketNavigator,
    component: StackSupportTicket,
    icon: icons.handPromise
  },

  // {
  //   name: 'Chat',
  //   key: routes.chatNavigator,
  //   component: StackChat,
  //   icon: icons.handPromise
  // },


];