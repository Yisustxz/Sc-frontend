import { useCallback } from 'react';
import MainCard from 'components/cards/MainCard';
import Table from './table';
import usePaginate from './use-paginate';
import { useNavigate } from 'react-router';
import { styled } from 'styled-components';
import { Button, Typography, TextField, InputAdornment, Box, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { IconCirclePlus, IconSearch } from '@tabler/icons';

const CoursesPage = ({ className }: Props) => {
  const navigate = useNavigate();
  const { 
    courses, 
    paginate, 
    setPage, 
    fetchCourses, 
    setSearchTerm, 
    grade,
    setGrade 
  } = usePaginate();

  const goToCreate = useCallback(() => {
    navigate('/courses/create');
  }, [navigate]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, [setSearchTerm]);

  const handleGradeChange = useCallback((e: SelectChangeEvent) => {
    setGrade(e.target.value === '' ? '' : Number(e.target.value));
  }, [setGrade]);

  // Opciones para el selector de grado
  const gradeOptions = [
    { value: '', label: 'Todos los grados' },
    { value: 1, label: '1er Grado' },
    { value: 2, label: '2do Grado' },
    { value: 3, label: '3er Grado' },
    { value: 4, label: '4to Grado' },
    { value: 5, label: '5to Grado' },
    { value: 6, label: '6to Grado' },
    { value: 7, label: '1er Año' },
    { value: 8, label: '2do Año' },
    { value: 9, label: '3er Año' },
    { value: 10, label: '4to Año' },
    { value: 11, label: '5to Año' },
  ];

  return (
    <MainCard className={className} headerClass={'page-header'} title={
      <div className={'page-header'}>
        <Typography variant="h3" className={'title-header'}>Asignaturas</Typography>
        <Box className={'actions-container'}>
          <TextField
            className={'search-field'}
            placeholder="Buscar por nombre"
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
          <FormControl
            className={'filter-field'}
            variant="outlined"
            size="small"
          >
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
          <Button
            color="primary"
            variant={'outlined'}
            onClick={goToCreate}
            startIcon={<IconCirclePlus />}
          >
            Crear
          </Button>
        </Box>
      </div>
    }>
      <Table items={courses} paginate={paginate} onChange={setPage} fetchItems={fetchCourses}/>
    </MainCard>
  );
};

interface Props {
  className?: string;
}

export default styled(CoursesPage)`
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
    width: 280px;
  }

  .filter-field {
    width: 150px;
  }
`;
