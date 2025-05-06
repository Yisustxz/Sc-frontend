import { FunctionComponent, useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Typography, Grid, Box, Button, Pagination } from '@mui/material';
import useInscriptionById from '../hooks/use-inscription-by-id';
import useInscriptionId from '../hooks/use-inscription-id';
import BreadcrumbsNav from 'components/BreadcrumbsNav';
import MainCard from 'components/cards/MainCard';
import DynamicTable from 'components/DynamicTable';
import { 
  IconCalendar, 
  IconUser, 
  IconSchool, 
  IconUsers,
  IconId,
  IconCertificate,
  IconEdit,
  IconTrash,
  IconBookUpload
} from '@tabler/icons';
import { gradeMapping, EducationLevels } from 'core/courses/use-education-levels';
import { AttemptType } from 'core/inscriptions/types';

  // Función para convertir número de grado a texto
  const getGradeLabel = (grade: string): string => {
    const gradeNumber = parseInt(grade);
    if (gradeNumber >= 1 && gradeNumber <= 11) {
      return gradeMapping[gradeNumber as EducationLevels] || `Grado ${grade}`;
    }
    return `Grado ${grade}`;
  };

// Cantidad de elementos por página
const ITEMS_PER_PAGE = 8;

const DetailInscription: FunctionComponent<Props> = ({ className }) => {
  const inscriptionId = useInscriptionId();
  const inscription = useInscriptionById(inscriptionId);
  
  // Estado para la paginación local
  const [page, setPage] = useState(1);

  // Función para formatear el tipo de intento
  const getAttemptTypeLabel = (type: AttemptType | undefined): string => {
    if (!type) return 'Normal';
    
    switch (type) {
      case AttemptType.NORMAL_ATTEMPT:
        return 'Normal';
      case AttemptType.FULL_GRADE_REPEATER:
        return 'Repitiente de grado';
      case AttemptType.COURSE_REPEATER:
        return 'Repitiente de curso';
      default:
        return 'Normal';
    }
  };

  // Manejador de cambio de página
  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  }, []);

  // Obtener las inscripciones para la página actual
  const getPaginatedCourseInscriptions = useCallback(() => {
    if (!inscription?.courseInscriptions?.length) return [];
    
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    
    return inscription.courseInscriptions.slice(startIndex, endIndex);
  }, [inscription, page]);

  // Calcular el número total de páginas
  const totalPages = useMemo(() => {
    if (!inscription?.courseInscriptions?.length) return 0;
    return Math.ceil(inscription.courseInscriptions.length / ITEMS_PER_PAGE);
  }, [inscription]);

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

  // Simular acciones para los botones (sin funcionalidad real)
  const handleEdit = useCallback((courseInscription: any) => {
    console.log('Editar materia inscrita:', courseInscription);
    // Esta función no hace nada, solo se incluye para simular la acción
  }, []);

  const handleDelete = useCallback((courseInscription: any) => {
    console.log('Eliminar materia inscrita:', courseInscription);
    // Esta función no hace nada, solo se incluye para simular la acción
  }, []);

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

          {/* DynamicTable para materias inscritas - 8 columnas */}
          <Grid item xs={12} md={8}>
            <MainCard title={`Materias Inscritas (${inscription.courseInscriptions?.length || 0})`} className="courses-card">
              {inscription.courseInscriptions && inscription.courseInscriptions.length > 0 ? (
                <>
                  <DynamicTable
                    headers={[
                      {
                        columnLabel: 'Asignatura', cellAlignment: 'left',
                        onRender: (row) => (
                          <Box className="course-cell">
                            <span>{row.course?.name}</span>
                          </Box>
                        )
                       },
                      { 
                        columnLabel: 'Tipo', 
                        cellAlignment: 'center',
                        onRender: (row) => (
                          <Box className="attempt-type-cell">
                            <span>{getAttemptTypeLabel(row.attemptType)}</span>
                          </Box>
                        ) 
                      },
                      { 
                        columnLabel: 'Calificación', 
                        cellAlignment: 'center',
                        onRender: (row) => (
                          <Box className="qualification-cell">
                            <IconCertificate className="icon" size={16} />
                            <span>{row.endQualification !== undefined && row.endQualification !== null ? row.endQualification : 'N/A'}</span>
                          </Box>
                        ) 
                      }
                    ]}
                    rows={getPaginatedCourseInscriptions().map(ci => ({
                      id: ci.id,
                      course: ci.courseSchoolYear?.course,
                      attemptType: ci.attemptType || undefined,
                      endQualification: ci.endQualification || null
                    }))}
                    components={[
                      (row) => (
                        <Button
                          size="small"
                          onClick={() => handleEdit(row)}
                          startIcon={<IconEdit color="#2196f3" size="1rem" />}
                        >
                          Editar
                        </Button>
                      ),
                      (row) => (
                        <Button
                          color="secondary"
                          size="small"
                          onClick={() => handleDelete(row)}
                          startIcon={<IconTrash size="1rem" />}
                        >
                          Eliminar
                        </Button>
                      )
                    ]}
                    emptyState={
                      <Box className="empty-state">
                        <Typography variant="body2">No hay materias inscritas</Typography>
                      </Box>
                    }
                  />

                  {/* Paginación local */}
                  {totalPages > 1 && (
                    <Box className="paginator-container">
                      <Pagination
                        count={totalPages}
                        page={page}
                        variant="outlined"
                        shape="rounded"
                        color="primary"
                        onChange={handlePageChange}
                      />
                    </Box>
                  )}
                </>
              ) : (
                <Box className="empty-state">
                  <Typography variant="body2">No hay materias inscritas</Typography>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    startIcon={<IconBookUpload size={18} />}
                    onClick={() => console.log('Importar materias')}
                  >
                    Importar Materias
                  </Button>
                </Box>
              )}
            </MainCard>
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

  .qualification-cell, .attempt-type-cell {
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
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }
`; 