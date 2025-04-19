// assets
import { IconCalendar, IconBook2, IconBooks } from '@tabler/icons';
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
    },
    {
      id: 'asignaturas',
      title: 'Asignaturas',
      type: MenuItemType.Collapse,
      icon: IconBooks,
      breadcrumbs: false,
      children: [
        {
          id: 'list-courses',
          title: 'Lista de asignaturas',
          type: MenuItemType.Item,
          url: '/courses',
          breadcrumbs: false,
        },
        {
          id: 'create-courses',
          title: 'Crear asignatura',
          type: MenuItemType.Item,
          url: '/courses/create',
          breadcrumbs: false,
        }
      ]
    }
  ]
};

export default school; 