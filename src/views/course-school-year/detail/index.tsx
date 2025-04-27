import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Typography, Grid, Box, Divider } from '@mui/material';
import useCourseSchoolYearById from './use-course-school-year-by-id';
import useCourseSchoolYearId from './use-course-school-year-id';
import BreadcrumbsNav from 'components/BreadcrumbsNav';
import MainCard from 'components/cards/MainCard';
import { IconBook, IconCalendar, IconUser, IconClock, IconSchool } from '@tabler/icons';
import { gradeMapping, EducationLevels } from 'core/courses/use-education-levels';

const DetailCourseSchoolYear: FunctionComponent<Props> = ({ className }) => {
  const courseSchoolYearId = useCourseSchoolYearId();
  const courseSchoolYear = useCourseSchoolYearById(courseSchoolYearId);

  // Función para convertir número de grado a texto
  const getGradeLabel = (grade: number): string => {
    if (grade >= 1 && grade <= 11) {
      return gradeMapping[grade as EducationLevels] || `Grado ${grade}`;
    }
    return `Grado ${grade}`;
  };

  // Construir elementos de navegación de migas de pan
  const breadcrumbsItems = courseSchoolYear
    ? [
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
      ]
    : [
        {
          label: 'Asignaturas por Año Escolar',
          path: '/course-school-year'
        },
        {
          label: 'Detalle de Asignatura'
        }
      ];

  return (
    <div className={className}>
      <BreadcrumbsNav items={breadcrumbsItems} />

      {courseSchoolYear && (
        <MainCard title="Detalle de Asignatura por Año Escolar" className="detail-card">
          <Grid container spacing={2}>
            {/* Información básica */}
            <Grid item xs={12}>
              <Grid container spacing={1} className="info-grid">
                {/* Asignatura */}
                <Grid item xs={12} sm={6} md={4}>
                  <Box className="info-item">
                    <IconBook className="icon" size={18} />
                    <Box>
                      <Typography variant="caption" color="textSecondary" className="info-label">
                        Asignatura
                      </Typography>
                      <Typography variant="body2" className="info-value">
                        {courseSchoolYear.course?.name || 'Sin asignatura'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                {/* Año Escolar */}
                <Grid item xs={12} sm={6} md={4}>
                  <Box className="info-item">
                    <IconCalendar className="icon" size={18} />
                    <Box>
                      <Typography variant="caption" color="textSecondary" className="info-label">
                        Año Escolar
                      </Typography>
                      <Typography variant="body2" className="info-value">
                        {courseSchoolYear.schoolYear?.code || 'Sin año escolar'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                {/* Grado */}
                <Grid item xs={12} sm={6} md={4}>
                  <Box className="info-item">
                    <IconSchool className="icon" size={18} />
                    <Box>
                      <Typography variant="caption" color="textSecondary" className="info-label">
                        Grado
                      </Typography>
                      <Typography variant="body2" className="info-value">
                        {getGradeLabel(courseSchoolYear.grade)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                {/* Profesor */}
                <Grid item xs={12} sm={6} md={4}>
                  <Box className="info-item">
                    <IconUser className="icon" size={18} />
                    <Box>
                      <Typography variant="caption" color="textSecondary" className="info-label">
                        Profesor
                      </Typography>
                      <Typography variant="body2" className="info-value">
                        {courseSchoolYear.professor 
                          ? `${courseSchoolYear.professor.name} ${courseSchoolYear.professor.lastName}` 
                          : 'Sin asignar'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                {/* Horas Semanales */}
                <Grid item xs={12} sm={6} md={4}>
                  <Box className="info-item">
                    <IconClock className="icon" size={18} />
                    <Box>
                      <Typography variant="caption" color="textSecondary" className="info-label">
                        Horas Semanales
                      </Typography>
                      <Typography variant="body2" className="info-value">
                        {courseSchoolYear.weeklyHours || 'No especificadas'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            
            {/* Nota: Las secciones de evaluaciones y estudiantes se implementarán en el futuro */}
          </Grid>
        </MainCard>
      )}
    </div>
  );
};

interface Props {
  className?: string;
}

export default styled(DetailCourseSchoolYear)`
  display: flex;
  flex-direction: column;
  gap: 20px;

  .detail-card {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }

  .info-grid {
  }

  .info-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 4px;
    border-radius: 4px;
  }

  .icon {
    color: #5e35b1;
    margin-top: 2px;
    flex-shrink: 0;
  }

  .info-label {
    display: block;
    font-size: 11px;
    margin-bottom: 2px;
  }

  .info-value {
    font-weight: 500;
    font-size: 13px;
    line-height: 1.2;
    word-break: break-word;
  }
`; 