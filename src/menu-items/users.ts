// assets
import { IconUsers } from '@tabler/icons';
import { MenuItem, MenuItemType } from './types';
// constant

const other: MenuItem = {
  id: 'agencies-crud-category-users',
  type: MenuItemType.Group,
  title: 'Usuarios',
  children: [
    {
      id: 'usuarios',
      title: 'Usuarios',
      type: MenuItemType.Collapse,
      icon: IconUsers,
      breadcrumbs: false,
      children: [
        {
          id: 'list-users',
          title: 'Lista de usuarios',
          type: MenuItemType.Item,
          url: '/users',
          breadcrumbs: false,
        },
        {
          id: 'create-users',
          title: 'Crear usuario',
          type: MenuItemType.Item,
          url: '/users/create',
          breadcrumbs: false,
        }
      ]
    }
  ]
};

export default other;
