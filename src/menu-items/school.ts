// assets
import { IconCalendar } from '@tabler/icons';
import { MenuItem, MenuItemType } from './types';

const school: MenuItem = {
  id: 'school',
  type: MenuItemType.Group,
  title: 'Escuela',
  children: [
    {
      id: "academicYear",
      title: "Años escolares",
      type: MenuItemType.Collapse,
      icon: IconCalendar,
      breadcrumbs: false,
      children: [
        {
          id: 'list-academic-year',
          title: 'Lista de años escolares',
          type: MenuItemType.Item,
          url: '/schoolar-year',
          breadcrumbs: false,
        },
        {
          id: 'create-academic-year',
          title: 'Crear año escolar',
          type: MenuItemType.Item,
          url: '/schoolar-year/create',
          breadcrumbs: false,
        }
      ]
    }
  ]
};

export default school; 