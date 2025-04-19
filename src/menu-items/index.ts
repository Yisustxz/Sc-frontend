import dashboard from './dashboard';
import generalities from './generalities';
import people from './people';
import school from './school';
import { MenuItem } from './types';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: MenuItem[] } = {
  items: [dashboard, generalities, people, school]
};

export default menuItems;
