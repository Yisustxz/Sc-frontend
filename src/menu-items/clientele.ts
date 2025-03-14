// assets
import { IconUsers, IconCalendarEvent, IconCar, IconReceipt2, IconCreditCard, IconWallet, IconListCheck } from '@tabler/icons';
import { MenuItem, MenuItemType } from './types';
// constant

const other: MenuItem = {
  id: 'agencies-crud-category-clientele',
  type: MenuItemType.Group,
  title: 'Usuarios',
  children: [
    {
      id: 'clients',
      title: 'Clientes',
      type: MenuItemType.Collapse,
      icon: IconUsers,
      breadcrumbs: false,
      children: [
        {
          id: 'list-clients',
          title: 'Lista de clientes',
          type: MenuItemType.Item,
          url: '/clients',
          breadcrumbs: false,
        },
        {
          id: 'create-clients',
          title: 'Crear cliente',
          type: MenuItemType.Item,
          url: '/clients/create',
          breadcrumbs: false,
        }
      ]
    },
    {
      id: 'representatives',
      title: 'Representantes',
      type: MenuItemType.Collapse,
      icon: IconUsers,
      breadcrumbs: false,
      children: [
        {
          id: 'list-representatives',
          title: 'Lista de representantes',
          type: MenuItemType.Item,
          url: '/representatives',
          breadcrumbs: false,
        },
        {
          id: 'create-representatives',
          title: 'Crear representante',
          type: MenuItemType.Item,
          url: '/representatives/create',
          breadcrumbs: false,
        }
      ]
    },
    {
      id: 'employees',
      title: 'Empleados',
      type: MenuItemType.Collapse,
      icon: IconUsers,
      breadcrumbs: false,
      children: [
        {
          id: 'list-employees',
          title: 'Lista de empleados',
          type: MenuItemType.Item,
          url: '/employees',
          breadcrumbs: false,
        },
        {
          id: 'create-employees',
          title: 'Crear empleado',
          type: MenuItemType.Item,
          url: '/employees/create',
          breadcrumbs: false,
        }
      ]
    },
    {
      id: "students",
      title: "Estudiantes",
      type: MenuItemType.Collapse,
      icon: IconUsers,
      breadcrumbs: false,
      children: [
        {
          id: 'list-students',
          title: 'Lista de Alumnos',
          type: MenuItemType.Item,
          url: '/students',
          breadcrumbs: false,
        },
        {
          id: 'create-students',
          title: 'Crear Alumnos',
          type: MenuItemType.Item,
          url: '/students/create',
          breadcrumbs: false,
        }
      ]
    }
  ]
}
export default other;
