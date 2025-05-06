import { FunctionComponent, useMemo } from 'react';
import styled from 'styled-components';
import { Typography, Grid, Box } from '@mui/material';
import useInscriptionById from '../hooks/use-inscription-by-id';
import useInscriptionId from '../hooks/use-inscription-id';
import BreadcrumbsNav from 'components/BreadcrumbsNav';
import MainCard from 'components/cards/MainCard';
import { 
  IconCalendar, 
  IconUser, 
  IconSchool, 
  IconUsers,
  IconId
} from '@tabler/icons';
import { gradeMapping, EducationLevels } from 'core/courses/use-education-levels';
import CourseInscriptions from './course-inscriptions';

// Función para convertir número de grado a texto
const getGradeLabel = (grade: string): string => {
  const gradeNumber = parseInt(grade);
  if (gradeNumber >= 1 && gradeNumber <= 11) {
    return gradeMapping[gradeNumber as EducationLevels] || `Grado ${grade}`;
  }
  return `Grado ${grade}`;
};

const DetailInscription: FunctionComponent<Props> = ({ className }) => {
  const inscriptionId = useInscriptionId();
  const inscription = useInscriptionById(inscriptionId);

  // Construir elementos de navegación de migas de pan
  const breadcrumbsItems = inscription
    ? [
      {
        label: 'Inscripciones',
        path: '/inscriptions'
      },
      {
        label: inscription.schoolYear?.code || 'Año Escolar',
        path: '/school-years'
      },
      {
        label: `${inscription.student?.name || ''} ${inscription.student?.lastName || ''}`
      }
    ]
    : [
      {
        label: 'Inscripciones',
        path: '/inscriptions'
      },
      {
        label: 'Detalle de Inscripción'
      }
    ];

  const courseInscriptions = useMemo(() => {
    return inscription?.courseInscriptions || [];
  }, [inscription]);
  
  return (
    <div className={className}>
      <BreadcrumbsNav items={breadcrumbsItems} />

      {inscription && (
        <Grid container spacing={2}>
          {/* Card de información básica - 4 columnas */}
          <Grid item xs={12} md={4}>
            <MainCard title="Detalle de Inscripción" className="detail-card">
              <Grid container spacing={3} direction="column">
                {/* Estudiante */}
                <Grid item xs={12}>
                  <Box className="info-item">
                    <IconUser className="icon" size={20} />
                    <Box>
                      <Typography variant="caption" color="textSecondary" className="info-label">
                        Estudiante
                      </Typography>
                      <Typography variant="body2" className="info-value">
                        {inscription.student
                          ? `${inscription.student.name} ${inscription.student.lastName || ''}`
                          : 'Sin estudiante'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* DNI Estudiante (si está disponible) */}
                {inscription.student?.dni && (
                  <Grid item xs={12}>
                    <Box className="info-item">
                      <IconId className="icon" size={20} />
                      <Box>
                        <Typography variant="caption" color="textSecondary" className="info-label">
                          DNI Estudiante
                        </Typography>
                        <Typography variant="body2" className="info-value">
                          {inscription.student.dni}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}

                {/* Año Escolar */}
                <Grid item xs={12}>
                  <Box className="info-item">
                    <IconCalendar className="icon" size={20} />
                    <Box>
                      <Typography variant="caption" color="textSecondary" className="info-label">
                        Año Escolar
                      </Typography>
                      <Typography variant="body2" className="info-value">
                        {inscription.schoolYear?.code || 'Sin año escolar'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Grado */}
                <Grid item xs={12}>
                  <Box className="info-item">
                    <IconSchool className="icon" size={20} />
                    <Box>
                      <Typography variant="caption" color="textSecondary" className="info-label">
                        Grado
                      </Typography>
                      <Typography variant="body2" className="info-value">
                        {getGradeLabel(inscription.grade)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* Representante */}
                {inscription.representative && (
                  <>
                    <Grid item xs={12}>
                      <Box className="info-item">
                        <IconUsers className="icon" size={20} />
                        <Box>
                          <Typography variant="caption" color="textSecondary" className="info-label">
                            Representante
                          </Typography>
                          <Typography variant="body2" className="info-value">
                            {`${inscription.representative.name} ${inscription.representative.lastName || ''}`}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    {/* DNI Representante (si está disponible) */}
                    {inscription.representative.dni && (
                      <Grid item xs={12}>
                        <Box className="info-item">
                          <IconId className="icon" size={20} />
                          <Box>
                            <Typography variant="caption" color="textSecondary" className="info-label">
                              DNI Representante
                            </Typography>
                            <Typography variant="body2" className="info-value">
                              {inscription.representative.dni}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    )}
                  </>
                )}
              </Grid>
            </MainCard>
          </Grid>

          {/* Componente de materias inscritas - 8 columnas */}
          <Grid item xs={12} md={8}>
            <CourseInscriptions 
              inscriptions={courseInscriptions}
              className="courses-card"
            />
          </Grid>
        </Grid>
      )}
    </div>
  );
};

interface Props {
  className?: string;
}

export default styled(DetailInscription)`
  display: flex;
  flex-direction: column;
  gap: 20px;

  .detail-card, .courses-card {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    height: 100%;
  }

  .courses-card {
    display: flex;
    flex-direction: column;
  }

  .info-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 6px 4px;
    border-radius: 4px;
  }

  .icon {
    color: #5e35b1;
    margin-top: 2px;
    flex-shrink: 0;
    font-size: 20px;
  }

  .info-label {
    display: block;
    font-size: 12px;
    margin-bottom: 3px;
    color: #666;
  }

  .info-value {
    font-weight: 500;
    font-size: 14px;
    line-height: 1.3;
    word-break: break-word;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 30px 0;
    color: #6c757d;
    gap: 8px;
  }

  .qualification-cell, .attempt-type-cell, .course-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }

  .paginator-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    padding: 8px 0;
  }
`; 