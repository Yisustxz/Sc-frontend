import { useCallback, useState, useMemo } from 'react';
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
  Autocomplete,
  SelectChangeEvent
} from '@mui/material';
import { IconCirclePlus, IconSearch, IconCalendar, IconSchool } from '@tabler/icons';
import usePaginate from './use-paginate';
import useGetSchoolYears from 'services/hooks/use-get-school-years';
import { gradeMapping, EducationLevels } from 'core/courses/use-education-levels';
import { SchoolYearSelect } from 'core/school-year/types';

interface Props {
  className?: string;
}

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

  // Estados para autocompletado de año escolar
  const [schoolYearInputValue, setSchoolYearInputValue] = useState('');
  const [schoolYearSearchTerm, setSchoolYearSearchTerm] = useState('');
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<SchoolYearSelect | null>(null);

  // Cargar años escolares para el filtro
  const { data: schoolYears = [], isLoading: loadingSchoolYears } = useGetSchoolYears(schoolYearSearchTerm);

  // Ir a la página de creación
  const goToCreate = useCallback(() => {
    navigate('/inscriptions/create');
  }, [navigate]);

  // Manejar cambio en el campo de búsqueda
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, [setSearchTerm]);

  // Manejador para cambios en el autocompletado de año escolar
  const handleSchoolYearInputChange = useCallback(
    (event: React.SyntheticEvent, newInputValue: string) => {
      setSchoolYearInputValue(newInputValue);
      setSchoolYearSearchTerm(newInputValue);
    },
    []
  );

  // Manejador para seleccionar un año escolar
  const handleSchoolYearChange = useCallback(
    (event: React.SyntheticEvent, newValue: SchoolYearSelect | null) => {
      setSelectedSchoolYear(newValue);
      setSchoolYearId(newValue ? newValue.id : undefined);
    },
    [setSchoolYearId]
  );

  // Manejador para cambio de grado
  const handleGradeChange = useCallback(
    (event: SelectChangeEvent) => {
      setGradeFilter(event.target.value || undefined);
    },
    [setGradeFilter]
  );

  // Opciones de grado basadas en gradeMapping para el filtro
  const gradeOptions = useMemo(() => {
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
  }, []);

  return (
    <MainCard 
      className={className} 
      headerClass="page-header" 
      title={
        <div className="page-header">
          <Typography variant="h3" className="title-header">Inscripciones</Typography>
          <Box className="actions-container">
            <TextField
              className="search-field"
              placeholder="Buscar por nombre de estudiante"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch size="1.1rem" />
                  </InputAdornment>
                ),
                size: "small"
              }}
              variant="outlined"
              size="small"
            />

            <Autocomplete
              className="school-year-filter-field"
              options={Array.isArray(schoolYears) ? schoolYears : []}
              getOptionLabel={(option: SchoolYearSelect) => option.code}
              inputValue={schoolYearInputValue}
              onInputChange={handleSchoolYearInputChange}
              onChange={handleSchoolYearChange}
              loading={loadingSchoolYears}
              loadingText="Cargando años escolares..."
              noOptionsText="No se encontraron años escolares"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Año Escolar"
                  variant="outlined"
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <IconCalendar size="1.1rem" />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />

            <FormControl className="filter-field" variant="outlined" size="small">
              <InputLabel>Grado</InputLabel>
              <Select
                value={gradeFilter || ''}
                onChange={handleGradeChange}
                label="Grado"
              >
                {gradeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              color="primary"
              variant="outlined"
              onClick={goToCreate}
              startIcon={<IconCirclePlus />}
            >
              Crear
            </Button>
          </Box>
        </div>
      }
    >
      <Table
        items={inscriptions}
        paginate={paginate}
        onChange={setPage}
        fetchItems={fetchInscriptions}
      />
    </MainCard>
  );
};

export default styled(InscriptionsPage)`
  width: 100%;
  display: flex;
  flex-direction: column;

  .page-header {
    flex: 1;
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
  }

  .title-header {
    font-size: 1.25rem;
  }

  .actions-container {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .search-field {
    width: 250px;
  }

  .filter-field {
    width: 150px;
  }

  .school-year-filter-field {
    width: 200px;
  }
`;
