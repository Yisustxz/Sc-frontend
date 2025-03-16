// project imports
import { RouteObject } from 'react-router'
import CreateSubject from 'services/subjects/create-subject'
import EditSubject from 'services/subjects/edit-subject'

//Clients
import Clients from 'views/clients'
import CreateClient from 'views/clients/create'
import EditClient from 'views/clients/edit'

//Subjects
import Subjects from 'views/subjects'
import CreateSubject from 'views/subjects/create'
import EditSubject from 'views/subjects/edit'

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
    path: 'subjects',
    element: <Subjects />
  },
  {
    path: 'subjects/create',
    element: <CreateSubject />
  },
  {
    path: 'subjects/edit/:id',
    element: <EditSubject />
  }
]

export default GeneralRoutes
