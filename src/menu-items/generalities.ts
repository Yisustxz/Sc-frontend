// assets
import { IconUser } from '@tabler/icons';
import { MenuItem, MenuItemType } from './types';

const generalities: MenuItem = {
  id: 'generalities',
  type: MenuItemType.Group,
  title: 'Generalidades',
  children: [
    {
      id: 'users',
      title: 'Usuarios',
      type: MenuItemType.Collapse,
      icon: IconUser,
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

export default generalities; 