import { FunctionComponent, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Grid,
  Box,
  CircularProgress,
  Typography,
  Button
} from '@mui/material';
import { IconChevronDown, IconChevronUp } from '@tabler/icons';
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
import useGetEvaluationsByCourseSchoolYear from '../hooks/use-get-evaluations-by-course-school-year';
import useGetStudentsByCourseSchoolYear from '../hooks/use-get-students-by-course-school-year';
import useCourseSchoolYearId from '../hooks/use-course-school-year-id';
import useCourseSchoolYearById from '../hooks/use-course-school-year-by-id';

interface CourseSchoolYearDetailProps {
  id?: string;
  className?: string;
}

const CourseSchoolYearDetail: FunctionComponent<CourseSchoolYearDetailProps> = ({ className }) => {
  // Obtener el ID del curso-año escolar usando el hook especializado
  const courseSchoolYearId = useCourseSchoolYearId();
  const {
    courseSchoolYear,
    setLapseExpanded,
    setCourtExpanded,
    setExpandAll: executeExpandAll,
    setCollapseAll
  } = useCourseSchoolYearById(courseSchoolYearId);

  // Obtener evaluaciones usando el hook personalizado
  const {
    data: evaluations,
    isLoading: isLoadingEvaluations,
    refetch: refetchEvaluations
  } = useGetEvaluationsByCourseSchoolYear(courseSchoolYearId);
  
  // Obtener estudiantes usando el hook personalizado
  const {
    data: students,
    isLoading: isLoadingStudents,
    refetch: refetchStudents
  } = useGetStudentsByCourseSchoolYear(courseSchoolYearId);

  // Estado para expandir/contraer todos los lapsos
  const [expandAll, setExpandAll] = useState(false);

  // Manejar expandir/contraer todos
  const handleExpandToggle = useCallback(() => {
    setExpandAll(prev => !prev);
    
    // Expandir o contraer todos los lapsos directamente
    if (expandAll) {
      setCollapseAll();
    } else {
      executeExpandAll();
    }
  }, [expandAll, executeExpandAll, setCollapseAll]);

  const loading = useMemo(() => {
    return !courseSchoolYear || isLoadingEvaluations || isLoadingStudents;
  }, [courseSchoolYear, isLoadingEvaluations, isLoadingStudents]);

  // Agregar estado para el diálogo de detalles del estudiante
  const [selectedStudent, setSelectedStudent] = useState<StudentOfCourse | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  // Manejar la visualización de detalles del estudiante
  const handleViewStudentDetails = useCallback((studentId: number) => {
    const student = students.find(s => s.id === studentId) || null;
    setSelectedStudent(student);
    setDetailsDialogOpen(true);
  }, [students]);

  // Cerrar el diálogo de detalles
  const handleCloseDetailsDialog = useCallback(() => {
    setDetailsDialogOpen(false);
  }, []);

  // Manejar agregar evaluación
  const handleAddEvaluation = useCallback((evaluation: Partial<Evaluation>) => {
    // Lógica para agregar evaluación y luego recargar
    console.log('Añadir evaluación:', evaluation);
    // Después de agregar, recargar los datos
    refetchEvaluations();
  }, [refetchEvaluations]);

  // Manejar editar evaluación
  const handleEditEvaluation = useCallback((id: number, evaluation: Partial<Evaluation>) => {
    // Lógica para editar evaluación y luego recargar
    console.log('Editar evaluación:', id, evaluation);
    // Después de editar, recargar los datos
    refetchEvaluations();
  }, [refetchEvaluations]);

  // Manejar eliminar evaluación
  const handleDeleteEvaluation = useCallback((id: number) => {
    // Lógica para eliminar evaluación y luego recargar
    console.log('Eliminar evaluación:', id);
    // Después de eliminar, recargar los datos
    refetchEvaluations();
  }, [refetchEvaluations]);

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
        <Grid item xs={12} lg={7}>
          <MainCard 
            title={
              <div className="title-with-action">
                <span>Evaluaciones</span>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={expandAll ? <IconChevronUp /> : <IconChevronDown />}
                  onClick={handleExpandToggle}
                >
                  {expandAll ? 'Contraer todo' : 'Expandir todo'}
                </Button>
              </div>
            } 
            className="content-card"
          >
            <Evaluations
              schoolYear={courseSchoolYear.schoolYear}
              evaluations={evaluations}
              loading={isLoadingEvaluations}
              courseSchoolYear={courseSchoolYear}
              onAddEvaluation={handleAddEvaluation}
              onEditEvaluation={handleEditEvaluation}
              onDeleteEvaluation={handleDeleteEvaluation}
              setLapseExpanded={setLapseExpanded}
              setCourtExpanded={setCourtExpanded}
            />
          </MainCard>
        </Grid>
        {/* Card de Estudiantes */}
        <Grid item xs={12} lg={5}>
          <MainCard title="Estudiantes Inscritos" className="content-card">
            <Students
              courseSchoolYearId={courseSchoolYear.id}
              students={students}
              loading={isLoadingStudents}
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

  .title-with-action {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;
