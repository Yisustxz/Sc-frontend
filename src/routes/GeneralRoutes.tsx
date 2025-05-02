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

import SchoolYears from 'views/school-years'
import CreateSchoolYear from 'views/school-years/create'
import EditSchoolYear from 'views/school-years/edit'

//Courses
import Courses from 'views/courses'
import CreateCourse from 'views/courses/create'
import EditCourse from 'views/courses/edit'

//CourseSchoolYear
import CourseSchoolYearPage from 'views/course-school-year'
import CreateCourseSchoolYear from 'views/course-school-year/create'
import EditCourseSchoolYear from 'views/course-school-year/edit'
import DetailCourseSchoolYear from 'views/course-school-year/detail'

//Inscriptions
import InscriptionsPage from 'views/inscriptions'
import CreateInscription from 'views/inscriptions/create'
import EditInscription from 'views/inscriptions/edit'
/*import DetailInscription from 'views/inscriptions/detail'*/

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
    path: 'school-years',
    element: <SchoolYears />
  },
  {
    path: 'school-years/create',
    element: <CreateSchoolYear />
  },
  {
    path: 'school-years/edit/:id',
    element: <EditSchoolYear />
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
  },
  //Asignaturas por Año Escolar
  {
    path: 'course-school-year',
    element: <CourseSchoolYearPage />
  },
  {
    path: 'course-school-year/create',
    element: <CreateCourseSchoolYear />
  },
  {
    path: 'course-school-year/edit/:id',
    element: <EditCourseSchoolYear />
  },
  {
    path: 'course-school-year/detail/:id',
    element: <DetailCourseSchoolYear />
  },
  //Inscripciones
  {
    path: 'inscriptions',
    element: <InscriptionsPage />
  },
  {
    path: 'inscriptions/create',
    element: <CreateInscription />
  },
  {
    path: 'inscriptions/edit/:id',
    element: <EditInscription />
  },
  /*{
    path: 'inscriptions/:id',
    element: <DetailInscription />
  }*/
]

export default GeneralRoutes
