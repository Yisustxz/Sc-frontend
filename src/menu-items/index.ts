import dashboard from './dashboard';
import generalities from './generalities';
import people from './people';
import school from './school';
import schoolYear, { getSchoolYearByRole } from './school-year';
import { MenuItem } from './types';
import { Role } from 'constants/roles';

const getMenuItemsByRole = (userRole: string | null | undefined): { items: MenuItem[] } => {
  const dynamicSchoolYear = getSchoolYearByRole(userRole);

  if (!userRole || userRole === Role.ADMIN) {
    return {
      items: [dashboard, generalities, people, school, dynamicSchoolYear]
    };
  }

  if (userRole === Role.TEACHER) {
    return {
      items: [dashboard, dynamicSchoolYear]
    };
  }

  return {
    items: [dashboard]
  };
};

const menuItems: { items: MenuItem[] } = {
  items: [dashboard, generalities, people, school, schoolYear]
};

export default menuItems;
export { getMenuItemsByRole };
