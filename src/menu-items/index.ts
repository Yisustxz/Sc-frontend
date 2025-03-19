import clientele from './clientele';
import dashboard from './dashboard';
import { MenuItem } from './types';
import users from './users';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: MenuItem[] } = {
  items: [dashboard,clientele,users]
};

export default menuItems;
