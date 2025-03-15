import clientele from './clientele';
import dashboard from './dashboard';
import subject from './subject';
import { MenuItem } from './types';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: MenuItem[] } = {
  items: [dashboard,clientele,subject]
};

export default menuItems;
