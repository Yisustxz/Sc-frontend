import { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Checkbox,
  CircularProgress,
  Button,
  Pagination
} from '@mui/material';
import { IconSearch, IconDeviceFloppy } from '@tabler/icons';
import { useDispatch } from 'react-redux';
import useStudentsQualifications from '../hooks/use-students-qualifications';
import { StudentEvaluationQualification, UpdateQualificationData, BulkUpdateQualificationsData } from 'core/evaluations/types';
import { updateBulkQualifications } from 'services/evaluations/update-qualifications';
import { setSuccessMessage, setErrorMessage, setIsLoading } from 'store/customizationSlice';
import BackendError from 'exceptions/backend-error';

interface StudentsListProps {
  evaluationId: number;
}

const StudentsList = ({ evaluationId }: StudentsListProps) => {
  const dispatch = useDispatch();
  const {
    students,
    isLoading,
    error,
    loadStudentsByEvaluation
  } = useStudentsQualifications();

  const [searchTerm, setSearchTerm] = useState('');
  const [editedQualifications, setEditedQualifications] = useState<Record<number, {
    qualification: string;
    didNotPresent: boolean;
  }>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  // Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);

  // Cargar estudiantes al montar el componente
  useEffect(() => {
    if (evaluationId) {
      loadStudentsByEvaluation(evaluationId);
    }
  }, [evaluationId, loadStudentsByEvaluation]);

  // Inicializar calificaciones editables cuando se cargan los estudiantes
  useEffect(() => {
    if (students.length > 0) {
      const initialQualifications: Record<number, { qualification: string; didNotPresent: boolean }> = {};
      students.forEach(student => {
        initialQualifications[student.courseInscriptionId] = {
          qualification: student.qualification !== null ? student.qualification.toString() : '',
          didNotPresent: student.didNotPresent
        };
      });
      setEditedQualifications(initialQualifications);
    }
  }, [students]);

  // Filtrar estudiantes según término de búsqueda (nombre, apellido o cédula)
  const filteredStudents = useMemo(() => {
    return students.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.dni.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  // Calcular paginación
  const totalItems = filteredStudents.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage) || 1;

  // Obtener estudiantes para la página actual
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredStudents.slice(startIndex, endIndex);
  }, [currentPage, rowsPerPage, filteredStudents]);

  // Manejador para el cambio de página
  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  // Resetear página cuando cambie el término de búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Manejar cambio en calificación
  const handleQualificationChange = (courseInscriptionId: number, value: string) => {
    // Validar que el valor esté entre 0 y 20
    const numValue = parseFloat(value);
    if (value !== '' && (isNaN(numValue) || numValue < 0 || numValue > 20)) {
      return; // No actualizar si está fuera del rango
    }
    
    setEditedQualifications(prev => ({
      ...prev,
      [courseInscriptionId]: {
        ...prev[courseInscriptionId],
        qualification: value
      }
    }));
  };

  // Manejar cambio en "no presentó"
  const handleDidNotPresentChange = (courseInscriptionId: number, checked: boolean) => {
    setEditedQualifications(prev => ({
      ...prev,
      [courseInscriptionId]: {
        qualification: checked ? '' : prev[courseInscriptionId]?.qualification || '',
        didNotPresent: checked
      }
    }));
  };

  // Guardar todas las calificaciones
  const handleSaveAll = async () => {
    try {
      setIsSaving(true);
      dispatch(setIsLoading(true));

      // Preparar datos para el bulk update
      const qualifications: UpdateQualificationData[] = Object.entries(editedQualifications).map(([courseInscriptionId, data]) => ({
        courseInscriptionId: parseInt(courseInscriptionId),
        qualification: data.didNotPresent ? null : (data.qualification ? parseFloat(data.qualification) : null),
        didNotPresent: data.didNotPresent
      }));

      const bulkData: BulkUpdateQualificationsData = {
        qualifications
      };

      // Llamar al servicio de actualización masiva
      const success = await updateBulkQualifications(evaluationId, bulkData);
      
      if (success) {
        dispatch(setSuccessMessage('Calificaciones actualizadas correctamente'));
        // Recargar estudiantes para mostrar datos actualizados
        loadStudentsByEvaluation(evaluationId);
      }
    } catch (error) {
      console.error('Error saving qualifications:', error);
      if (error instanceof BackendError) {
        dispatch(setErrorMessage(`Error al guardar calificaciones: ${error.message}`));
      } else {
        dispatch(setErrorMessage('Error inesperado al guardar calificaciones'));
      }
    } finally {
      setIsSaving(false);
      dispatch(setIsLoading(false));
    }
  };

  // Verificar si hay cambios pendientes
  const hasChanges = () => {
    return students.some(student => {
      const edited = editedQualifications[student.courseInscriptionId];
      if (!edited) return false;
      
      const currentQualification = student.qualification !== null ? student.qualification.toString() : '';
      return edited.qualification !== currentQualification || edited.didNotPresent !== student.didNotPresent;
    });
  };

  // Renderizar celda de calificación
  const renderQualificationCell = (student: StudentEvaluationQualification) => {
    const editedData = editedQualifications[student.courseInscriptionId] || {
      qualification: student.qualification !== null ? student.qualification.toString() : '',
      didNotPresent: student.didNotPresent
    };

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
        onChange={(e) => handleQualificationChange(student.courseInscriptionId, e.target.value)}
        type="number"
        inputProps={{ min: 0, max: 20, step: 0.5 }}
        sx={{ width: '100px' }}
        placeholder="0-20"
      />
    );
  };

  // Renderizar celda de "No presentó"
  const renderDidNotPresentCell = (student: StudentEvaluationQualification) => {
    const editedData = editedQualifications[student.courseInscriptionId] || {
      qualification: student.qualification !== null ? student.qualification.toString() : '',
      didNotPresent: student.didNotPresent
    };

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.2 }}>
        <Checkbox
          checked={editedData.didNotPresent}
          onChange={(e) => handleDidNotPresentChange(student.courseInscriptionId, e.target.checked)}
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

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" my={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" my={3}>
        <Typography color="error" gutterBottom>
          Error al cargar los estudiantes: {error.message}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => loadStudentsByEvaluation(evaluationId)}
        >
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Estudiantes</Typography>
        <Box display="flex" gap={2} alignItems="center">
          <TextField
            placeholder="Buscar por nombre, apellido o cédula..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <IconSearch size={18} stroke={1.5} style={{ marginRight: '8px' }} />
            }}
          />
          <Button
            variant="outlined"
            color="primary"
            startIcon={<IconDeviceFloppy size={18} />}
            onClick={handleSaveAll}
            disabled={!hasChanges() || isSaving}
            sx={{ minWidth: '120px' }}
          >
            {isSaving ? 'Guardando...' : 'Guardar'}
          </Button>
        </Box>
      </Box>

      {students.length === 0 ? (
        <Typography align="center">No hay estudiantes asignados a esta evaluación</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Apellido</TableCell>
                <TableCell>Cédula</TableCell>
                <TableCell align="center">Calificación</TableCell>
                <TableCell align="center">No presentó</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedStudents.map((student) => (
                <TableRow key={student.courseInscriptionId} sx={{ '& td': { paddingY: 1 } }}>
                  <TableCell sx={{ paddingY: 1 }}>{student.name}</TableCell>
                  <TableCell sx={{ paddingY: 1 }}>{student.lastName}</TableCell>
                  <TableCell sx={{ paddingY: 1 }}>{student.dni}</TableCell>
                  <TableCell align="center" sx={{ paddingY: 1 }}>{renderQualificationCell(student)}</TableCell>
                  <TableCell align="center" sx={{ paddingY: 1 }}>{renderDidNotPresentCell(student)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Paginación */}
      {filteredStudents.length > 0 && (
        <Box sx={{ 
          marginTop: '12px',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'row'
        }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            variant="outlined"
            shape="rounded"
            color="primary"
            onChange={handlePageChange}
          />
        </Box>
      )}
    </Box>
  );
};

export default StudentsList; 