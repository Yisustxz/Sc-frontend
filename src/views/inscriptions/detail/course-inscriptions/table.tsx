import { FunctionComponent, useCallback } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { 
  IconCertificate, 
  IconEdit, 
  IconTrash 
} from '@tabler/icons';
import DynamicTable from 'components/DynamicTable';
import { AttemptType, CourseInscriptionDto } from 'core/inscriptions/types';

interface CourseInscriptionTableProps {
  data: CourseInscriptionDto[];
  onEdit?: (course: any) => void;
  onDelete?: (course: any) => void;
}

const CourseInscriptionTable: FunctionComponent<CourseInscriptionTableProps> = ({
  data,
  onEdit,
  onDelete
}) => {
  // Función para formatear el tipo de intento
  const getAttemptTypeLabel = useCallback((type: AttemptType | undefined): string => {
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
  }, []);

  return (
    <DynamicTable
      headers={[
        {
          columnLabel: 'Asignatura', 
          cellAlignment: 'left',
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
      rows={data.map(ci => ({
        id: ci.id,
        course: ci.courseSchoolYear?.course,
        attemptType: ci.attemptType || undefined,
        endQualification: ci.endQualification || null
      }))}
      components={[
        (row) => (
          <Button
            size="small"
            onClick={() => onEdit && onEdit(row)}
            startIcon={<IconEdit color="#2196f3" size="1rem" />}
          >
            Editar
          </Button>
        ),
        (row) => (
          <Button
            color="secondary"
            size="small"
            onClick={() => onDelete && onDelete(row)}
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
  );
};

export default CourseInscriptionTable; 