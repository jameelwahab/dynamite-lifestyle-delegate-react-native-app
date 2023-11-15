import routes from "../../navigation/routes";
import { icons } from "../../utilities/icons";
import TicketsList from "../SupportTicket/Listings";

export const drawerMenuList = [
  {
    name: 'Support Tickets',
    key: routes.supportTicketNavigator,
    component: TicketsList,
    icon: icons.handPromise
  },


];