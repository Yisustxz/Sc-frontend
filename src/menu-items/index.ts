import dashboard from './dashboard';
import generalities from './generalities';
import people from './people';
import school from './school';
import subject from './subject';
import { MenuItem } from './types';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: MenuItem[] } = {
  items: [dashboard, generalities, people, school, subject]
};

export default menuItems;
