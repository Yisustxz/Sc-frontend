import { FunctionComponent, useState, useMemo } from 'react';
import { Box, Typography, CircularProgress, Pagination } from '@mui/material';
import { StudentsProps } from './types';
import StudentsTable from './StudentsTable';
import { StudentOfCourse } from 'core/evaluations/types';
import styled from 'styled-components';

const Students: FunctionComponent<StudentsProps & { className?: string }> = ({
  courseSchoolYearId,
  students: initialStudents = [],
  loading: initialLoading = false,
  onViewStudentDetails,
  onViewStudentGrades,
  className
}) => {
  // Estado de la tabla y paginación
  const [currentPage, setCurrentPage] = useState(1); // Página actual (inicia en 1 para MUI Pagination)
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(initialLoading);

  // Usar estudiantes recibidos por prop o un array vacío si no hay
  const studentsData = initialStudents.length > 0 ? initialStudents : [];

  // Calcular el número total de páginas
  const totalItems = studentsData.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage) || 1; // Asegurar que siempre haya al menos 1 página

  // Obtener los estudiantes para la página actual
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return studentsData.slice(startIndex, endIndex);
  }, [currentPage, rowsPerPage, studentsData]);

  // Manejador para el cambio de página
  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  // Mostrar cargando
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Si no hay estudiantes, mostrar mensaje
  if (studentsData.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body1" color="textSecondary">
          No hay estudiantes inscritos en este curso
        </Typography>
      </Box>
    );
  }

  return (
    <div className={className}>
      <StudentsTable
        students={paginatedStudents}
        loading={loading}
        onViewStudentDetails={onViewStudentDetails}
        onViewStudentGrades={onViewStudentGrades}
        page={currentPage - 1} // Para compatibilidad con interfaces existentes
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        onPageChange={() => { }} // No se usa, manejamos la paginación con el componente Pagination
        onRowsPerPageChange={() => { }} // No se usa por ahora
      />

      {/* Paginación */}
      <div className="paginator-container">
        <Pagination
          count={totalPages}
          page={currentPage}
          variant="outlined"
          shape="rounded"
          color="primary"
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default styled(Students)`
  .paginator-container {
    margin-top: 12px;
    display: flex;
    justify-content: center;
    flex-direction: row;
  }
`;
