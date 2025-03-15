// project imports
import { RouteObject } from 'react-router'

//Clients
import Clients from 'views/clients'
import CreateClient from 'views/clients/create'
import EditClient from 'views/clients/edit'

import RepresentativesPage from 'views/representatives'
import CreateRepresentative from 'views/representatives/create'

import EmployeesPage from 'views/employees'
import CreateEmployee from 'views/employees/create'
//Users
import Users from 'views/users'
import CreateUser from 'views/users/create'
import EditUser from 'views/users/edit'

const GeneralRoutes: RouteObject[] = [
  //aqui se van a añadir las rutas de cada modulo

  //Clientes
  {
    path: 'clients',
    element: <Clients />
  },
  {
    path: 'clients/create',
    element: <CreateClient />
  },
  {
    path: 'clients/edit/:id',
    element: <EditClient />
  },
  //Representantes
  {
    path: 'representatives',
    element: <RepresentativesPage />
  },
  {
    path: 'representatives/create',
    element: <CreateRepresentative />
  },
  //Empleados
  {
    path: 'employees',
    element: <EmployeesPage />
  },
  {
    path: 'employees/create',
    element: <CreateEmployee />
  },
  //Usuarios
  {
    path: 'users',
    element: <Users />
  },
  {
    path: 'users/create',
    element: <CreateUser />
  },
  {
    path: 'users/edit/:id',
    element: <EditUser />
  }
]

export default GeneralRoutes
