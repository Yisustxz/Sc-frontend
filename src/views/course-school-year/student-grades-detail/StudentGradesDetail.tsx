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
  Card,
  CardContent,
  Divider,
  TextField,
  Checkbox
} from '@mui/material';
import { IconUser, IconSchool, IconAward, IconEdit, IconDeviceFloppy, IconX } from '@tabler/icons';
import MainCard from 'components/cards/MainCard';
import BreadcrumbsNav from 'components/BreadcrumbsNav';
import { useStudentGradesDetail } from 'hooks/use-student-grades-detail';
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
      const response = await updateStudentGrades(
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

  // Funciones para renderizar celdas editables
  const renderQualificationCell = (evaluation: any) => {
    const editedData = editedGrades[evaluation.evaluationId] || {
      qualification: evaluation.qualification !== null ? evaluation.qualification.toString() : '',
      didNotPresent: evaluation.didNotPresent
    };

    if (!isEditing) {
      // Modo visualización
      return (
        <Chip
          label={getQualificationLabel(evaluation.qualification, evaluation.didNotPresent)}
          color={getQualificationColor(evaluation.qualification, evaluation.didNotPresent)}
          size="small"
        />
      );
    }

    // Modo edición
    if (editedData.didNotPresent) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body2" color="textSecondary" sx={{ fontStyle: 'italic' }}>
            No presentó
          </Typography>
        </Box>
      );
    }

    return (
      <TextField
        size="small"
        value={editedData.qualification}
        onChange={(e) => handleQualificationChange(evaluation.evaluationId, e.target.value)}
        type="number"
        inputProps={{ min: 0, max: 20, step: 0.5 }}
        sx={{ width: '100px' }}
        placeholder="0-20"
      />
    );
  };

  const renderDidNotPresentCell = (evaluation: any) => {
    const editedData = editedGrades[evaluation.evaluationId] || {
      qualification: evaluation.qualification !== null ? evaluation.qualification.toString() : '',
      didNotPresent: evaluation.didNotPresent
    };

    if (!isEditing) {
      // Modo visualización - no mostrar nada o mostrar un icono si no presentó
      return null;
    }

    // Modo edición
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.2 }}>
        <Checkbox
          checked={editedData.didNotPresent}
          onChange={(e) => handleDidNotPresentChange(evaluation.evaluationId, e.target.checked)}
          color="primary"
          size="small"
          sx={{ padding: '2px' }}
        />
        <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.65rem', textAlign: 'center', lineHeight: 1 }}>
          No presentó
        </Typography>
      </Box>
    );
  };

  // Agrupar evaluaciones por lapso
  const evaluationsByLapse = data.evaluations.reduce((acc, evaluation) => {
    const lapseNumber = evaluation.schoolCourt.lapseNumber;
    if (!acc[lapseNumber]) {
      acc[lapseNumber] = [];
    }
    acc[lapseNumber].push(evaluation);
    return acc;
  }, {} as Record<number, typeof data.evaluations>);

  return (
    <div className={className}>
      {/* Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <BreadcrumbsNav items={breadcrumbItems} />
      </Box>

      <Grid container spacing={3}>
        {/* Información del estudiante y curso */}
        <Grid item xs={12}>
          <MainCard>
            <Grid container spacing={3}>
              {/* Información del estudiante */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <IconUser size="1.5rem" />
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        Información del Estudiante
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Nombre:</strong> {data.studentName} {data.studentLastName}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Cédula:</strong> {data.studentDni}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                        Calificación Final:
                      </Typography>
                      <Chip
                        label={data.finalGrade !== null ? data.finalGrade : 'Sin Calificar'}
                        color={getQualificationColor(data.finalGrade, false)}
                        size="medium"
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Información del curso */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <IconSchool size="1.5rem" />
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        Información del Curso
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Asignatura:</strong> {data.course.name}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Grado:</strong> {data.course.grade}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Año Escolar:</strong> {data.schoolYear.code}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </MainCard>
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
            {Object.keys(evaluationsByLapse).length === 0 ? (
              <Alert severity="info">
                No hay evaluaciones registradas para este curso
              </Alert>
            ) : (
              Object.keys(evaluationsByLapse)
                .sort((a, b) => Number(a) - Number(b))
                .map((lapseNumber) => (
                  <Box key={lapseNumber} sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                      {evaluationsByLapse[Number(lapseNumber)][0].schoolCourt.lapseName}
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Evaluación</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell align="center">Porcentaje</TableCell>
                            <TableCell align="center">Fecha Proyectada</TableCell>
                            <TableCell align="center">Calificación</TableCell>
                            {isEditing && <TableCell align="center">No Presentó</TableCell>}
                            <TableCell align="center">Fecha Calificación</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {evaluationsByLapse[Number(lapseNumber)].map((evaluation) => (
                            <TableRow key={evaluation.evaluationId}>
                              <TableCell>
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {evaluation.evaluationName}
                                  </Typography>
                                  {evaluation.correlative && (
                                    <Typography variant="caption" color="textSecondary">
                                      #{evaluation.correlative}
                                    </Typography>
                                  )}
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip 
                                  label={evaluation.evaluationType}
                                  size="small"
                                  variant="outlined"
                                  color={getEvaluationTypeColor(evaluation.evaluationType)}
                                />
                              </TableCell>
                              <TableCell align="center">
                                {evaluation.percentage}%
                              </TableCell>
                              <TableCell align="center">
                                {evaluation.projectedDate ? 
                                  new Date(evaluation.projectedDate).toLocaleDateString() : 
                                  '-'
                                }
                              </TableCell>
                              <TableCell align="center">
                                {renderQualificationCell(evaluation)}
                              </TableCell>
                              {isEditing && (
                                <TableCell align="center">
                                  {renderDidNotPresentCell(evaluation)}
                                </TableCell>
                              )}
                              <TableCell align="center">
                                {evaluation.qualificationDate ? 
                                  new Date(evaluation.qualificationDate).toLocaleDateString() : 
                                  '-'
                                }
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                ))
            )}
          </MainCard>
        </Grid>
      </Grid>
    </div>
  );
};

export default StudentGradesDetail;
