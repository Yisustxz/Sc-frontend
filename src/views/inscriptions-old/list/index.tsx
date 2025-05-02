import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  MenuItem,
  IconButton,
  Chip
} from '@mui/material';
import MainCard from 'components/cards/MainCard';
import { IconPlus, IconSearch, IconEdit, IconTrash, IconEye } from '@tabler/icons';
import useGetSchoolYears from 'services/hooks/use-get-school-years';
import { useInscriptions } from '../hooks/use-inscriptions';
import { gradeMapping, EducationLevels } from 'core/courses/use-education-levels';
import { LoadingButton } from '@mui/lab';

interface InscriptionsListProps {
  className?: string;
}

const EMPTY_ARRAY_REF = [] as any[];

const InscriptionsList: React.FC<InscriptionsListProps> = ({ className }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [schoolYearId, setSchoolYearId] = useState('');
  const [grade, setGrade] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isSearching, setIsSearching] = useState(false);

  // Cargar años escolares para el filtro
  const { data: schoolYears = [], isLoading: loadingSchoolYears } = useGetSchoolYears(EMPTY_ARRAY_REF, '');
  
  // Obtener inscripciones
  const { 
    inscriptions, 
    totalItems, 
    loading, 
    fetchInscriptions, 
    deleteInscription 
  } = useInscriptions();

  // Cargar inscripciones al montar
  useEffect(() => {
    handleSearch();
  }, [page, rowsPerPage]);

  // Manejar la búsqueda
  const handleSearch = () => {
    setIsSearching(true);
    fetchInscriptions({
      page: page + 1,
      perPage: rowsPerPage,
      schoolYearId: schoolYearId ? parseInt(schoolYearId) : undefined,
      gradeFilter: grade || undefined,
      search: searchTerm || undefined
    }).finally(() => {
      setIsSearching(false);
    });
  };

  // Manejar cambios en la paginación
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Navegar a la página de detalle
  const handleViewDetails = (id: number) => {
    navigate(`/inscriptions/${id}`);
  };

  // Navegar a la página de edición
  const handleEdit = (id: number) => {
    navigate(`/inscriptions/edit/${id}`);
  };

  // Confirmación para eliminar inscripción
  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro que desea eliminar esta inscripción?')) {
      try {
        await deleteInscription(id);
        // Recargar la lista
        handleSearch();
      } catch (error) {
        console.error('Error al eliminar la inscripción:', error);
        alert('No se pudo eliminar la inscripción. Por favor intente nuevamente.');
      }
    }
  };

  // Navegar a la página de creación
  const handleCreateNew = () => {
    navigate('/inscriptions/create');
  };

  // Opciones de grado basadas en gradeMapping
  const gradeOptions = Object.entries(gradeMapping).map(([value, label]) => ({
    value,
    label
  }));

  return (
    <div className={className}>
      <MainCard 
        title="Inscripciones"
        secondary={
          <Button
            variant="contained"
            color="primary"
            startIcon={<IconPlus />}
            onClick={handleCreateNew}
          >
            Nueva Inscripción
          </Button>
        }
      >
        {/* Filtros */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Buscar por nombre de estudiante"
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={handleSearch}>
                        <IconSearch fontSize="small" />
                      </IconButton>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Año Escolar"
                  variant="outlined"
                  value={schoolYearId}
                  onChange={(e) => setSchoolYearId(e.target.value)}
                  disabled={loadingSchoolYears}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {schoolYears.map((year: any) => (
                    <MenuItem key={year.id} value={year.id}>
                      {year.code}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Grado"
                  variant="outlined"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {gradeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <LoadingButton
                  loading={isSearching}
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleSearch}
                  startIcon={<IconSearch />}
                >
                  Buscar
                </LoadingButton>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Tabla de resultados */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Estudiante</TableCell>
                <TableCell>Año Escolar</TableCell>
                <TableCell>Grado</TableCell>
                <TableCell>Asignaturas</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Cargando inscripciones...
                  </TableCell>
                </TableRow>
              ) : inscriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No se encontraron inscripciones con los criterios de búsqueda.
                  </TableCell>
                </TableRow>
              ) : (
                inscriptions.map((inscription) => (
                  <TableRow key={inscription.id}>
                    <TableCell>{inscription.id}</TableCell>
                    <TableCell>
                      {inscription.student?.name || 'Estudiante no disponible'}
                    </TableCell>
                    <TableCell>
                      {inscription.schoolYear?.code || 'No asignado'}
                    </TableCell>
                    <TableCell>
                      {gradeOptions.find(g => g.value === inscription.grade)?.label || inscription.grade}
                    </TableCell>
                    <TableCell>
                      {inscription.courseInscriptions ? (
                        <Chip 
                          label={`${inscription.courseInscriptions.length} asignaturas`} 
                          color="primary" 
                          variant="outlined" 
                          size="small" 
                        />
                      ) : (
                        'Sin asignaturas'
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <IconButton 
                          color="primary" 
                          size="small"
                          onClick={() => handleViewDetails(inscription.id)}
                        >
                          <IconEye size={18} />
                        </IconButton>
                        <IconButton 
                          color="secondary" 
                          size="small"
                          onClick={() => handleEdit(inscription.id)}
                        >
                          <IconEdit size={18} />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          size="small"
                          onClick={() => handleDelete(inscription.id)}
                        >
                          <IconTrash size={18} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Paginación */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalItems}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </MainCard>
    </div>
  );
};

export default styled(InscriptionsList)`
  .MuiCardContent-root {
    padding-top: 16px;
    padding-bottom: 16px;
  }

  .MuiTableCell-root {
    padding: 12px 16px;
  }
`; 