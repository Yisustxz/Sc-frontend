import { useCallback } from 'react';
import MainCard from 'components/cards/MainCard';
import Table from './table';
import { useNavigate } from 'react-router';
import styled from 'styled-components';
import { 
  Button, 
  Typography, 
  TextField, 
  InputAdornment, 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Grid
} from '@mui/material';
import { IconCirclePlus, IconSearch, IconCalendar, IconSchool } from '@tabler/icons';
import usePaginate from './use-paginate';
import useGetSchoolYears from 'services/hooks/use-get-school-years';
import { gradeMapping, EducationLevels } from 'core/courses/use-education-levels';

const EMPTY_ARRAY_REF = [] as any[];

const InscriptionsPage = ({ className }: Props) => {
  const navigate = useNavigate();
  const { 
    inscriptions, 
    paginate, 
    setPage, 
    fetchInscriptions,
    searchTerm,
    setSearchTerm,
    schoolYearId,
    setSchoolYearId,
    gradeFilter,
    setGradeFilter
  } = usePaginate();

  // Cargar años escolares para el filtro
  const { data: schoolYears = [], isLoading: loadingSchoolYears } = useGetSchoolYears(EMPTY_ARRAY_REF, '');

  // Ir a la página de creación
  const goToCreate = useCallback(() => {
    navigate('/inscriptions/create');
  }, [navigate]);

  // Manejar cambio en el campo de búsqueda
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, [setSearchTerm]);

  // Opciones de grado basadas en gradeMapping para el filtro
  const gradeOptions = useCallback(() => {
    // Opción para mostrar todos los grados
    const allGradesOption = { value: '', label: 'Todos los grados' };
    
    // Opciones basadas en EducationLevels y gradeMapping
    const options = Object.values(EducationLevels)
      .filter(value => !isNaN(Number(value)))
      .map(grade => ({
        value: String(grade),
        label: gradeMapping[grade as EducationLevels]
      }));
    
    // Ordenar por grado (valor numérico)
    const sortedOptions = [...options].sort((a, b) => Number(a.value) - Number(b.value));
    
    return [allGradesOption, ...sortedOptions];
  }, [])();

  return (
    <div className={className}>
      <Typography variant="h4" className="page-title">
        Inscripciones
      </Typography>

      <Box className="filters-container">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4} lg={3}>
            <TextField
              className="search-field"
              placeholder="Buscar por nombre de estudiante"
              value={searchTerm}
              onChange={handleSearchChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch size="1.1rem" />
                  </InputAdornment>
                )
              }}
              variant="outlined"
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={2}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Año Escolar</InputLabel>
              <Select
                value={schoolYearId || ''}
                onChange={(e) => setSchoolYearId(e.target.value ? Number(e.target.value) : undefined)}
                label="Año Escolar"
                IconComponent={() => <IconCalendar size="1rem" className="select-icon" />}
              >
                <MenuItem value="">Todos</MenuItem>
                {schoolYears.map((year) => (
                  <MenuItem key={year.id} value={year.id}>
                    {year.code}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3} lg={2}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Grado</InputLabel>
              <Select
                value={gradeFilter || ''}
                onChange={(e) => setGradeFilter(e.target.value || undefined)}
                label="Grado"
                IconComponent={() => <IconSchool size="1rem" className="select-icon" />}
              >
                {gradeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2} lg={2} className="search-btn-container">
            <Button
              color="primary"
              variant="contained"
              fullWidth
              startIcon={<IconSearch />}
              className="search-button"
            >
              Buscar
            </Button>
          </Grid>

          <Grid item xs={12} sm={6} md={2} lg={2} container justifyContent="flex-end">
            <Button
              color="primary"
              variant="contained"
              onClick={goToCreate}
              startIcon={<IconCirclePlus />}
              className="create-button"
            >
              Nueva Inscripción
            </Button>
          </Grid>
        </Grid>
      </Box>

      <MainCard className="table-card">
        <Table
          items={inscriptions}
          paginate={paginate}
          onChange={setPage}
          fetchItems={fetchInscriptions}
        />
      </MainCard>
    </div>
  );
};

interface Props {
  className?: string;
}

export default styled(InscriptionsPage)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;

  .page-title {
    font-weight: 500;
    margin-bottom: 10px;
  }

  .filters-container {
    padding: 16px;
    border-radius: 12px;
    background-color: #fff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }

  .search-field {
    width: 100%;
  }

  .select-icon {
    position: absolute;
    right: 7px;
    color: rgba(0, 0, 0, 0.54);
    pointer-events: none;
  }

  .search-button {
    height: 40px;
    font-weight: 500;
    text-transform: none;
  }

  .create-button {
    height: 40px;
    font-weight: 500;
    text-transform: none;
    padding: 0 16px;
    white-space: nowrap;
  }

  .table-card {
    margin-top: 16px;
  }

  /* Responsive adjustments */
  @media (max-width: 960px) {
    .search-btn-container {
      order: 3;
    }
  }
`; 