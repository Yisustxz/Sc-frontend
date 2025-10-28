import { RouteObject } from 'react-router'

import RepresentativesPage from 'views/representatives'
import CreateRepresentative from 'views/representatives/create'
import EditRepresentative from 'views/representatives/edit'

import EmployeesPage from 'views/employees'
import CreateEmployee from 'views/employees/create'
import EditEmployee from 'views/employees/edit'

import Users from 'views/users'
import CreateUser from 'views/users/create'
import EditUser from 'views/users/edit'

import StudentsPage from 'views/students'
import CreateStudent from 'views/students/create'
import EditStudent from 'views/students/edit'

import SchoolYears from 'views/school-years'
import CreateSchoolYear from 'views/school-years/create'
import EditSchoolYear from 'views/school-years/edit'

import Courses from 'views/courses'
import CreateCourse from 'views/courses/create'
import EditCourse from 'views/courses/edit'

import CourseSchoolYearPage from 'views/course-school-year'
import CreateCourseSchoolYear from 'views/course-school-year/create'
import EditCourseSchoolYear from 'views/course-school-year/edit'
import DetailCourseSchoolYear from 'views/course-school-year/detail'
import StudentGradesDetail from 'views/course-school-year/student-grades-detail/StudentGradesDetail'

import InscriptionsPage from 'views/inscriptions'
import CreateInscription from 'views/inscriptions/create'
import EditInscription from 'views/inscriptions/edit'
import DetailInscription from 'views/inscriptions/detail'

import Evaluations from 'views/evaluations/index';

import ProtectedRoute from 'components/ProtectedRoute';
import { Role } from 'constants/roles';

const GeneralRoutes: RouteObject[] = [
  {
    path: 'representatives',
    element: <ProtectedRoute allowedRoles={[Role.ADMIN]}><RepresentativesPage /></ProtectedRoute>
  },
  {
    path: 'representatives/create',
    element: <ProtectedRoute allowedRoles={[Role.ADMIN]}><CreateRepresentative /></ProtectedRoute>
  },
  {
    path: 'representatives/edit/:id',
    element: <ProtectedRoute allowedRoles={[Role.ADMIN]}><EditRepresentative /></ProtectedRoute>
  },
  {
    path: 'employees',
    element: <ProtectedRoute allowedRoles={[Role.ADMIN]}><EmployeesPage /></ProtectedRoute>
  },
  {
    path: 'employees/create',
    element: <ProtectedRoute allowedRoles={[Role.ADMIN]}><CreateEmployee /></ProtectedRoute>
  },
  {
    path: 'employees/edit/:id',
    element: <ProtectedRoute allowedRoles={[Role.ADMIN]}><EditEmployee /></ProtectedRoute>
  },
  {
    path: 'users',
    element: <ProtectedRoute allowedRoles={[Role.ADMIN]}><Users /></ProtectedRoute>
  },
  {
    path: 'users/create',
    element: <ProtectedRoute allowedRoles={[Role.ADMIN]}><CreateUser /></ProtectedRoute>
  },
  {
    path: 'users/edit/:id',
    element: <ProtectedRoute allowedRoles={[Role.ADMIN]}><EditUser /></ProtectedRoute>
  },
  {
    path: 'students',
    element: <ProtectedRoute allowedRoles={[Role.ADMIN]}><StudentsPage /></ProtectedRoute>
  },
  {
    path: 'students/create',
    element: <ProtectedRoute allowedRoles={[Role.ADMIN]}><CreateStudent /></ProtectedRoute>
  },
  {
    path: 'students/edit/:id',
    element: <ProtectedRoute allowedRoles={[Role.ADMIN]}><EditStudent /></ProtectedRoute>
  },
  {
    path: 'school-years',
    element: <ProtectedRoute allowedRoles={[Role.ADMIN]}><SchoolYears /></ProtectedRoute>
  },
  {
    path: 'school-years/create',
    element: <ProtectedRoute allowedRoles={[Role.ADMIN]}><CreateSchoolYear /></ProtectedRoute>
  },
  {
    path: 'school-years/edit/:id',
    element: <ProtectedRoute allowedRoles={[Role.ADMIN]}><EditSchoolYear /></ProtectedRoute>
  },
  {
    path: 'courses',
    element: <ProtectedRoute allowedRoles={[Role.ADMIN]}><Courses /></ProtectedRoute>
  },
  {
    path: 'courses/create',
    element: <ProtectedRoute allowedRoles={[Role.ADMIN]}><CreateCourse /></ProtectedRoute>
  },
  {
    path: 'courses/edit/:id',
    element: <ProtectedRoute allowedRoles={[Role.ADMIN]}><EditCourse /></ProtectedRoute>
  },
  {
    path: 'course-school-year',
    element: <CourseSchoolYearPage />
  },
  {
    path: 'course-school-year/create',
    element: <ProtectedRoute allowedRoles={[Role.ADMIN]}><CreateCourseSchoolYear /></ProtectedRoute>
  },
  {
    path: 'course-school-year/edit/:id',
    element: <ProtectedRoute allowedRoles={[Role.ADMIN]}><EditCourseSchoolYear /></ProtectedRoute>
  },
  {
    path: 'course-school-year/detail/:id',
    element: <DetailCourseSchoolYear />
  },
  {
    path: 'course-school-year/detail/:courseSchoolYearId/student/:studentId/qualifications',
    element: <StudentGradesDetail />
  },
  {
    path: 'inscriptions',
    element: <ProtectedRoute allowedRoles={[Role.ADMIN]}><InscriptionsPage /></ProtectedRoute>
  },
  {
    path: 'inscriptions/create',
    element: <ProtectedRoute allowedRoles={[Role.ADMIN]}><CreateInscription /></ProtectedRoute>
  },
  {
    path: 'inscriptions/edit/:id',
    element: <ProtectedRoute allowedRoles={[Role.ADMIN]}><EditInscription /></ProtectedRoute>
  },
  {
    path: 'inscriptions/detail/:id',
    element: <DetailInscription />
  },
  {
    path: 'evaluations/:id',
    element: <Evaluations />
  }
]

export default GeneralRoutes
