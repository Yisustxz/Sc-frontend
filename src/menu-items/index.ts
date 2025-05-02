import dashboard from './dashboard';
import generalities from './generalities';
import people from './people';
import school from './school';
import schoolYear from './school-year';
import { MenuItem } from './types';

// ==============================|| MENU ITEMS ||============================== //

const menuItems: { items: MenuItem[] } = {
  items: [dashboard, generalities, people, school, schoolYear]
};

export default menuItems;
