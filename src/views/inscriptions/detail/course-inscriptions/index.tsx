import { FunctionComponent, useState, useCallback, useMemo } from 'react';
import { Box, Button, Typography, Pagination } from '@mui/material';
import MainCard from 'components/cards/MainCard';
import { IconBookUpload } from '@tabler/icons';
import { CourseInscriptionDto } from 'core/inscriptions/types';
import CourseInscriptionTable from './table';

// Cantidad de elementos por página
const ITEMS_PER_PAGE = 8;

interface CourseInscriptionsProps {
  inscriptions: CourseInscriptionDto[];
  className?: string;
}

const CourseInscriptions: FunctionComponent<CourseInscriptionsProps> = ({
  inscriptions,
  className
}) => {
  // Estado para la paginación local
  const [page, setPage] = useState(1);

  // Manejador de cambio de página
  const handlePageChange = useCallback((event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  }, []);

  // Obtener las inscripciones para la página actual
  const paginatedInscriptions = useMemo(() => {
    if (!inscriptions?.length) return [];
    
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    
    return inscriptions.slice(startIndex, endIndex);
  }, [inscriptions, page]);

  // Calcular el número total de páginas
  const totalPages = useMemo(() => {
    if (!inscriptions?.length) return 0;
    return Math.ceil(inscriptions.length / ITEMS_PER_PAGE);
  }, [inscriptions]);

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
    <MainCard title={`Materias Inscritas (${inscriptions?.length || 0})`} className={className}>
      {inscriptions && inscriptions.length > 0 ? (
        <>
          <CourseInscriptionTable 
            data={paginatedInscriptions}
            onEdit={handleEdit}
            onDelete={handleDelete}
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
  );
};

export default CourseInscriptions; 