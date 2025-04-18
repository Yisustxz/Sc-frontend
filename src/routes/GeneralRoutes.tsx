// project imports
import { RouteObject } from 'react-router'

import RepresentativesPage from 'views/representatives'
import CreateRepresentative from 'views/representatives/create'
import EditRepresentative from 'views/representatives/edit'

import EmployeesPage from 'views/employees'
import CreateEmployee from 'views/employees/create'
import EditEmployee from 'views/employees/edit'
//Users
import Users from 'views/users'
import CreateUser from 'views/users/create'
import EditUser from 'views/users/edit'

import StudentsPage from 'views/students'
import CreateStudent from 'views/students/create'
import EditStudent from 'views/students/edit'

import SchoolarYear from 'views/schoolar-year'
import CreateSchoolarYear from 'views/schoolar-year/create'
import EditSchoolarYear from 'views/schoolar-year/edit'

const GeneralRoutes: RouteObject[] = [
  //aqui se van a añadir las rutas de cada modulo

  //Representantes
  {
    path: 'representatives',
    element: <RepresentativesPage />
  },
  {
    path: 'representatives/create',
    element: <CreateRepresentative />
  },
  {
    path: 'representatives/edit/:id',
    element: <EditRepresentative />
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
  {
    path: 'employees/edit/:id',
    element: <EditEmployee />
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
  },
  //Estudiantes
  {
    path: 'students',
    element: <StudentsPage />
  },
  {
    path: 'students/create',
    element: <CreateStudent />
  },
  {
    path: 'students/edit/:id',
    element: <EditStudent />
  },
  //Años escolares
  {
    path: 'schoolar-year',
    element: <SchoolarYear />
  },
  {
    path: 'schoolar-year/create',
    element: <CreateSchoolarYear />
  },
  {
    path: 'schoolar-year/edit/:id',
    element: <EditSchoolarYear />
  }
]

export default GeneralRoutes
