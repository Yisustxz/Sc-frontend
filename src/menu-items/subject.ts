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
          id: 'list-subjects',
          title: 'Lista de asignaturas',
          type: MenuItemType.Item,
          url: '/subjects',
          breadcrumbs: false,
        },
        {
          id: 'create-subjects',
          title: 'Crear asignatura',
          type: MenuItemType.Item,
          url: '/subjects/create',
          breadcrumbs: false,
        }
      ]
    }
  ]
};

export default other;
