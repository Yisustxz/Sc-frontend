// project imports
import { RouteObject } from 'react-router'

//Clients
import Clients from 'views/clients'
import CreateClient from 'views/clients/create'
import EditClient from 'views/clients/edit'

//Courses
import Courses from 'views/courses'
import CreateCourse from 'views/courses/create'
import EditCourse from 'views/courses/edit'


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

   //Asignaturas
  {
    path: 'courses',
    element: <Courses />
  },
  {
    path: 'courses/create',
    element: <CreateCourse />
  },
  {
    path: 'courses/edit/:id',
    element: <EditCourse />
  }
]

export default GeneralRoutes
