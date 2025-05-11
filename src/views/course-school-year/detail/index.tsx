import { FunctionComponent, useState, useEffect, useCallback } from 'react';
import {
  Grid,
  Box,
  CircularProgress,
  Typography
} from '@mui/material';
import MainCard from 'components/cards/MainCard';
import { useParams } from 'react-router-dom';
import BreadcrumbsNav from 'components/BreadcrumbsNav';
import styled from 'styled-components';
import CourseSchoolYearDetails from './course-school-year-details';
import StudentDetailsDialog from './student-details-dialog';
import Evaluations from './evaluations';
import Students from './students';
import { Evaluation, EvaluationType, StudentOfCourse } from 'core/evaluations/types';
import { SchoolYear } from 'core/school-year/types';

// Datos de ejemplo para mockup
const mockEvaluations: Evaluation[] = [
  {
    id: 1,
    name: "Tarea #1",
    schoolCourtId: 101,
    percentage: 15,
    type: EvaluationType.Task,
    courseSchoolYearId: 1,
    creationDate: "2025-01-20"
  },
  {
    id: 2,
    name: "Examen #1",
    schoolCourtId: 101,
    percentage: 25,
    type: EvaluationType.Exam,
    courseSchoolYearId: 1,
    creationDate: "2025-01-25"
  },
  {
    id: 3,
    name: "Examen #2",
    schoolCourtId: 102,
    percentage: 30,
    type: EvaluationType.Exam,
    courseSchoolYearId: 1,
    creationDate: "2025-02-20"
  },
  {
    id: 4,
    name: "Tarea #2",
    schoolCourtId: 201,
    percentage: 25,
    type: EvaluationType.Task,
    courseSchoolYearId: 1,
    creationDate: "2025-03-20"
  },
  {
    id: 5,
    name: "Examen #2",
    schoolCourtId: 202,
    percentage: 25,
    type: EvaluationType.Exam,
    courseSchoolYearId: 1,
    creationDate: "2025-04-20"
  }
];

const mockSchoolYear: SchoolYear = {
  id: 1,
  code: "2025-1",
  startDate: "2025-01-15",
  endDate: "2025-07-15",
  schoolLapses: [
    {
      id: 1,
      startDate: "2025-01-15",
      endDate: "2025-03-15",
      schoolCourts: [
        {
          id: 101,
          startDate: "2025-01-15",
          endDate: "2025-02-15"
        },
        {
          id: 102,
          startDate: "2025-02-16",
          endDate: "2025-03-15"
        }
      ]
    },
    {
      id: 2,
      startDate: "2025-03-16",
      endDate: "2025-05-15",
      schoolCourts: [
        {
          id: 201,
          startDate: "2025-03-16",
          endDate: "2025-04-15"
        },
        {
          id: 202,
          startDate: "2025-04-16",
          endDate: "2025-05-15"
        }
      ]
    },
    {
      id: 3,
      startDate: "2025-05-16",
      endDate: "2025-07-15",
      schoolCourts: [
        {
          id: 301,
          startDate: "2025-05-16",
          endDate: "2025-06-15"
        },
        {
          id: 302,
          startDate: "2025-06-16",
          endDate: "2025-07-15"
        }
      ]
    }
  ]
};

const mockCourseSchoolYear = {
  id: 1,
  course: {
    id: 101,
    name: "Matemáticas"
  },
  schoolYear: mockSchoolYear,
  professor: {
    id: 201,
    name: "José",
    lastName: "Hernández"
  },
  grade: 1,
  weeklyHours: 6
};

// Agregar mockStudents para pasar como prop al componente Students
const mockStudents = Array.from({ length: 20 }, (_, index) => ({
  id: index + 1,
  name: ['Héctor', 'Ana', 'Carlos', 'María', 'Juan', 'Laura', 'Pedro', 'Sofía', 'Daniel', 'Lucía',
    'Alejandro', 'Valentina', 'Sebastián', 'Isabella', 'Mateo', 'Camila', 'Santiago', 'Emma',
    'Nicolás', 'Victoria'][index],
  lastName: ['Ferrer', 'Gómez', 'Pérez', 'Rodríguez', 'Martínez', 'Sánchez', 'López', 'Díaz', 'Torres',
    'Fernández', 'García', 'López', 'Hernández', 'Martín', 'Jiménez', 'Ruiz', 'Álvarez',
    'Moreno', 'Muñoz', 'Romero'][index],
  dni: String(10000000 + index * 443113).substring(0, 8)
}));

interface CourseSchoolYearDetailProps {
  id?: string;
  className?: string;
}

const CourseSchoolYearDetail: FunctionComponent<CourseSchoolYearDetailProps> = ({ className }) => {
  const { id } = useParams<{ id: string }>();
  const [courseSchoolYear, setCourseSchoolYear] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  // Agregar estado para el diálogo de detalles del estudiante
  const [selectedStudent, setSelectedStudent] = useState<StudentOfCourse | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Simular carga de datos
  useEffect(() => {
    // En un componente real, aquí iría la llamada a la API
    const loadData = () => {
      setTimeout(() => {
        setCourseSchoolYear(mockCourseSchoolYear);
        setEvaluations(mockEvaluations);
        setLoading(false);
      }, 500);
    };

    loadData();
  }, [id]);

  // Manejar la visualización de detalles del estudiante
  const handleViewStudentDetails = useCallback((studentId: number) => {
    const student = mockStudents.find(s => s.id === studentId) || null;
    setSelectedStudent(student);
    setDetailsDialogOpen(true);
  }, []);

  // Cerrar el diálogo de detalles
  const handleCloseDetailsDialog = useCallback(() => {
    setDetailsDialogOpen(false);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!courseSchoolYear) {
    return (
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <Typography variant="h5" color="error">
          No se encontró el curso
        </Typography>
      </Box>
    );
  }

  // Definir las rutas para los breadcrumbs
  const breadcrumbItems = [
    {
      label: 'Asignaturas por Año Escolar',
      path: '/course-school-year'
    },
    {
      label: courseSchoolYear.schoolYear?.code || 'Año Escolar',
      path: '/school-years'
    },
    {
      label: courseSchoolYear.course?.name || 'Asignatura'
    }
  ];

  return (
    <div className={className}>
      <Box sx={{ mb: 3 }}>
        <BreadcrumbsNav items={breadcrumbItems} />
      </Box>

      <Grid container spacing={3}>
        {/* Card con información general */}
        <Grid item xs={12}>
          <CourseSchoolYearDetails courseSchoolYear={courseSchoolYear} />
        </Grid>
        {/* Card de Evaluaciones */}
        <Grid item xs={12} lg={8}>
          <MainCard title="Evaluaciones" className="content-card">
            <Evaluations
              schoolYear={courseSchoolYear.schoolYear}
              evaluations={evaluations}
              loading={false}
            />
          </MainCard>
        </Grid>
        {/* Card de Estudiantes */}
        <Grid item xs={12} lg={4}>
          <MainCard title="Estudiantes Inscritos" className="content-card">
            <Students
              courseSchoolYearId={courseSchoolYear.id}
              students={mockStudents}
              loading={false}
              onViewStudentDetails={handleViewStudentDetails}
            />
          </MainCard>
        </Grid>
      </Grid>

      {/* Diálogo de detalles del estudiante */}
      <StudentDetailsDialog
        open={detailsDialogOpen}
        onClose={handleCloseDetailsDialog}
        selectedStudent={selectedStudent}
      />
    </div>
  );
};

export default styled(CourseSchoolYearDetail)`
  .detail-card, .content-card {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
  
  .detail-card .MuiCardContent-root,
  .content-card .MuiCardContent-root {
    padding: 12px 16px;
  }
`;
