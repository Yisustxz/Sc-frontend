import { FunctionComponent } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  IconButton,
  Button
} from '@mui/material';
import { IconEye, IconNotes } from '@tabler/icons';
import { StudentsTableProps } from './types';
import DynamicTable from 'components/DynamicTable';

const StudentsTable: FunctionComponent<StudentsTableProps> = ({
  students,
  loading,
  onViewStudentDetails,
  page,
  totalPages,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange
}) => {
  // Si está cargando, mostrar indicador
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Si no hay estudiantes, mostrar mensaje
  if (students.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body1" color="textSecondary">
          No hay estudiantes inscritos en este curso
        </Typography>
      </Box>
    );
  }

  // Definir los headers para el DynamicTable
  const headers = [
    {
      columnLabel: 'Estudiante',
      cellAlignment: 'left' as const,
      onRender: (row: any) => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {row.name} {row.lastName}
          </Typography>
          {row.dni && (
            <Typography variant="caption" color="textSecondary">
              CI: {row.dni}
            </Typography>
          )}
        </Box>
      )
    },
    {
      columnLabel: 'DNI',
      fieldName: 'dni',
      cellAlignment: 'left' as const
    }
  ];

  // Crear componentes para las acciones
  const components = [
    (row: any) => (
      <Box sx={{ display: 'flex', gap: 1 }}>
        {/* Botón para ver notas */}
        <Button
          size="small"
          variant="outlined"
          color="primary"
          onClick={() => {}}
          startIcon={<IconNotes size="1rem" />}
        >
          Notas
        </Button>

        {/* Botón para ver detalles del estudiante si la función está disponible */}
        {onViewStudentDetails && (
          <Button
            size="small"
            variant="outlined"
            color="secondary"
            onClick={() => onViewStudentDetails(row.id)}
            startIcon={<IconEye size="1rem" />}
          >
            Detalles
          </Button>
        )}
      </Box>
    )
  ];

  return (
    <Box sx={{ mt: 2 }}>
      <DynamicTable
        headers={headers}
        rows={students}
        components={components}
        emptyState={
          <Typography variant="body2" color="textSecondary">
            No hay estudiantes inscritos en este curso
          </Typography>
        }
      />
      {/* La paginación la manejamos fuera del DynamicTable */}
      {students.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          {/* Implementar paginación aquí si es necesario */}
        </Box>
      )}
    </Box>
  );
};

export default StudentsTable; 