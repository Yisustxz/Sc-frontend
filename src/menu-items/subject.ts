// assets
import { IconBook2, IconBooks  } from '@tabler/icons';
import { MenuItem, MenuItemType } from './types';
// constant

const other: MenuItem = {
  id: 'agencies-crud-subject',
  type: MenuItemType.Group,
  title: 'Asignaturas',
  children: [
    {
      id: 'asignaturas',
      title: 'Asignaturas',
      type: MenuItemType.Collapse,
      icon: IconBooks  ,
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

export default other;
