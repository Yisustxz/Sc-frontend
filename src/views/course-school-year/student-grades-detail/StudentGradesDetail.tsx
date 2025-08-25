import { FunctionComponent, useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack
} from '@mui/material';
import { IconUser, IconSchool, IconAward, IconEdit, IconDeviceFloppy, IconX, IconChevronDown, IconCalendar } from '@tabler/icons';
import MainCard from 'components/cards/MainCard';
import BreadcrumbsNav from 'components/BreadcrumbsNav';
import { useStudentGradesDetail } from 'hooks/use-student-grades-detail';
import { 
  calculateCourtGrade, 
  calculateLapseGrade, 
  EvaluationForCalculation,
  CourtForCalculation,
  LapseForCalculation 
} from 'core/evaluations';
import { updateStudentGrades, UpdateStudentEvaluationGrade } from 'services/course-school-year/update-student-grades';
import { useDispatch } from 'react-redux';
import { setSuccessMessage, setErrorMessage } from 'store/customizationSlice';
import BackendError from 'exceptions/backend-error';

interface StudentGradesDetailProps {
  className?: string;
}

const StudentGradesDetail: FunctionComponent<StudentGradesDetailProps> = ({ className }) => {
  const dispatch = useDispatch();
  const { courseSchoolYearId, studentId } = useParams<{
    courseSchoolYearId: string;
    studentId: string;
  }>();

  const { data, loading, error, refetch } = useStudentGradesDetail(
    Number(courseSchoolYearId),
    Number(studentId)
  );

  // Estado para modo de edición
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedGrades, setEditedGrades] = useState<Record<number, {
    qualification: string;
    didNotPresent: boolean;
  }>>({});

  const getQualificationColor = (qualification: number | null, didNotPresent: boolean): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    if (didNotPresent) return 'error';
    if (qualification === null) return 'info';
    if (qualification >= 16) return 'success';
    if (qualification >= 10) return 'warning';
    return 'error';
  };

  const getQualificationLabel = (qualification: number | null, didNotPresent: boolean): string => {
    if (didNotPresent) return 'No Presentó';
    if (qualification === null) return 'Sin Calificar';
    return qualification.toString();
  };

  // Obtener color para el tipo de evaluación (basado en evaluation-details.tsx)
  const getEvaluationTypeColor = (type: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (type) {
      case 'exam':
        return 'primary';
      case 'homework':
        return 'success';
      case 'project':
        return 'info';
      case 'practice':
        return 'warning';
      case 'lapse-exam':
        return 'error';
      case 'task':
        return 'secondary';
      case 'workshop':
        return 'default';
      default:
        return 'default';
    }
  };

  // Agrupar y ordenar evaluaciones por lapso y corte
  const organizedEvaluations = useMemo(() => {
    if (!data?.evaluations) return {};
    
    // Primero ordenar todas las evaluaciones por lapso, corte, correlativo
    const sortedEvaluations = [...data.evaluations].sort((a, b) => {
      // Ordenar por lapso
      if (a.schoolCourt.lapseNumber !== b.schoolCourt.lapseNumber) {
        return a.schoolCourt.lapseNumber - b.schoolCourt.lapseNumber;
      }
      // Luego por corte (id del corte)
      if (a.schoolCourt.id !== b.schoolCourt.id) {
        return a.schoolCourt.id - b.schoolCourt.id;
      }
      // Finalmente por correlativo
      return (a.correlative || 0) - (b.correlative || 0);
    });

    // Agrupar por lapso, luego por corte
    const grouped = sortedEvaluations.reduce((acc, evaluation) => {
      const lapseNumber = evaluation.schoolCourt.lapseNumber;
      const courtId = evaluation.schoolCourt.id;
      
      if (!acc[lapseNumber]) {
        acc[lapseNumber] = {};
      }
      if (!acc[lapseNumber][courtId]) {
        acc[lapseNumber][courtId] = {
          courtInfo: evaluation.schoolCourt,
          evaluations: []
        };
      }
      acc[lapseNumber][courtId].evaluations.push(evaluation);
      return acc;
    }, {} as Record<number, Record<number, { courtInfo: any; evaluations: any[] }>>);

    return grouped;
  }, [data]);

  // Helper: Convertir evaluación del API al formato del algoritmo
  const convertToEvaluationForCalculation = (evaluation: any): EvaluationForCalculation => {
    let didNotPresent = evaluation.didNotPresent;
    let qualification = evaluation.qualification;
    
    // Si estamos editando, usar los valores editados
    if (isEditing && editedGrades[evaluation.evaluationId]) {
      const edited = editedGrades[evaluation.evaluationId];
      didNotPresent = edited.didNotPresent;
      qualification = edited.qualification !== '' ? parseFloat(edited.qualification) : null;
    }
    
    return {
      evaluationId: evaluation.evaluationId,
      percentage: parseFloat(evaluation.percentage),
      qualification: qualification !== null ? parseFloat(qualification) : null,
      didNotPresent,
    };
  };

  // Helper: Calcular nota de corte usando el algoritmo centralizado
  const calculateCourtGradeFromEvaluations = (evaluations: any[]): number | null => {
    const courtData: CourtForCalculation = {
      courtId: 0, // No importa para el cálculo
      evaluations: evaluations.map(convertToEvaluationForCalculation),
    };
    
    const result = calculateCourtGrade(courtData);
    return result.grade;
  };

  // Helper: Calcular nota de lapso usando el algoritmo centralizado
  const calculateLapseGradeFromEvaluations = (lapseEvaluations: Record<number, { courtInfo: any; evaluations: any[] }>): number | null => {
    const courts: CourtForCalculation[] = Object.entries(lapseEvaluations).map(([courtId, courtData]) => ({
      courtId: parseInt(courtId),
      evaluations: courtData.evaluations.map(convertToEvaluationForCalculation),
    }));
    
    const lapseData: LapseForCalculation = {
      lapseNumber: 0, // No importa para el cálculo
      courts,
    };
    
    const result = calculateLapseGrade(lapseData);
    return result.grade;
  };

  // Inicializar las notas editables cuando se cargan los datos
  useEffect(() => {
    if (data && data.evaluations.length > 0) {
      const initialGrades: Record<number, { qualification: string; didNotPresent: boolean }> = {};
      data.evaluations.forEach(evaluation => {
        initialGrades[evaluation.evaluationId] = {
          qualification: evaluation.qualification !== null ? evaluation.qualification.toString() : '',
          didNotPresent: evaluation.didNotPresent
        };
      });
      setEditedGrades(initialGrades);
    }
  }, [data]);

  // Manejadores para la edición
  const handleStartEditing = () => {
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    // Resetear las calificaciones editadas a los valores originales
    if (data) {
      const resetGrades: Record<number, { qualification: string; didNotPresent: boolean }> = {};
      data.evaluations.forEach(evaluation => {
        resetGrades[evaluation.evaluationId] = {
          qualification: evaluation.qualification !== null ? evaluation.qualification.toString() : '',
          didNotPresent: evaluation.didNotPresent
        };
      });
      setEditedGrades(resetGrades);
    }
  };

  const handleQualificationChange = (evaluationId: number, value: string) => {
    // Validar que el valor esté entre 0 y 20
    const numValue = parseFloat(value);
    if (value !== '' && (isNaN(numValue) || numValue < 0 || numValue > 20)) {
      return; // No actualizar si está fuera del rango
    }
    
    setEditedGrades(prev => ({
      ...prev,
      [evaluationId]: {
        ...prev[evaluationId],
        qualification: value
      }
    }));
  };

  const handleDidNotPresentChange = (evaluationId: number, checked: boolean) => {
    setEditedGrades(prev => ({
      ...prev,
      [evaluationId]: {
        qualification: checked ? '' : prev[evaluationId]?.qualification || '',
        didNotPresent: checked
      }
    }));
  };

  // Verificar si hay cambios pendientes
  const hasChanges = useMemo(() => {
    if (!data) return false;
    return data.evaluations.some(evaluation => {
      const edited = editedGrades[evaluation.evaluationId];
      if (!edited) return false;
      
      const currentQualification = evaluation.qualification !== null ? evaluation.qualification.toString() : '';
      return edited.qualification !== currentQualification || edited.didNotPresent !== evaluation.didNotPresent;
    });
  }, [data, editedGrades]);

  // Guardar todas las calificaciones
  const handleSaveGrades = async () => {
    if (!data || !courseSchoolYearId || !studentId) return;

    try {
      setIsSaving(true);

      // Preparar datos para la actualización
      const evaluationsToUpdate: UpdateStudentEvaluationGrade[] = Object.entries(editedGrades).map(([evaluationId, gradeData]) => ({
        evaluationId: parseInt(evaluationId),
        qualification: gradeData.didNotPresent ? null : (gradeData.qualification ? parseFloat(gradeData.qualification) : null),
        didNotPresent: gradeData.didNotPresent
      }));

      const updateData = {
        evaluations: evaluationsToUpdate
      };

      // Llamar al servicio de actualización
      await updateStudentGrades(
        Number(courseSchoolYearId), 
        Number(studentId), 
        updateData
      );

      dispatch(setSuccessMessage('Calificaciones actualizadas correctamente'));
      
      // Refrescar los datos
      refetch();
      
      // Salir del modo de edición
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving student grades:', error);
      if (error instanceof BackendError) {
        dispatch(setErrorMessage(`Error al guardar calificaciones: ${error.message}`));
      } else {
        dispatch(setErrorMessage('Error inesperado al guardar calificaciones'));
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Breadcrumbs
  const breadcrumbItems = [
    {
      path: '/course-school-year',
      label: 'Asignaturas x Años Escolares'
    },
    {
      path: `/course-school-year/detail/${courseSchoolYearId}`,
      label: data?.course.name || 'Detalle del Curso'
    },
    {
      label: `Notas de ${data?.studentName} ${data?.studentLastName}`
    }
  ];

  if (loading) {
    return (
      <div className={className}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress size={60} />
        </Box>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <Box sx={{ mb: 3 }}>
          <BreadcrumbsNav items={breadcrumbItems} />
        </Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={refetch}>
          Reintentar
        </Button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={className}>
        <Alert severity="warning">
          No se encontraron datos del estudiante
        </Alert>
      </div>
    );
  }

  // Renderizar tabla de evaluaciones
  const renderEvaluationsTable = (evaluations: any[]) => {
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
              <TableCell sx={{ fontWeight: 'bold', py: 2.5 }}>Evaluación</TableCell>
              <TableCell sx={{ fontWeight: 'bold', py: 2.5 }} align="center">Tipo</TableCell>
              <TableCell sx={{ fontWeight: 'bold', py: 2.5 }} align="center">Peso</TableCell>
              <TableCell sx={{ fontWeight: 'bold', py: 2.5 }} align="center">Fecha</TableCell>
              <TableCell sx={{ fontWeight: 'bold', py: 2.5 }} align="center">Calificación</TableCell>
              {isEditing && <TableCell sx={{ fontWeight: 'bold', py: 2.5 }} align="center">No Presentó</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {evaluations.map((evaluation) => {
              const editedData = editedGrades[evaluation.evaluationId] || {
                qualification: evaluation.qualification !== null ? evaluation.qualification.toString() : '',
                didNotPresent: evaluation.didNotPresent
              };

              return (
                <TableRow key={evaluation.evaluationId} hover sx={{ '& > *': { py: 2.5 } }}>
                  {/* Nombre de la evaluación */}
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {evaluation.evaluationName}
                      </Typography>
                      {evaluation.correlative && (
                        <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>
                          #{evaluation.correlative}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>

                  {/* Tipo de evaluación */}
                  <TableCell align="center">
                    <Chip 
                      label={evaluation.evaluationType}
                      size="small"
                      variant="outlined"
                      color={getEvaluationTypeColor(evaluation.evaluationType)}
                    />
                  </TableCell>

                  {/* Porcentaje */}
                  <TableCell align="center">
                    <Typography variant="body1">
                      {evaluation.percentage}%
                    </Typography>
                  </TableCell>

                  {/* Fecha proyectada */}
                  <TableCell align="center">
                    {evaluation.projectedDate ? (
                      <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                        <IconCalendar size="0.9rem" />
                        <Typography variant="body2">
                          {new Date(evaluation.projectedDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="caption" color="textSecondary">
                        -
                      </Typography>
                    )}
                  </TableCell>

                  {/* Calificación */}
                  <TableCell align="center">
                    {!isEditing ? (
                      <Chip
                        label={getQualificationLabel(evaluation.qualification, evaluation.didNotPresent)}
                        color={getQualificationColor(evaluation.qualification, evaluation.didNotPresent)}
                        size="small"
                      />
                    ) : (
                      <Box display="flex" alignItems="center" justifyContent="center">
                        {editedData.didNotPresent ? (
                          <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
                            No presentó
                          </Typography>
                        ) : (
                          <TextField
                            size="small"
                            value={editedData.qualification}
                            onChange={(e) => handleQualificationChange(evaluation.evaluationId, e.target.value)}
                            type="number"
                            inputProps={{ min: 0, max: 20, step: 0.5 }}
                            sx={{ 
                              width: '80px', 
                              '& .MuiInputBase-input': { 
                                fontSize: '0.8rem', 
                                py: '6px',
                                textAlign: 'center'
                              } 
                            }}
                            placeholder="0-20"
                          />
                        )}
                      </Box>
                    )}
                  </TableCell>

                  {/* No Presentó checkbox (solo en modo edición) */}
                  {isEditing && (
                    <TableCell align="center">
                      <Stack alignItems="center" spacing={0.5}>
                        <Checkbox
                          checked={editedData.didNotPresent}
                          onChange={(e) => handleDidNotPresentChange(evaluation.evaluationId, e.target.checked)}
                          size="small"
                          sx={{ p: 0.5 }}
                        />
                        <Typography variant="caption" color="textSecondary">
                          No presentó
                        </Typography>
                      </Stack>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div className={className}>
      {/* Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <BreadcrumbsNav items={breadcrumbItems} />
      </Box>

      <Grid container spacing={2}>
        {/* Información del estudiante y curso */}
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2, mb: 1 }}>
            <Grid container spacing={3} alignItems="center">
              {/* Información del estudiante */}
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <IconUser size="1.2rem" />
                  <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 600 }}>
                    {data.studentName} {data.studentLastName}
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Cédula: {data.studentDni}
                </Typography>
              </Grid>

              {/* Información del curso */}
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <IconSchool size="1.2rem" />
                  <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 600 }}>
                    {data.course.name}
                  </Typography>
                </Box>
                <Typography variant="body2" color="textSecondary">
                  {data.course.grade} - {data.schoolYear.code}
                </Typography>
              </Grid>

              {/* Calificación final */}
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconAward size="1.2rem" />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Calificación Final:
                  </Typography>
                  <Chip
                    label={data.finalGrade !== null ? data.finalGrade : 'Sin Calificar'}
                    color={getQualificationColor(data.finalGrade, false)}
                    size="medium"
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Evaluaciones por lapso */}
        <Grid item xs={12}>
          <MainCard title={
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconAward size="1.5rem" />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  Evaluaciones y Calificaciones
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {!isEditing ? (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<IconEdit size="1rem" />}
                    onClick={handleStartEditing}
                    disabled={!data || data.evaluations.length === 0}
                  >
                    Editar Notas
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      startIcon={<IconDeviceFloppy size="1rem" />}
                      onClick={handleSaveGrades}
                      disabled={!hasChanges || isSaving}
                    >
                      {isSaving ? 'Guardando...' : 'Guardar'}
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<IconX size="1rem" />}
                      onClick={handleCancelEditing}
                      disabled={isSaving}
                    >
                      Cancelar
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          }>
            {Object.keys(organizedEvaluations).length === 0 ? (
              <Alert severity="info">
                No hay evaluaciones registradas para este curso
              </Alert>
            ) : (
              Object.keys(organizedEvaluations)
                .sort((a, b) => Number(a) - Number(b))
                .map((lapseNumber) => {
                  const lapseData = organizedEvaluations[Number(lapseNumber)];
                  const lapseGrade = calculateLapseGradeFromEvaluations(lapseData);
                  
                  return (
                    <Accordion key={lapseNumber} defaultExpanded sx={{ mb: 2, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
                      <AccordionSummary
                        expandIcon={<IconChevronDown />}
                        sx={{ 
                          backgroundColor: 'primary.light',
                          color: 'primary.contrastText',
                          minHeight: 48,
                          '&.Mui-expanded': {
                            minHeight: 48,
                          }
                        }}
                      >
                        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                            Lapso {lapseNumber}
                          </Typography>
                          {lapseGrade !== null && (
                            <Box display="flex" alignItems="center" gap={1} mr={2}>
                              <Typography variant="body1" sx={{ color: '#000000', fontWeight: 500 }}>
                                Nota del Lapso:
                              </Typography>
                              <Chip
                                label={lapseGrade.toFixed(2)}
                                size="medium"
                                sx={{ 
                                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                  color: 'primary.main',
                                  fontWeight: 600,
                                  borderColor: 'rgba(255, 255, 255, 1)',
                                  '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 1)'
                                  }
                                }}
                                variant="outlined"
                              />
                            </Box>
                          )}
                        </Box>
                      </AccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                      {Object.keys(organizedEvaluations[Number(lapseNumber)])
                        .sort((a, b) => Number(a) - Number(b))
                        .map((courtId) => {
                          const courtData = organizedEvaluations[Number(lapseNumber)][Number(courtId)];
                          const courtGrade = calculateCourtGradeFromEvaluations(courtData.evaluations);
                          
                          return (
                            <Accordion 
                              key={courtId} 
                              defaultExpanded 
                              sx={{ 
                                boxShadow: 'none', 
                                border: 'none',
                                '&:before': { display: 'none' },
                                '& .MuiAccordionSummary-root': {
                                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                                  borderTop: '1px solid',
                                  borderColor: 'divider',
                                  minHeight: 40
                                }
                              }}
                            >
                              <AccordionSummary
                                expandIcon={<IconChevronDown />}
                                sx={{ py: 1 }}
                              >
                                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                                  <Typography variant="subtitle1" sx={{ fontWeight: 500, fontSize: '1rem' }}>
                                    Corte {courtData.courtInfo.id}
                                    {courtData.courtInfo.startDate && courtData.courtInfo.endDate && (
                                      <>: {new Date(courtData.courtInfo.startDate).toLocaleDateString()} - {new Date(courtData.courtInfo.endDate).toLocaleDateString()}</>
                                    )}
                                  </Typography>
                                  <Box display="flex" alignItems="center" gap={2} mr={2}>
                                    <Typography variant="body2" color="textSecondary">
                                      {courtData.evaluations.length} evaluación(es)
                                    </Typography>
                                    {courtGrade !== null && (
                                      <Box display="flex" alignItems="center" gap={1}>
                                        <Typography variant="body2" color="textSecondary">
                                          Acumulado:
                                        </Typography>
                                        <Chip
                                          label={courtGrade.toFixed(2)}
                                          size="small"
                                          variant="filled"
                                          sx={{ 
                                            color: 'text.disabled',
                                            backgroundColor: 'rgba(0, 0, 0, 0.08)',
                                            fontWeight: 500
                                          }}
                                        />
                                      </Box>
                                    )}
                                  </Box>
                                </Box>
                              </AccordionSummary>
                              <AccordionDetails sx={{ p: 0, pb: 2 }}>
                                {renderEvaluationsTable(courtData.evaluations)}
                              </AccordionDetails>
                            </Accordion>
                          );
                        })
                      }
                    </AccordionDetails>
                  </Accordion>
                  );
                })
            )}
          </MainCard>
        </Grid>
      </Grid>
    </div>
  );
};

export default StudentGradesDetail;
