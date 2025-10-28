import { useCallback, useEffect, useState, useMemo } from 'react';
import MainCard from 'components/cards/MainCard';
import Table from './table';
import usePaginate from './use-paginate';
import { useNavigate } from 'react-router';
import { styled } from 'styled-components';
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
import { IconCirclePlus, IconSearch, IconCalendar } from '@tabler/icons';
import { useAppDispatch, useAppSelector } from 'store';
import { setIsLoading, setErrorMessage } from 'store/customizationSlice';
import BackendError from 'exceptions/backend-error';
import { gradeMapping, EducationLevels } from 'core/courses/use-education-levels';
import useGetSchoolYears from 'services/hooks/use-get-school-years';
import useGetEmployees from 'services/hooks/use-get-employees';
import { TypeEmployee, Employees } from 'core/employees/types';
import { SchoolYearSelect } from 'core/school-year/types';
import { Role } from 'constants/roles';

// Constantes
const PROFESSOR_SEARCH_LIMIT = 10;

// Referencia estable para arrays vacíos - Previene bucles infinitos de renderizado
// NUNCA usar arrays vacíos inline como dependencias en hooks (ej: [])
const EMPTY_ARRAY_REFERENCE: any[] = [];

interface Props {
  className?: string;
}

const CourseSchoolYearPage = ({ className }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userRole = useAppSelector((state) => state.auth.user?.role);
  const userProfessors = useAppSelector((state) => state.auth.user?.professors || []);

  const { 
    courseSchoolYears, 
    paginate, 
    setPage, 
    fetchCourseSchoolYears,
    setSearchTerm,
    grade,
    setGrade,
    schoolYearId,
    setSchoolYearId,
    professorId,
    setProfessorId
  } = usePaginate();

  const [professorInputValue, setProfessorInputValue] = useState('');
  const [professorSearchTerm, setProfessorSearchTerm] = useState("");
  const [selectedProfessor, setSelectedProfessor] = useState<Employees | null>(null);
  const [schoolYearInputValue, setSchoolYearInputValue] = useState('');
  const [schoolYearSearchTerm, setSchoolYearSearchTerm] = useState('');
  const [selectedSchoolYear, setSelectedSchoolYear] = useState<SchoolYearSelect | null>(null);

  const professorIdsFilter = useMemo(() => {
    return userRole === Role.TEACHER && userProfessors.length > 0
      ? userProfessors
      : EMPTY_ARRAY_REFERENCE;
  }, [userRole, userProfessors]);

  // Obtener años escolares
  const { data: schoolYears = [], isLoading: isLoadingSchoolYears } = useGetSchoolYears(EMPTY_ARRAY_REFERENCE, schoolYearSearchTerm);

  // Obtener profesores
  const { 
    data: professors = [], 
    isLoading: isLoadingProfessors 
  } = useGetEmployees(
    professorIdsFilter, 
    professorSearchTerm, 
    PROFESSOR_SEARCH_LIMIT, 
    TypeEmployee.Professor
  );

  // Manejador para cambios en la búsqueda
  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
    },
    [setSearchTerm]
  );

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
      setSchoolYearId(newValue ? newValue.id : '');
    },
    [setSchoolYearId]
  );

  // Manejador para cambio de grado
  const handleGradeChange = useCallback(
    (event: SelectChangeEvent) => {
      setGrade(event.target.value === '' ? '' : Number(event.target.value));
    },
    [setGrade]
  );

  // Manejador para cambios en el autocompletado de profesor
  const handleProfessorInputChange = useCallback(
    (event: React.SyntheticEvent, newInputValue: string) => {
      setProfessorInputValue(newInputValue);
      setProfessorSearchTerm(newInputValue);
    },
    []
  );

  // Manejador para seleccionar un profesor
  const handleProfessorChange = useCallback(
    (event: React.SyntheticEvent, newValue: Employees | null) => {
      setSelectedProfessor(newValue);
      setProfessorId(newValue ? newValue.id : '');
    },
    [setProfessorId]
  );

  useEffect(() => {
    if (userRole === Role.TEACHER && userProfessors.length > 0 && professors.length > 0 && !selectedProfessor) {
      const firstProfessor = professors.find(p => p.id === userProfessors[0]);
      if (firstProfessor) {
        setSelectedProfessor(firstProfessor);
        setProfessorId(firstProfessor.id);
      }
    }
  }, [userRole, userProfessors, professors, selectedProfessor, setProfessorId]);

  // Navegar a la página de creación
  const handleNavigateToCreate = useCallback(() => {
    navigate('/course-school-year/create');
  }, [navigate]);

  // Opciones para el selector de grado usando el mapeo centralizado
  const gradeOptions = useMemo(() => {
    // Opción para mostrar todos los grados
    const allGradesOption = { value: '', label: 'Todos los grados' };
    
    // Opciones basadas en EducationLevels y gradeMapping
    const options = Object.values(EducationLevels)
      .filter(value => !isNaN(Number(value)))
      .map(grade => ({
        value: Number(grade),
        label: gradeMapping[grade as EducationLevels]
      }));
    
    // Ordenar por grado (valor numérico)
    const sortedOptions = [...options].sort((a, b) => Number(a.value) - Number(b.value));
    
    return [allGradesOption, ...sortedOptions];
  }, []);

  return (
    <MainCard className={className} headerClass={'page-header'} title={
      <div className={'page-header'}>
        <Typography variant="h3" className={'title-header'}>Asignaturas por Año Escolar</Typography>
        <Box className={'actions-container'}>
          <TextField
            className={'search-field'}
            placeholder="Buscar por asignatura"
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
            loading={isLoadingSchoolYears}
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
              value={String(grade)}
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

          <Autocomplete
            className="professor-filter-field"
            options={Array.isArray(professors) ? professors : []}
            getOptionLabel={(option: Employees) => 
              `${option.name || ''} ${option.lastName || ''}`
            }
            value={selectedProfessor}
            inputValue={professorInputValue}
            onInputChange={handleProfessorInputChange}
            onChange={handleProfessorChange}
            loading={isLoadingProfessors}
            loadingText="Cargando profesores..."
            noOptionsText="No se encontraron profesores"
            disabled={userRole === Role.TEACHER}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Profesor"
                variant="outlined"
                size="small"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          <Button
            color="primary"
            variant={'outlined'}
            onClick={handleNavigateToCreate}
            startIcon={<IconCirclePlus />}
          >
            Crear
          </Button>
        </Box>
      </div>
    }>
      <Table 
        items={courseSchoolYears} 
        paginate={paginate} 
        onChange={setPage} 
        fetchItems={fetchCourseSchoolYears}
      />
    </MainCard>
  );
};

export default styled(CourseSchoolYearPage)`
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

  .professor-filter-field,
  .school-year-filter-field {
    width: 200px;
  }
`; 