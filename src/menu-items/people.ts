// assets
import { 
  IconUserPlus, 
  IconUsers, 
  IconSchool 
} from '@tabler/icons';
import { MenuItem, MenuItemType } from './types';

const people: MenuItem = {
  id: 'people',
  type: MenuItemType.Group,
  title: 'Personas',
  children: [
    {
      id: 'representatives',
      title: 'Representantes',
      type: MenuItemType.Collapse,
      icon: IconUserPlus,
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
      icon: IconSchool,
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
};

export default people; 